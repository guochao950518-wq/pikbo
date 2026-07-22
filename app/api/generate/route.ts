import { NextResponse } from "next/server";
import { fal } from "@fal-ai/client";
import { getPreset } from "@/lib/presets";
import { getPlan } from "@/lib/pricing";
import { checkCredits, deductCredits, refundCredits } from "@/lib/credits";
import { ensureSession, publicSession, saveSession } from "@/lib/session";

export const runtime = "nodejs";
export const maxDuration = 120;

// A tiny CC0 sample clip used when no FAL_KEY is set, so the flow is
// fully demoable before you plug in a real model + billing.
const DEMO_VIDEO =
  "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";

// Paid / priority model. Override with FAL_MODEL.
const MODEL_PAID =
  process.env.FAL_MODEL || "fal-ai/kling-video/v1.6/standard/image-to-video";
// Cheaper model for free tier — keep margin positive. Falls back to paid model.
const MODEL_FREE =
  process.env.FAL_MODEL_FREE ||
  process.env.FAL_MODEL ||
  "fal-ai/kling-video/v1.6/standard/image-to-video";

export async function POST(req: Request) {
  let body: { effect?: string; image?: string; extra?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { effect, image, extra } = body;

  const preset = effect ? getPreset(effect) : undefined;
  if (!preset) {
    return NextResponse.json({ error: "Unknown effect" }, { status: 400 });
  }
  if (!image || !image.startsWith("data:image")) {
    return NextResponse.json(
      { error: "A toy photo is required" },
      { status: 400 }
    );
  }

  // --- Credits gate ---
  let session = await ensureSession();
  const check = checkCredits(session);
  if (!check.ok) {
    return NextResponse.json(
      {
        error: "Not enough credits",
        code: "INSUFFICIENT_CREDITS",
        need: check.need,
        have: check.have,
        session: publicSession(session),
      },
      { status: 402 }
    );
  }

  // Reserve credits before calling the model (refund on failure)
  session = deductCredits(session, check.cost);
  await saveSession(session);

  const plan = getPlan(session.plan);
  const prompt = extra?.trim()
    ? `${preset.promptTemplate} Additional direction: ${extra.trim()}.`
    : preset.promptTemplate;

  // --- Demo mode: no key configured yet ---
  if (!process.env.FAL_KEY) {
    await new Promise((r) => setTimeout(r, 1200));
    return NextResponse.json({
      videoUrl: DEMO_VIDEO,
      demo: true,
      watermark: plan.watermark,
      session: publicSession(session),
    });
  }

  // --- Real generation via fal.ai ---
  try {
    fal.config({ credentials: process.env.FAL_KEY });

    const blob = await (await fetch(image)).blob();
    const file = new File([blob], "toy.png", {
      type: blob.type || "image/png",
    });
    const imageUrl = await fal.storage.upload(file);

    const model = plan.watermark ? MODEL_FREE : MODEL_PAID;

    const result = await fal.subscribe(model, {
      input: {
        prompt,
        image_url: imageUrl,
        duration: String(preset.duration),
        aspect_ratio: preset.aspectRatio,
      },
      logs: false,
    });

    const data = result.data as { video?: { url?: string } };
    const videoUrl = data?.video?.url;
    if (!videoUrl) {
      session = refundCredits(session, check.cost);
      await saveSession(session);
      return NextResponse.json(
        {
          error: "Model returned no video",
          session: publicSession(session),
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      videoUrl,
      requestId: result.requestId,
      watermark: plan.watermark,
      session: publicSession(session),
    });
  } catch (err) {
    console.error("generate error:", err);
    session = refundCredits(session, check.cost);
    await saveSession(session);
    const msg = err instanceof Error ? err.message : "Generation failed";
    return NextResponse.json(
      { error: msg, session: publicSession(session) },
      { status: 500 }
    );
  }
}
