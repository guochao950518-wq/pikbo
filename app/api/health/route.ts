import { NextResponse } from "next/server";

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

  /** Demo / soft-live / paid ladders — honest gates for ops */
  const ready = {
    /** Cached Lab + Studio demo path (no provider key required) */
    demo: true,
    /** Live Mini/full Seedance when FAL_KEY + session secret present */
    softLive: fal && (sessionSecret || !production),
    /** Real charges — still needs durable entitlements (see PRELAUNCH R1) */
    paid: fal && sessionSecret && stripe && stripeWebhook,
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
    rateLimit: "memory-8rpm",
    ready,
    checks: {
      sessionSecret,
      fal,
      stripe,
      stripeWebhook,
      production,
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
