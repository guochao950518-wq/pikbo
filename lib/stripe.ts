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
  if (
    priceId === process.env.STRIPE_PRICE_CREATOR ||
    priceId === process.env.STRIPE_PRICE_CREATOR_ANNUAL
  )
    return "creator";
  if (
    priceId === process.env.STRIPE_PRICE_SHOP ||
    priceId === process.env.STRIPE_PRICE_SHOP_ANNUAL
  )
    return "shop";
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

export async function stripePost(
  apiPath: string,
  params: URLSearchParams
): Promise<Record<string, unknown>> {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY missing");
  const res = await fetch(`https://api.stripe.com/v1${apiPath}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
    cache: "no-store",
  });
  const data = (await res.json()) as Record<string, unknown>;
  if (!res.ok) {
    const err = data.error as { message?: string } | undefined;
    throw new Error(err?.message || `Stripe POST ${apiPath} failed`);
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
  const parts = signatureHeader.split(",").map((part) => part.split("=", 2));
  const timestamp = parts.find(([key]) => key === "t")?.[1];
  const signatures = parts
    .filter(([key]) => key === "v1")
    .map(([, value]) => value)
    .filter(Boolean);
  if (!timestamp || signatures.length === 0) return false;

  const ts = Number(timestamp);
  if (!Number.isFinite(ts) || Math.abs(Date.now() / 1000 - ts) > 300) {
    return false;
  }

  const signed = `${timestamp}.${rawBody}`;
  const expected = createHmac("sha256", secret).update(signed).digest("hex");
  try {
    const a = Buffer.from(expected);
    return signatures.some((signature) => {
      const b = Buffer.from(signature);
      return a.length === b.length && timingSafeEqual(a, b);
    });
  } catch {
    return false;
  }
}

export function creditsForPlan(planId: PlanId): number {
  return getPlan(planId).credits;
}
