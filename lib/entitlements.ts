import { promises as fs } from "fs";
import path from "path";
import type { PlanId } from "@/lib/pricing";

/**
 * Durable plan state keyed by Pikbo session id.
 * Cookie sessions alone cannot be updated by Stripe webhooks (no browser).
 * This store is the source of truth for paid plan after checkout / renew / cancel.
 *
 * Default: JSON file under data/ (single-node / local / long-lived Node).
 * Production: set ENTITLEMENTS_PATH or later swap for Redis/Supabase.
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

function storePath(): string {
  if (process.env.ENTITLEMENTS_PATH) return process.env.ENTITLEMENTS_PATH;
  // Statically scoped under ./data so bundlers don't NFT the whole project
  return path.join(
    /* turbopackIgnore: true */ process.cwd(),
    "data",
    "entitlements.json"
  );
}

async function readStore(): Promise<Store> {
  try {
    const raw = await fs.readFile(storePath(), "utf8");
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
  const store = await readStore();
  return store[sessionId] ?? null;
}

export async function upsertEntitlement(
  entry: Entitlement
): Promise<Entitlement> {
  const store = await readStore();
  const next: Entitlement = {
    ...store[entry.sessionId],
    ...entry,
    updatedAt: new Date().toISOString(),
  };
  store[entry.sessionId] = next;
  await writeStore(store);
  return next;
}

export async function findByStripeCustomer(
  customerId: string
): Promise<Entitlement | null> {
  const store = await readStore();
  return (
    Object.values(store).find((e) => e.stripeCustomerId === customerId) ?? null
  );
}

export async function findBySubscription(
  subscriptionId: string
): Promise<Entitlement | null> {
  const store = await readStore();
  return (
    Object.values(store).find(
      (e) => e.stripeSubscriptionId === subscriptionId
    ) ?? null
  );
}
