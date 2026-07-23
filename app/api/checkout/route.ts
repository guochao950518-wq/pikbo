import { NextResponse } from "next/server";
import { upsertEntitlement } from "@/lib/entitlements";
import { getPlan, type PlanId } from "@/lib/pricing";
import { takeToken } from "@/lib/rateLimit";
import { clientIp } from "@/lib/requestMeta";
import {
  currentPeriodKey,
  ensureSession,
  publicSession,
  saveSession,
  setPlan,
} from "@/lib/session";
import { site } from "@/lib/site";
import {
  creditsForPlan,
  paymentsClientEnabled,
  paymentsReadiness,
  stripeSecretMode,
} from "@/lib/stripe";

export const runtime = "nodejs";

/**
 * Start a Stripe Checkout session for Creator / Shop.
 * Soft launch: requires NEXT_PUBLIC_PAYMENTS_ENABLED=1 (or PAYMENTS_ENABLED=1).
 * Live secrets blocked unless PAYMENTS_LIVE=1. Dev upgrade remains non-prod only.
 */
export async function POST(req: Request) {
  let body: { plan?: string; dev?: boolean } = {};
  try {
    body = await req.json();
  } catch {
    // empty body ok
  }

  const planId = (body.plan || "creator") as PlanId;
  if (planId === "free") {
    return NextResponse.json(
      { error: "Free plan does not require checkout" },
      { status: 400 }
    );
  }

  const plan = getPlan(planId);
  if (plan.id === "free") {
    return NextResponse.json({ error: "Unknown paid plan" }, { status: 400 });
  }

  const session = await ensureSession();
  const rl = takeToken(`checkout:${session.id}:${clientIp(req)}`, 10, 60_000);
  if (!rl.ok) {
    return NextResponse.json(
      {
        error: `Too many checkout attempts — try again in ${rl.retryAfterSec}s`,
        code: "RATE_LIMITED",
        retryAfterSec: rl.retryAfterSec,
      },
      {
        status: 429,
        headers: { "Retry-After": String(rl.retryAfterSec) },
      }
    );
  }

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const priceEnv = plan.stripePriceEnv;
  const priceId = priceEnv ? process.env[priceEnv] : undefined;
  const readiness = paymentsReadiness();
  const secretMode = stripeSecretMode(stripeKey);

  // Phase I: never open Checkout when client flag is off (Coming soon).
  if (!paymentsClientEnabled() && stripeKey && priceId) {
    return NextResponse.json(
      {
        error:
          "Paid checkout is Coming soon. Free Mini trial stays open; set NEXT_PUBLIC_PAYMENTS_ENABLED=1 only on approved private preview.",
        code: "PAYMENTS_DISABLED",
        payments: readiness,
      },
      { status: 403 }
    );
  }

  // Never charge with live keys without explicit PAYMENTS_LIVE=1.
  if (secretMode === "live" && process.env.PAYMENTS_LIVE !== "1") {
    return NextResponse.json(
      {
        error:
          "Live Stripe keys are blocked. Use sk_test_ for Phase I or set PAYMENTS_LIVE=1 after boss approval.",
        code: "LIVE_KEYS_BLOCKED",
        payments: readiness,
      },
      { status: 403 }
    );
  }

  // --- Stripe path ---
  if (stripeKey && priceId && paymentsClientEnabled()) {
    try {
      const origin =
        req.headers.get("origin") ||
        process.env.NEXT_PUBLIC_SITE_URL ||
        site.url;

      const params = new URLSearchParams();
      params.set("mode", "subscription");
      params.set(
        "success_url",
        `${origin}/create?upgraded=1&plan=${plan.id}&session_id={CHECKOUT_SESSION_ID}`
      );
      params.set("cancel_url", `${origin}/pricing?canceled=1`);
      params.set("client_reference_id", session.id);
      params.set("metadata[pikbo_session_id]", session.id);
      params.set("metadata[plan]", plan.id);
      params.set("subscription_data[metadata][pikbo_session_id]", session.id);
      params.set("subscription_data[metadata][plan]", plan.id);
      params.set("line_items[0][price]", priceId);
      params.set("line_items[0][quantity]", "1");
      params.set("allow_promotion_codes", "true");

      const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${stripeKey}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      });

      const data = (await res.json()) as {
        id?: string;
        url?: string;
        error?: { message?: string };
      };
      if (!res.ok || !data.url) {
        return NextResponse.json(
          { error: data.error?.message || "Stripe checkout failed" },
          { status: 502 }
        );
      }
      return NextResponse.json({ url: data.url, provider: "stripe" });
    } catch (err) {
      console.error("checkout error:", err);
      return NextResponse.json(
        { error: "Could not start checkout" },
        { status: 500 }
      );
    }
  }

  // --- Dev / demo upgrade (no Stripe keys) ---
  // Soft launch / production: never silent-upgrade without explicit flag.
  const allowDev =
    process.env.ALLOW_DEV_UPGRADE === "1" ||
    (process.env.NODE_ENV !== "production" && body.dev === true) ||
    (process.env.NODE_ENV !== "production" &&
      process.env.ALLOW_DEV_UPGRADE !== "0");

  if (allowDev) {
    const upgraded = setPlan(session, plan.id, { resetCredits: true });
    await saveSession(upgraded);
    await upsertEntitlement({
      sessionId: upgraded.id,
      plan: plan.id,
      credits: creditsForPlan(plan.id),
      periodKey: currentPeriodKey(),
      status: "active",
      updatedAt: new Date().toISOString(),
    });
    return NextResponse.json({
      url: `/create?upgraded=1&plan=${plan.id}`,
      provider: "dev",
      session: publicSession(upgraded),
      message:
        "Dev upgrade applied (Stripe not configured). Set STRIPE_SECRET_KEY + price IDs for real billing.",
    });
  }

  return NextResponse.json(
    {
      error:
        "Payments not configured. Add STRIPE_SECRET_KEY and plan price IDs.",
      code: "STRIPE_NOT_CONFIGURED",
    },
    { status: 503 }
  );
}
