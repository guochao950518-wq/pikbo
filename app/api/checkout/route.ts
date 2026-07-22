import { NextResponse } from "next/server";
import { getPlan, type PlanId } from "@/lib/pricing";
import { ensureSession, publicSession, saveSession, setPlan } from "@/lib/session";
import { site } from "@/lib/site";

export const runtime = "nodejs";

/**
 * Start a Stripe Checkout session for Creator / Shop.
 * When Stripe is not configured, accepts ?dev=1 (or body.dev) in non-production
 * to simulate an upgrade so the product flow can be tested end-to-end.
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
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const priceEnv = plan.stripePriceEnv;
  const priceId = priceEnv ? process.env[priceEnv] : undefined;

  // --- Stripe path ---
  if (stripeKey && priceId) {
    try {
      const origin =
        req.headers.get("origin") ||
        process.env.NEXT_PUBLIC_SITE_URL ||
        site.url;

      const params = new URLSearchParams();
      params.set("mode", "subscription");
      params.set("success_url", `${origin}/create?upgraded=1&plan=${plan.id}`);
      params.set("cancel_url", `${origin}/pricing?canceled=1`);
      params.set("client_reference_id", session.id);
      params.set("metadata[pikbo_session_id]", session.id);
      params.set("metadata[plan]", plan.id);
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

      const data = (await res.json()) as { id?: string; url?: string; error?: { message?: string } };
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
  const allowDev =
    body.dev === true ||
    process.env.ALLOW_DEV_UPGRADE === "1" ||
    process.env.NODE_ENV !== "production";

  if (allowDev) {
    const upgraded = setPlan(session, plan.id, { resetCredits: true });
    await saveSession(upgraded);
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
