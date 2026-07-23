import { createHmac, timingSafeEqual } from "crypto";
import { getPlan, type PlanId } from "@/lib/pricing";

export function stripeConfigured(): boolean {
  return Boolean(
    process.env.STRIPE_SECRET_KEY &&
      (process.env.STRIPE_PRICE_CREATOR || process.env.STRIPE_PRICE_SHOP)
  );
}

/**
 * Phase I — payment readiness (presence only; never echoes secrets).
 * Soft launch keeps public pay off. Live secret keys stay blocked unless
 * PAYMENTS_LIVE=1 (separate boss approval).
 */
export type PaymentsReadiness = {
  /** UI may show buy buttons */
  clientEnabled: boolean;
  /** Server will start Checkout sessions when keys+prices ok */
  serverCheckoutAllowed: boolean;
  secretPresent: boolean;
  secretMode: "missing" | "test" | "live" | "unknown";
  webhookSecretPresent: boolean;
  priceCreatorPresent: boolean;
  priceShopPresent: boolean;
  liveKeysBlocked: boolean;
  readyForTestCheckout: boolean;
  notes: string[];
};

export function paymentsClientEnabled(): boolean {
  return (
    process.env.NEXT_PUBLIC_PAYMENTS_ENABLED === "1" ||
    process.env.PAYMENTS_ENABLED === "1"
  );
}

export function stripeSecretMode(
  key = process.env.STRIPE_SECRET_KEY || ""
): PaymentsReadiness["secretMode"] {
  if (!key) return "missing";
  if (key.startsWith("sk_test_")) return "test";
  if (key.startsWith("sk_live_")) return "live";
  return "unknown";
}

export function paymentsReadiness(): PaymentsReadiness {
  const clientEnabled = paymentsClientEnabled();
  const secretPresent = Boolean(process.env.STRIPE_SECRET_KEY);
  const secretMode = stripeSecretMode();
  const webhookSecretPresent = Boolean(process.env.STRIPE_WEBHOOK_SECRET);
  const priceCreatorPresent = Boolean(process.env.STRIPE_PRICE_CREATOR);
  const priceShopPresent = Boolean(process.env.STRIPE_PRICE_SHOP);
  const liveAllowed = process.env.PAYMENTS_LIVE === "1";
  const liveKeysBlocked = secretMode === "live" && !liveAllowed;
  const notes: string[] = [];
  if (!clientEnabled) {
    notes.push("NEXT_PUBLIC_PAYMENTS_ENABLED is not 1 — Coming soon UI");
  }
  if (liveKeysBlocked) {
    notes.push("sk_live blocked without PAYMENTS_LIVE=1");
  }
  if (secretMode === "test") {
    notes.push("test secret present — private preview only");
  }
  if (!webhookSecretPresent) {
    notes.push("webhook secret missing — renewals not durable");
  }
  const readyForTestCheckout =
    clientEnabled &&
    secretMode === "test" &&
    !liveKeysBlocked &&
    (priceCreatorPresent || priceShopPresent);
  const serverCheckoutAllowed =
    clientEnabled &&
    secretPresent &&
    !liveKeysBlocked &&
    (priceCreatorPresent || priceShopPresent);

  return {
    clientEnabled,
    serverCheckoutAllowed,
    secretPresent,
    secretMode,
    webhookSecretPresent,
    priceCreatorPresent,
    priceShopPresent,
    liveKeysBlocked,
    readyForTestCheckout,
    notes,
  };
}

export function planFromPriceId(
  priceId: string | undefined | null
): PlanId | null {
  if (!priceId) return null;
  if (priceId === process.env.STRIPE_PRICE_CREATOR) return "creator";
  if (priceId === process.env.STRIPE_PRICE_SHOP) return "shop";
  return null;
}

export async function stripeGet(
  apiPath: string
): Promise<Record<string, unknown>> {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY missing");
  const res = await fetch(`https://api.stripe.com/v1${apiPath}`, {
    headers: { Authorization: `Bearer ${key}` },
    cache: "no-store",
  });
  const data = (await res.json()) as Record<string, unknown>;
  if (!res.ok) {
    const err = data.error as { message?: string } | undefined;
    throw new Error(err?.message || `Stripe GET ${apiPath} failed`);
  }
  return data;
}

/** Verify Stripe webhook signature (t + v1 HMAC). */
export function verifyStripeSignature(
  rawBody: string,
  signatureHeader: string | null,
  secret: string
): boolean {
  if (!signatureHeader || !secret) return false;
  const parts = Object.fromEntries(
    signatureHeader.split(",").map((p) => {
      const [k, v] = p.split("=");
      return [k, v];
    })
  );
  const timestamp = parts.t;
  const v1 = parts.v1;
  if (!timestamp || !v1) return false;

  const ts = Number(timestamp);
  if (!Number.isFinite(ts) || Math.abs(Date.now() / 1000 - ts) > 300) {
    return false;
  }

  const signed = `${timestamp}.${rawBody}`;
  const expected = createHmac("sha256", secret).update(signed).digest("hex");
  try {
    const a = Buffer.from(expected);
    const b = Buffer.from(v1);
    return a.length === b.length && timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export function creditsForPlan(planId: PlanId): number {
  return getPlan(planId).credits;
}
