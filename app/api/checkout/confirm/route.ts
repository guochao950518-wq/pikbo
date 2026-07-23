import { NextResponse } from "next/server";
import { upsertEntitlement } from "@/lib/entitlements";
import { type PlanId } from "@/lib/pricing";
import { takeToken } from "@/lib/rateLimit";
import { clientIp } from "@/lib/requestMeta";
import {
  creditsForPlan,
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

  const sessionGate = await ensureSession();
  const rl = takeToken(
    `confirm:${sessionGate.id}:${clientIp(req)}`,
    12,
    60_000
  );
  if (!rl.ok) {
    return NextResponse.json(
      {
        error: `Too many confirm attempts — try again in ${rl.retryAfterSec}s`,
        code: "RATE_LIMITED",
        retryAfterSec: rl.retryAfterSec,
      },
      {
        status: 429,
        headers: { "Retry-After": String(rl.retryAfterSec) },
      }
    );
  }

  try {
    const cs = await stripeGet(
      `/checkout/sessions/${encodeURIComponent(checkoutId)}`
    );

    if (cs.payment_status !== "paid" && cs.status !== "complete") {
      return NextResponse.json(
        { error: "Checkout not completed" },
        { status: 402 }
      );
    }

    const metadata = (cs.metadata || {}) as Record<string, string>;
    const localId =
      metadata.pikbo_session_id ||
      (cs.client_reference_id as string | undefined);

    let plan = (metadata.plan as PlanId | undefined) || null;
    if (!plan || plan === "free") {
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
    // Prefer Stripe metadata session; if cookie differs, still upgrade this browser
    const periodKey = currentPeriodKey();
    const credits = creditsForPlan(plan);

    if (localId && localId !== session.id) {
      await upsertEntitlement({
        sessionId: localId,
        plan,
        credits,
        periodKey,
        stripeCustomerId: customer,
        stripeSubscriptionId: subscription,
        status: "active",
        updatedAt: new Date().toISOString(),
      });
    }

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
