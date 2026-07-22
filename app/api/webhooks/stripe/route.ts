import { NextResponse } from "next/server";
import {
  findByStripeCustomer,
  findBySubscription,
  upsertEntitlement,
} from "@/lib/entitlements";
import { getPlan, type PlanId } from "@/lib/pricing";
import { currentPeriodKey } from "@/lib/session";
import {
  creditsForPlan,
  planFromPriceId,
  verifyStripeSignature,
} from "@/lib/stripe";

export const runtime = "nodejs";

type StripeObject = Record<string, unknown>;

function meta(obj: StripeObject | undefined, key: string): string | undefined {
  const m = obj?.metadata as Record<string, string> | undefined;
  return m?.[key];
}

function asPlan(v: string | undefined): PlanId | null {
  if (v === "creator" || v === "shop" || v === "free") return v;
  return null;
}

export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const rawBody = await req.text();

  if (secret) {
    const ok = verifyStripeSignature(
      rawBody,
      req.headers.get("stripe-signature"),
      secret
    );
    if (!ok) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }
  } else if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "STRIPE_WEBHOOK_SECRET not configured" },
      { status: 503 }
    );
  }

  let event: { type?: string; data?: { object?: StripeObject } };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const type = event.type || "";
  const obj = event.data?.object || {};

  try {
    if (type === "checkout.session.completed") {
      await handleCheckoutCompleted(obj);
    } else if (type === "invoice.paid") {
      await handleInvoicePaid(obj);
    } else if (type === "customer.subscription.deleted") {
      await handleSubscriptionDeleted(obj);
    } else if (type === "customer.subscription.updated") {
      await handleSubscriptionUpdated(obj);
    }
  } catch (err) {
    console.error("stripe webhook error:", type, err);
    return NextResponse.json({ error: "Handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutCompleted(obj: StripeObject) {
  const sessionId =
    meta(obj, "pikbo_session_id") ||
    (obj.client_reference_id as string | undefined);
  if (!sessionId) return;

  let plan =
    asPlan(meta(obj, "plan")) ||
    planFromPriceId(
      // line items not always expanded; prefer metadata
      undefined
    );

  if (!plan || plan === "free") {
    plan = asPlan(meta(obj, "plan")) || "creator";
  }

  const customer =
    typeof obj.customer === "string"
      ? obj.customer
      : ((obj.customer as { id?: string } | null)?.id ?? undefined);
  const subscription =
    typeof obj.subscription === "string"
      ? obj.subscription
      : ((obj.subscription as { id?: string } | null)?.id ?? undefined);

  await upsertEntitlement({
    sessionId,
    plan,
    credits: creditsForPlan(plan),
    periodKey: currentPeriodKey(),
    stripeCustomerId: customer,
    stripeSubscriptionId: subscription,
    status: "active",
    updatedAt: new Date().toISOString(),
  });
}

async function handleInvoicePaid(obj: StripeObject) {
  // Renew monthly allotment
  const customer =
    typeof obj.customer === "string"
      ? obj.customer
      : ((obj.customer as { id?: string } | null)?.id ?? undefined);
  if (!customer) return;

  const billingReason = obj.billing_reason as string | undefined;
  // First invoice is usually covered by checkout.session.completed
  if (billingReason === "subscription_create") return;

  const existing = await findByStripeCustomer(customer);
  if (!existing || existing.status === "canceled") return;

  const plan = existing.plan === "free" ? "creator" : existing.plan;
  await upsertEntitlement({
    ...existing,
    plan,
    credits: creditsForPlan(plan),
    periodKey: currentPeriodKey(),
    status: "active",
    updatedAt: new Date().toISOString(),
  });
}

async function handleSubscriptionDeleted(obj: StripeObject) {
  const subId = obj.id as string | undefined;
  const customer =
    typeof obj.customer === "string"
      ? obj.customer
      : ((obj.customer as { id?: string } | null)?.id ?? undefined);

  let existing = subId ? await findBySubscription(subId) : null;
  if (!existing && customer) existing = await findByStripeCustomer(customer);
  if (!existing) return;

  const free = getPlan("free");
  await upsertEntitlement({
    ...existing,
    plan: "free",
    credits: free.credits,
    status: "canceled",
    stripeSubscriptionId: undefined,
    updatedAt: new Date().toISOString(),
  });
}

async function handleSubscriptionUpdated(obj: StripeObject) {
  const subId = obj.id as string | undefined;
  const status = obj.status as string | undefined;
  const customer =
    typeof obj.customer === "string"
      ? obj.customer
      : ((obj.customer as { id?: string } | null)?.id ?? undefined);

  let existing = subId ? await findBySubscription(subId) : null;
  if (!existing && customer) existing = await findByStripeCustomer(customer);
  if (!existing) return;

  if (status === "past_due") {
    await upsertEntitlement({
      ...existing,
      status: "past_due",
      updatedAt: new Date().toISOString(),
    });
    return;
  }

  if (status === "active" || status === "trialing") {
    // Detect plan change via items
    const items = obj.items as
      | { data?: Array<{ price?: { id?: string } }> }
      | undefined;
    const priceId = items?.data?.[0]?.price?.id;
    const plan = planFromPriceId(priceId) || existing.plan;
    await upsertEntitlement({
      ...existing,
      plan,
      status: "active",
      updatedAt: new Date().toISOString(),
    });
  }
}
