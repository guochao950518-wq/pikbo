import { NextResponse } from "next/server";
import { probeEntitlementsStore } from "@/lib/entitlements";
import { generateMode } from "@/lib/requestMeta";
// NextResponse used for GET + HEAD

export const runtime = "nodejs";

/** Uptime probes that only need a 200 without JSON body. */
export async function HEAD() {
  return new NextResponse(null, {
    status: 200,
    headers: { "Cache-Control": "no-store" },
  });
}

/** Lightweight health for ops / uptime checks — foundation L0 + soft-launch readiness */
export async function GET() {
  const fal = Boolean(process.env.FAL_KEY);
  const stripe = Boolean(process.env.STRIPE_SECRET_KEY);
  const stripeWebhook = Boolean(process.env.STRIPE_WEBHOOK_SECRET);
  const sessionSecret = Boolean(
    process.env.SESSION_SECRET || process.env.CREDITS_SECRET
  );
  const production = process.env.NODE_ENV === "production";
  const degraded = production && !sessionSecret;

  const entitlements = await probeEntitlementsStore();
  const mode = generateMode();

  /** Demo / soft-live / paid ladders — honest gates for ops */
  const ready = {
    /** Cached Lab + Studio demo path (no provider key; free, no credit burn) */
    demo: true,
    /** Live Mini/full Seedance when FAL_KEY + session secret present */
    softLive: fal && (sessionSecret || !production),
    /**
     * Real charges — needs durable entitlements (PRELAUNCH R1).
     * File store unwritable ⇒ paid stays false even if Stripe env is set.
     */
    paid:
      fal &&
      sessionSecret &&
      stripe &&
      stripeWebhook &&
      entitlements.writable,
  };

  return NextResponse.json({
    ok: !degraded,
    degraded,
    service: "pikbo",
    foundation: "L0-L3",
    time: new Date().toISOString(),
    fal,
    stripe,
    stripeWebhook,
    sessionSecret,
    mode,
    /** Honesty contract: cached demos free; live jobs charge flat credits */
    billing: {
      cachedDemoCredits: 0,
      liveJobCredits: "flat CREDITS_PER_VIDEO",
    },
    rateLimit: "session-8rpm + ip-24rpm + inflight-1",
    ready,
    entitlements,
    checks: {
      sessionSecret,
      fal,
      stripe,
      stripeWebhook,
      production,
      entitlementsWritable: entitlements.writable,
    },
    /** Soft-live env checklist (presence only — never echo secrets) */
    softLiveChecklist: {
      SESSION_SECRET: sessionSecret,
      FAL_KEY: fal,
      STRIPE_SECRET_KEY: stripe,
      STRIPE_WEBHOOK_SECRET: stripeWebhook,
      entitlementsWritable: entitlements.writable,
      /** Soft launch (no Stripe) only needs the required pair. */
      requiredForSoftLive: ["SESSION_SECRET", "FAL_KEY"],
      optionalUntilPaid: [
        "STRIPE_SECRET_KEY",
        "STRIPE_WEBHOOK_SECRET",
        "entitlementsWritable",
      ],
      notes: [
        "Soft public (Sunday): SESSION_SECRET + FAL_KEY only — Stripe is Coming soon",
        "Demo works without FAL_KEY (cached Lab clips, 0 credits)",
        "Paid later: durable entitlements + Stripe price IDs + webhook",
        "See docs/LAUNCH.md",
      ],
    },
    devTopup:
      process.env.NODE_ENV === "development" ||
      (process.env.VERCEL_ENV !== "production" &&
        process.env.NODE_ENV !== "production" &&
        process.env.PIKBO_DEV_TOPUP === "1"),
    video: {
      free:
        process.env.FAL_MODEL_FREE ||
        "bytedance/seedance-2.0/mini/image-to-video",
      paid: process.env.FAL_MODEL || "bytedance/seedance-2.0/image-to-video",
      fast:
        process.env.FAL_MODEL_FAST ||
        "bytedance/seedance-2.0/fast/image-to-video",
    },
    image: process.env.FAL_IMAGE_MODEL || "fal-ai/flux/schnell",
  });
}
