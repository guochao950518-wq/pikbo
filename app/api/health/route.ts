import { NextResponse } from "next/server";
import { probeEntitlementsStore } from "@/lib/entitlements";

export const runtime = "nodejs";

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
    mode: fal ? "live-generate" : "demo-cached",
    /** Honesty contract: cached demos free; live jobs charge flat credits */
    billing: {
      cachedDemoCredits: 0,
      liveJobCredits: "flat CREDITS_PER_VIDEO",
    },
    rateLimit: "memory-8rpm",
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
    devTopup:
      process.env.NODE_ENV === "development" ||
      process.env.PIKBO_DEV_TOPUP === "1",
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
