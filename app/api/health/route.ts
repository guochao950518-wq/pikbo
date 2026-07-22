import { NextResponse } from "next/server";

export const runtime = "nodejs";

/** Lightweight health for ops / uptime checks */
export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "pikbo",
    time: new Date().toISOString(),
    fal: Boolean(process.env.FAL_KEY),
    stripe: Boolean(process.env.STRIPE_SECRET_KEY),
    video: {
      free: process.env.FAL_MODEL_FREE || "bytedance/seedance-2.0/fast/image-to-video",
      paid: process.env.FAL_MODEL || "bytedance/seedance-2.0/image-to-video",
    },
    image: process.env.FAL_IMAGE_MODEL || "fal-ai/flux/schnell",
  });
}
