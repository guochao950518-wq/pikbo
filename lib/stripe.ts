import { createHmac, timingSafeEqual } from "crypto";
import { getPlan, type PlanId } from "@/lib/pricing";

export function stripeConfigured(): boolean {
  return Boolean(
    process.env.STRIPE_SECRET_KEY &&
      (process.env.STRIPE_PRICE_CREATOR || process.env.STRIPE_PRICE_SHOP)
  );
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
