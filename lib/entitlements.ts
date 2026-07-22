import { promises as fs } from "fs";
import path from "path";
import type { PlanId } from "@/lib/pricing";

/**
 * Durable plan state keyed by Pikbo session id.
 * Cookie sessions alone cannot be updated by Stripe webhooks (no browser).
 * This store is the source of truth for paid plan after checkout / renew / cancel.
 *
 * Development fallback: JSON file under data/.
 * Production: Supabase is mandatory so Stripe updates survive restarts and
 * are visible to every application instance.
 */

export type Entitlement = {
  sessionId: string;
  plan: PlanId;
  credits?: number;
  /** When this differs from cookie periodKey, cookie credits are reset from `credits`. */
  periodKey?: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  status: "active" | "canceled" | "past_due";
  updatedAt: string;
};

type Store = Record<string, Entitlement>;

type EntitlementRow = {
  session_id: string;
  plan: PlanId;
  credits: number | null;
  period_key: string | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  status: Entitlement["status"];
  updated_at: string;
};

function supabaseConfig() {
  return {
    url: process.env.SUPABASE_URL?.replace(/\/$/, "") ?? "",
    key: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
  };
}

function supabaseConfigured(): boolean {
  const { url, key } = supabaseConfig();
  return Boolean(url && key);
}

async function supabaseEntitlements<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const { url, key } = supabaseConfig();
  const response = await fetch(`${url}/rest/v1/${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      ...init.headers,
    },
  });
  if (!response.ok) {
    throw new Error(`Supabase entitlement request failed (${response.status})`);
  }
  if (response.status === 204) return undefined as T;
  const body = await response.text();
  return (body ? JSON.parse(body) : null) as T;
}

function entitlementFromRow(row: EntitlementRow): Entitlement {
  return {
    sessionId: row.session_id,
    plan: row.plan,
    ...(typeof row.credits === "number" ? { credits: row.credits } : {}),
    ...(row.period_key ? { periodKey: row.period_key } : {}),
    ...(row.stripe_customer_id
      ? { stripeCustomerId: row.stripe_customer_id }
      : {}),
    ...(row.stripe_subscription_id
      ? { stripeSubscriptionId: row.stripe_subscription_id }
      : {}),
    status: row.status,
    updatedAt: row.updated_at,
  };
}

function storePath(): string {
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "Durable entitlements are not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
    );
  }
  // Statically scoped under ./data so bundlers don't NFT the whole project
  return path.join(
    /* turbopackIgnore: true */ process.cwd(),
    "data",
    "entitlements.json"
  );
}

async function readStore(): Promise<Store> {
  const file = storePath();
  try {
    const raw = await fs.readFile(file, "utf8");
    return JSON.parse(raw) as Store;
  } catch {
    return {};
  }
}

async function writeStore(store: Store): Promise<void> {
  const file = storePath();
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, JSON.stringify(store, null, 2), "utf8");
}

export async function getEntitlement(
  sessionId: string
): Promise<Entitlement | null> {
  if (supabaseConfigured()) {
    const rows = await supabaseEntitlements<EntitlementRow[]>(
      `pikbo_subscriptions?session_id=eq.${encodeURIComponent(sessionId)}&limit=1`
    );
    return rows[0] ? entitlementFromRow(rows[0]) : null;
  }
  // Public validation mode can remain browseable without billing. Mutating
  // payment paths below still fail closed unless Supabase is configured.
  if (process.env.NODE_ENV === "production") return null;
  const store = await readStore();
  return store[sessionId] ?? null;
}

export async function upsertEntitlement(
  entry: Entitlement
): Promise<Entitlement> {
  const updated = { ...entry, updatedAt: new Date().toISOString() };
  if (supabaseConfigured()) {
    const rows = await supabaseEntitlements<EntitlementRow[]>(
      "rpc/pikbo_upsert_subscription_entitlement",
      {
        method: "POST",
        body: JSON.stringify({
          p_session_id: updated.sessionId,
          p_plan: updated.plan,
          p_credits: updated.credits ?? null,
          p_period_key: updated.periodKey ?? null,
          p_stripe_customer_id: updated.stripeCustomerId ?? null,
          p_stripe_subscription_id: updated.stripeSubscriptionId ?? null,
          p_status: updated.status,
          p_updated_at: updated.updatedAt,
        }),
      }
    );
    if (!rows[0]) throw new Error("Supabase returned no subscription row");
    return entitlementFromRow(rows[0]);
  }
  const store = await readStore();
  const next: Entitlement = {
    ...store[entry.sessionId],
    ...updated,
  };
  store[entry.sessionId] = next;
  await writeStore(store);
  return next;
}

export async function findByStripeCustomer(
  customerId: string
): Promise<Entitlement | null> {
  if (supabaseConfigured()) {
    const rows = await supabaseEntitlements<EntitlementRow[]>(
      `pikbo_subscriptions?stripe_customer_id=eq.${encodeURIComponent(customerId)}&limit=1`
    );
    return rows[0] ? entitlementFromRow(rows[0]) : null;
  }
  const store = await readStore();
  return (
    Object.values(store).find((e) => e.stripeCustomerId === customerId) ?? null
  );
}

export async function findBySubscription(
  subscriptionId: string
): Promise<Entitlement | null> {
  if (supabaseConfigured()) {
    const rows = await supabaseEntitlements<EntitlementRow[]>(
      `pikbo_subscriptions?stripe_subscription_id=eq.${encodeURIComponent(subscriptionId)}&limit=1`
    );
    return rows[0] ? entitlementFromRow(rows[0]) : null;
  }
  const store = await readStore();
  return (
    Object.values(store).find(
      (e) => e.stripeSubscriptionId === subscriptionId
    ) ?? null
  );
}
