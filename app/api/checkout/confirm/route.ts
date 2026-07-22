import { NextResponse } from "next/server";
import { upsertEntitlement } from "@/lib/entitlements";
import { type PlanId } from "@/lib/pricing";
import {
  planFromPriceId,
  stripeGet,
} from "@/lib/stripe";
import {
  currentPeriodKey,
  ensureSession,
  publicSession,
  saveSession,
  setPlan,
} from "@/lib/session";

export const runtime = "nodejs";

/**
 * Called after Stripe Checkout redirects back with ?session_id=cs_...
 * Verifies the Checkout Session with Stripe and upgrades the browser cookie.
 */
export async function POST(req: Request) {
  let body: { session_id?: string } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const checkoutId = body.session_id;
  if (!checkoutId || !checkoutId.startsWith("cs_")) {
    return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: "Stripe not configured" },
      { status: 503 }
    );
  }

  try {
    const cs = await stripeGet(
      `/checkout/sessions/${encodeURIComponent(checkoutId)}`
    );

    if (
      cs.status !== "complete" ||
      (cs.payment_status !== "paid" && cs.payment_status !== "no_payment_required")
    ) {
      return NextResponse.json(
        { error: "Checkout not completed" },
        { status: 402 }
      );
    }

    const metadata = (cs.metadata || {}) as Record<string, string>;
    const localId =
      metadata.pikbo_session_id ||
      (cs.client_reference_id as string | undefined);

    let plan: PlanId | null =
      metadata.plan === "creator" || metadata.plan === "shop"
        ? metadata.plan
        : null;
    if (!plan) {
      // try line items
      try {
        const items = await stripeGet(
          `/checkout/sessions/${encodeURIComponent(checkoutId)}/line_items?limit=1`
        );
        const data = items.data as Array<{ price?: { id?: string } }> | undefined;
        plan = planFromPriceId(data?.[0]?.price?.id) || "creator";
      } catch {
        plan = "creator";
      }
    }

    const customer =
      typeof cs.customer === "string"
        ? cs.customer
        : undefined;
    const subscription =
      typeof cs.subscription === "string"
        ? cs.subscription
        : undefined;

    let session = await ensureSession();
    if (!localId || localId !== session.id) {
      return NextResponse.json(
        { error: "Checkout does not belong to this signed-in workspace" },
        { status: 403 }
      );
    }
    const periodKey = currentPeriodKey();

    session = setPlan(session, plan, { resetCredits: true });
    await saveSession(session);
    await upsertEntitlement({
      sessionId: session.id,
      plan,
      credits: session.credits,
      periodKey,
      stripeCustomerId: customer,
      stripeSubscriptionId: subscription,
      status: "active",
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({
      ok: true,
      plan,
      session: publicSession(session),
    });
  } catch (err) {
    console.error("checkout confirm error:", err);
    const msg = err instanceof Error ? err.message : "Confirm failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
