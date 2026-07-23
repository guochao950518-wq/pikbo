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
import {
  endJob,
  takeGenerateBudget,
  tryBeginJob,
} from "@/lib/rateLimit";
import { clientIp } from "@/lib/requestMeta";
import {
  classifyProviderError,
  isValidImageDataUrl,
  providerErrorMessage,
} from "@/lib/providerError";
import { buildGeneratePrompt } from "@/lib/promptBuild";
import type {
  GenerateErrorBody,
  GenerateRequestBody,
  GenerateSuccess,
} from "@/lib/contracts";
import {
  shadowRelease,
  shadowReserveForGuest,
  shadowSettle,
  type ShadowReservation,
} from "@/lib/durableCredits/shadow";
import {
  recordFailedGenerate,
  recordSucceededGenerate,
} from "@/lib/generationJobs";

export const runtime = "nodejs";
export const maxDuration = 180;

function err(
  body: GenerateErrorBody,
  status: number,
  headers?: HeadersInit
): NextResponse<GenerateErrorBody> {
  return NextResponse.json(body, { status, headers });
}

function noteFailed(
  sessionId: string,
  effect: string,
  body: GenerateErrorBody
) {
  try {
    recordFailedGenerate({
      sessionId,
      effect,
      error: body.error,
      errorCode: body.code,
      model: body.model,
      creditsRefunded: body.creditsRefunded,
    });
  } catch {
    /* job ledger is best-effort */
  }
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
    ownsRights,
  } = body;

  const preset = effect ? getPreset(effect) : undefined;
  if (!preset) {
    return err({ error: "Unknown effect", code: "UNKNOWN_EFFECT" }, 400);
  }
  // Soft-launch PRD §3/§5 — server-enforced rights attestation (not UI-only).
  if (ownsRights !== true) {
    return err(
      {
        error:
          "Confirm you own this photo and have the right to animate it before generating",
        code: "RIGHTS_REQUIRED",
      },
      400
    );
  }
  if (!image || !isValidImageDataUrl(image)) {
    return err(
      {
        error: "A toy photo is required (JPEG, PNG, WebP, or GIF data URL)",
        code: "INVALID_REQUEST",
      },
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

  const rl = takeGenerateBudget(session.id, clientIp(req), "gen");
  if (!rl.ok) {
    return err(
      {
        error: `Too many generates — try again in ${rl.retryAfterSec}s`,
        code: "RATE_LIMITED",
        retryAfterSec: rl.retryAfterSec,
        session: publicSession(session),
      },
      429,
      { "Retry-After": String(rl.retryAfterSec) }
    );
  }

  if (!tryBeginJob(session.id)) {
    return err(
      {
        error:
          "A generate is already running for this session — wait for it to finish",
        code: "JOB_IN_FLIGHT",
        session: publicSession(session),
      },
      409
    );
  }

  try {
    const plan = getPlan(session.plan);
    const freeTier = plan.watermark;
    const secs = freeTier ? 5 : clampDuration(duration, preset.duration);
    const aspect = normalizeAspect(aspectRatio, preset.aspectRatio);
    const resolution = resolutionForTier(freeTier, resPref);

    // Always keep preset template as base — freeform-only used to wipe toy prompts.
    const prompt = buildGeneratePrompt(preset.promptTemplate, extra);

    // --- Demo path (no provider): free cached Lab clips — matches pricing honesty ---
    if (!process.env.FAL_KEY) {
      await new Promise((r) => setTimeout(r, 600));
      const payload: GenerateSuccess = {
        videoUrl: demoClipForEffect(preset.slug),
        demo: true,
        demoReason: "no_provider_key",
        watermark: plan.watermark,
        model: "demo-cached",
        duration: secs,
        aspectRatio: aspect,
        resolution,
        session: publicSession(session),
        // Wave B — echo server-validated recipe + free settlement
        effect: preset.slug,
        costCredits: 0,
        creditsOutcome: "0 cached",
      };
      try {
        const job = recordSucceededGenerate({
          sessionId: session.id,
          effect: preset.slug,
          videoUrl: payload.videoUrl,
          demo: true,
          watermark: plan.watermark,
          model: payload.model,
          duration: secs,
          aspectRatio: aspect,
          resolution,
          costCredits: 0,
          creditsOutcome: "0 cached",
          provider: "demo-cached",
        });
        payload.requestId = job.id;
      } catch {
        /* best-effort job ledger */
      }
      return NextResponse.json(payload);
    }

    // --- Live path: charge credits only when a real provider call will run ---
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
    // Optional durable shadow ledger (Cookie remains authoritative until Supabase auth).
    let shadow: ShadowReservation | null = await shadowReserveForGuest(
      session.id
    );

    const model = modelForTier({
      freeTier,
      prefer: modelPref as ModelPreference,
    });

    // G6 ops: prove post-debit refund without burning fal when not on production.
    // Never enable on Vercel production or NODE_ENV=production.
    const forceFail =
      process.env.PIKBO_FORCE_GENERATE_FAIL === "1" &&
      process.env.NODE_ENV !== "production" &&
      process.env.VERCEL_ENV !== "production";
    if (forceFail) {
      session = refundCredits(session, check.cost);
      await saveSession(session);
      await shadowRelease(shadow, "force_fail");
      shadow = null;
      const failBody: GenerateErrorBody = {
        error:
          "Forced generate failure (PIKBO_FORCE_GENERATE_FAIL) — credits restored",
        code: "GENERATION_FAILED",
        model,
        session: publicSession(session),
        creditsRefunded: true,
      };
      noteFailed(session.id, preset.slug, failBody);
      return err(failBody, 500);
    }

    try {
      fal.config({ credentials: process.env.FAL_KEY });

      let blob: Blob;
      try {
        blob = await (await fetch(image)).blob();
      } catch {
        session = refundCredits(session, check.cost);
        await saveSession(session);
        await shadowRelease(shadow, "invalid_image");
        return err(
          {
            error: "Could not read image data",
            code: "INVALID_REQUEST",
            model,
            session: publicSession(session),
            creditsRefunded: true,
          },
          400
        );
      }
      if (!blob || blob.size < 32) {
        session = refundCredits(session, check.cost);
        await saveSession(session);
        await shadowRelease(shadow, "empty_image");
        return err(
          {
            error: "Image data empty or too small",
            code: "INVALID_REQUEST",
            model,
            session: publicSession(session),
            creditsRefunded: true,
          },
          400
        );
      }
      const file = new File([blob], "toy.png", {
        type: blob.type || "image/png",
      });
      const imageUrl = await fal.storage.upload(file);

      const input: Record<string, unknown> = {
        prompt,
        image_url: imageUrl,
        duration: seedanceDuration(secs),
        aspect_ratio: aspect,
        resolution,
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
        await shadowRelease(shadow, "model_empty");
        const failBody: GenerateErrorBody = {
          error: "Model returned no video",
          code: "MODEL_EMPTY",
          model,
          session: publicSession(session),
          creditsRefunded: true,
        };
        noteFailed(session.id, preset.slug, failBody);
        return err(failBody, 502);
      }

      await shadowSettle(shadow, result.requestId);
      const payload: GenerateSuccess = {
        videoUrl,
        demo: false,
        watermark: plan.watermark,
        model,
        duration: secs,
        aspectRatio: aspect,
        resolution,
        session: publicSession(session),
        requestId: result.requestId,
        provider: "bytedance-seedance",
        // Wave B — echo server-validated recipe + live settlement
        effect: preset.slug,
        costCredits: check.cost,
        creditsOutcome: "10 used",
      };
      try {
        recordSucceededGenerate({
          sessionId: session.id,
          effect: preset.slug,
          videoUrl,
          demo: false,
          watermark: plan.watermark,
          model,
          duration: secs,
          aspectRatio: aspect,
          resolution,
          costCredits: check.cost,
          creditsOutcome: "10 used",
          requestId: result.requestId,
          provider: "bytedance-seedance",
          preferredId: result.requestId,
        });
      } catch {
        /* best-effort */
      }
      return NextResponse.json(payload);
    } catch (e) {
      console.error("generate error:", model, e);
      session = refundCredits(session, check.cost);
      await saveSession(session);
      await shadowRelease(shadow, "provider_error");
      const raw =
        e && typeof e === "object" && "body" in e
          ? JSON.stringify((e as { body?: unknown }).body)
          : e instanceof Error
            ? e.message
            : "Generation failed";
      const kind = classifyProviderError(raw);
      const fallback =
        e instanceof Error ? e.message : "Generation failed";
      const msg = providerErrorMessage(kind, fallback);
      const code =
        kind === "balance"
          ? "PROVIDER_BALANCE"
          : kind === "rate"
            ? "PROVIDER_RATE_LIMIT"
            : "GENERATION_FAILED";
      const status = kind === "balance" ? 402 : kind === "rate" ? 429 : 500;
      const failBody: GenerateErrorBody = {
        error: msg,
        code,
        model,
        session: publicSession(session),
        creditsRefunded: true,
      };
      noteFailed(session.id, preset.slug, failBody);
      return err(failBody, status);
    }
  } finally {
    endJob(session.id);
  }
}
