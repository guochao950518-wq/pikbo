import { NextResponse } from "next/server";
import { fal } from "@fal-ai/client";
import { getPreset } from "@/lib/presets";
import { getPlan } from "@/lib/pricing";
import { checkCredits, deductCredits, refundCredits } from "@/lib/credits";
import {
  clampDuration,
  modelForTier,
  normalizeAspect,
  resolutionForTier,
  seedanceDuration,
  type ModelPreference,
} from "@/lib/models";
import { ensureSession, publicSession, saveSession } from "@/lib/session";
import { DEMO_VIDEOS } from "@/lib/demoVideos";
import { watermarkWorkerConfigured } from "@/lib/videoWatermark";

export const runtime = "nodejs";
export const maxDuration = 180;

export async function POST(req: Request) {
  let body: {
    effect?: string;
    image?: string;
    extra?: string;
    duration?: number;
    aspectRatio?: string;
    model?: string;
    resolution?: string;
    seed?: number;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const {
    effect,
    image,
    extra,
    duration,
    aspectRatio,
    model: modelPref,
    resolution: resPref,
    seed,
  } = body;

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
  // ~8–9MB decoded; reject huge payloads that blow memory / fal upload
  if (image.length > 12_000_000) {
    return NextResponse.json(
      { error: "Image too large (max ~8MB)" },
      { status: 413 }
    );
  }

  let session = await ensureSession();

  // Validation mode must be truthful and free: return an owned Pikbo Lab
  // preview, never a generic third-party clip, and never consume credits.
  if (!process.env.FAL_KEY) {
    const demo =
      DEMO_VIDEOS.find((item) => item.preset === preset.slug) ?? DEMO_VIDEOS[0];
    await new Promise((resolve) => setTimeout(resolve, 350));
    return NextResponse.json({
      videoUrl: demo.mp4,
      posterUrl: demo.poster,
      demo: true,
      provenance: "cached-pikbo-lab",
      chargedCredits: 0,
      watermark: true,
      model: "demo-no-provider-call",
      duration: clampDuration(duration, preset.duration),
      aspectRatio: normalizeAspect(aspectRatio, preset.aspectRatio),
      session: publicSession(session),
      message: "Private validation preview — no model request or credit charge.",
    });
  }

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

  const plan = getPlan(session.plan);
  const freeTier = plan.watermark;
  if (process.env.NODE_ENV === "production" && freeTier) {
    const workerReady = watermarkWorkerConfigured();
    return NextResponse.json(
      {
        error: workerReady
          ? "Free exports use the asynchronous generation pipeline"
          : "Free export processing is not configured",
        code: workerReady
          ? "USE_ASYNC_GENERATION_PIPELINE"
          : "WATERMARK_WORKER_NOT_CONFIGURED",
        session: publicSession(session),
      },
      { status: workerReady ? 409 : 503 }
    );
  }

  session = deductCredits(session, check.cost);
  await saveSession(session);
  const secs = clampDuration(duration, preset.duration);
  const aspect = normalizeAspect(aspectRatio, preset.aspectRatio);

  // If user typed a full custom prompt in extra that looks complete, use it;
  // otherwise merge with preset template.
  const custom = extra?.trim() || "";
  const prompt =
    custom.length > 80
      ? custom
      : custom
        ? `${preset.promptTemplate} Additional direction: ${custom}.`
        : preset.promptTemplate;

  const model = modelForTier({
    freeTier,
    prefer: modelPref as ModelPreference,
  });

  try {
    fal.config({ credentials: process.env.FAL_KEY });

    const blob = await (await fetch(image)).blob();
    const file = new File([blob], "toy.png", {
      type: blob.type || "image/png",
    });
    const imageUrl = await fal.storage.upload(file);

    const input: Record<string, unknown> = {
      prompt,
      image_url: imageUrl,
      duration: seedanceDuration(secs),
      aspect_ratio: aspect,
      resolution: resolutionForTier(freeTier, resPref),
      generate_audio: !freeTier,
    };
    if (typeof seed === "number" && Number.isFinite(seed) && seed >= 0) {
      input.seed = Math.floor(seed);
    }

    const result = await fal.subscribe(model, {
      input,
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
          model,
          session: publicSession(session),
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      videoUrl,
      requestId: result.requestId,
      watermark: plan.watermark,
      model,
      provider: "bytedance-seedance",
      duration: secs,
      aspectRatio: aspect,
      session: publicSession(session),
    });
  } catch (err) {
    console.error("generate error:", model, err);
    session = refundCredits(session, check.cost);
    await saveSession(session);
    const msg = err instanceof Error ? err.message : "Generation failed";
    return NextResponse.json(
      { error: msg, model, session: publicSession(session) },
      { status: 500 }
    );
  }
}
