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
import { demoClipForEffect } from "@/lib/demoClips";
import { pruneRateLimit, takeToken } from "@/lib/rateLimit";
import type {
  GenerateErrorBody,
  GenerateRequestBody,
  GenerateSuccess,
} from "@/lib/contracts";

export const runtime = "nodejs";
export const maxDuration = 180;

function err(
  body: GenerateErrorBody,
  status: number
): NextResponse<GenerateErrorBody> {
  return NextResponse.json(body, { status });
}

export async function POST(req: Request) {
  let body: GenerateRequestBody;
  try {
    body = (await req.json()) as GenerateRequestBody;
  } catch {
    return err({ error: "Invalid request", code: "INVALID_REQUEST" }, 400);
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
    return err({ error: "Unknown effect", code: "UNKNOWN_EFFECT" }, 400);
  }
  if (!image || !image.startsWith("data:image")) {
    return err(
      { error: "A toy photo is required", code: "INVALID_REQUEST" },
      400
    );
  }
  if (image.length > 12_000_000) {
    return err(
      { error: "Image too large (max ~8MB)", code: "IMAGE_TOO_LARGE" },
      413
    );
  }

  let session = await ensureSession();

  pruneRateLimit();
  const rl = takeToken(`gen:${session.id}`, 8, 60_000);
  if (!rl.ok) {
    return err(
      {
        error: `Too many generates — try again in ${rl.retryAfterSec}s`,
        code: "RATE_LIMITED",
        session: publicSession(session),
      },
      429
    );
  }

  const check = checkCredits(session);
  if (!check.ok) {
    return err(
      {
        error:
          session.plan === "free"
            ? "Free trial used up — upgrade on Pricing, or wait for monthly refresh"
            : "Not enough credits",
        code: "INSUFFICIENT_CREDITS",
        need: check.need,
        have: check.have,
        session: publicSession(session),
      },
      402
    );
  }

  session = deductCredits(session, check.cost);
  await saveSession(session);

  const plan = getPlan(session.plan);
  const freeTier = plan.watermark;
  const secs = freeTier ? 5 : clampDuration(duration, preset.duration);
  const aspect = normalizeAspect(aspectRatio, preset.aspectRatio);

  const custom = extra?.trim() || "";
  const prompt =
    custom.length > 80
      ? custom
      : custom
        ? `${preset.promptTemplate} Additional direction: ${custom}.`
        : preset.promptTemplate;

  // --- Demo path: foundation still deducts credits so free trial is real ---
  if (!process.env.FAL_KEY) {
    await new Promise((r) => setTimeout(r, 600));
    const payload: GenerateSuccess = {
      videoUrl: demoClipForEffect(preset.slug),
      demo: true,
      watermark: plan.watermark,
      model: "demo-cached",
      duration: secs,
      aspectRatio: aspect,
      session: publicSession(session),
    };
    return NextResponse.json(payload);
  }

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
      return err(
        {
          error: "Model returned no video",
          code: "MODEL_EMPTY",
          model,
          session: publicSession(session),
        },
        502
      );
    }

    const payload: GenerateSuccess = {
      videoUrl,
      demo: false,
      watermark: plan.watermark,
      model,
      duration: secs,
      aspectRatio: aspect,
      session: publicSession(session),
      requestId: result.requestId,
      provider: "bytedance-seedance",
    };
    return NextResponse.json(payload);
  } catch (e) {
    console.error("generate error:", model, e);
    session = refundCredits(session, check.cost);
    await saveSession(session);
    const raw =
      e && typeof e === "object" && "body" in e
        ? JSON.stringify((e as { body?: unknown }).body)
        : e instanceof Error
          ? e.message
          : "Generation failed";
    const exhausted =
      /Exhausted balance|locked|top up|insufficient.*credit/i.test(raw) ||
      /Forbidden/i.test(raw);
    const msg = exhausted
      ? "fal.ai balance empty or account locked — top up at fal.ai/dashboard/billing (credits refunded)."
      : e instanceof Error
        ? e.message
        : "Generation failed";
    return err(
      {
        error: msg,
        code: exhausted ? "GENERATION_FAILED" : "GENERATION_FAILED",
        model,
        session: publicSession(session),
      },
      exhausted ? 402 : 500
    );
  }
}
