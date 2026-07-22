import { NextResponse } from "next/server";
import { watermarkWorkerConfigured } from "@/lib/videoWatermark";

export const runtime = "nodejs";

/** Lightweight health for ops / uptime checks */
export async function GET() {
  const persistence = Boolean(
    process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  );
  const auth = Boolean(
    process.env.SUPABASE_URL &&
      (process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  );
  const fal = Boolean(process.env.FAL_KEY);
  const stripe = Boolean(
    process.env.STRIPE_SECRET_KEY && process.env.STRIPE_WEBHOOK_SECRET
  );
  const watermarkWorker = watermarkWorkerConfigured();
  return NextResponse.json({
    ok: true,
    service: "pikbo",
    time: new Date().toISOString(),
    mode: fal ? "live" : "validation",
    fal,
    stripe,
    persistence,
    auth,
    watermarkWorker,
    productionReady: Boolean(
      process.env.SESSION_SECRET &&
        fal &&
        stripe &&
        persistence &&
        auth &&
        watermarkWorker
    ),
    video: {
      free: process.env.FAL_MODEL_FREE || "bytedance/seedance-2.0/fast/image-to-video",
      paid: process.env.FAL_MODEL || "bytedance/seedance-2.0/image-to-video",
    },
    image: process.env.FAL_IMAGE_MODEL || "fal-ai/flux/schnell",
  });
}
