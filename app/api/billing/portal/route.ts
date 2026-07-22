import { NextResponse } from "next/server";
import { getEntitlement } from "@/lib/entitlements";
import { readSession } from "@/lib/session";
import { site } from "@/lib/site";
import { stripePost } from "@/lib/stripe";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: "Billing portal is not configured" },
      { status: 503 }
    );
  }

  const session = await readSession();
  if (!session) {
    return NextResponse.json({ error: "Session required" }, { status: 401 });
  }

  const entitlement = await getEntitlement(session.id);
  if (!entitlement?.stripeCustomerId) {
    return NextResponse.json(
      { error: "No Stripe subscription is linked to this account" },
      { status: 409 }
    );
  }

  const origin =
    process.env.NODE_ENV === "production"
      ? process.env.NEXT_PUBLIC_SITE_URL || site.url
      : req.headers.get("origin") || site.url;
  const params = new URLSearchParams({
    customer: entitlement.stripeCustomerId,
    return_url: `${origin}/profile`,
  });
  try {
    const portal = await stripePost("/billing_portal/sessions", params);
    if (typeof portal.url !== "string") {
      throw new Error("Stripe returned no portal URL");
    }
    return NextResponse.json({ url: portal.url });
  } catch (error) {
    console.error("billing portal error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Portal failed" },
      { status: 502 }
    );
  }
}
