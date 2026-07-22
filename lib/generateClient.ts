/**
 * Shared client for POST /api/generate.
 * Keeps Create / Landing / Batch error + history shapes aligned.
 */

import type {
  GenerateErrorBody,
  GenerateRequestBody,
  GenerateSuccess,
} from "@/lib/contracts";
import type { HistoryItem } from "@/lib/history";
import type { PublicSession } from "@/lib/session";

export type GenerateFail = {
  ok: false;
  status: number;
  error: string;
  code?: GenerateErrorBody["code"];
  session?: PublicSession;
  retryAfterSec?: number;
  /** Stop further batch jobs (credits / provider balance empty). */
  fatal: boolean;
  /** Open paywall UI (user allowance, not provider). */
  paywall: boolean;
};

export type GenerateOk = {
  ok: true;
  status: number;
  data: GenerateSuccess;
};

export type GenerateResult = GenerateOk | GenerateFail;

function asErrorBody(data: unknown): GenerateErrorBody {
  if (data && typeof data === "object") {
    return data as GenerateErrorBody;
  }
  return { error: "Generation failed" };
}

function asSuccess(data: unknown): GenerateSuccess | null {
  if (!data || typeof data !== "object") return null;
  const d = data as Partial<GenerateSuccess>;
  if (typeof d.videoUrl !== "string" || !d.videoUrl) return null;
  return d as GenerateSuccess;
}

/** Parse a fetch Response + JSON into a typed generate result. */
export function interpretGenerateResponse(
  status: number,
  raw: unknown
): GenerateResult {
  if (status >= 200 && status < 300) {
    const data = asSuccess(raw);
    if (!data) {
      return {
        ok: false,
        status,
        error: "Model returned an empty clip",
        code: "MODEL_EMPTY",
        fatal: false,
        paywall: false,
      };
    }
    return { ok: true, status, data };
  }

  const body = asErrorBody(raw);
  const code = body.code;
  const retryAfterSec =
    typeof body.retryAfterSec === "number" && body.retryAfterSec > 0
      ? body.retryAfterSec
      : undefined;

  const paywall = code === "INSUFFICIENT_CREDITS";
  const fatal =
    code === "INSUFFICIENT_CREDITS" || code === "PROVIDER_BALANCE";

  const error =
    body.error ||
    (code === "RATE_LIMITED"
      ? `Too many generates — try again in ${retryAfterSec ?? "a few"}s`
      : code === "PROVIDER_BALANCE"
        ? "Provider balance empty — credits refunded."
        : "Generation failed");

  return {
    ok: false,
    status,
    error,
    code,
    session: body.session,
    retryAfterSec,
    fatal,
    paywall,
  };
}

export async function postGenerate(
  body: GenerateRequestBody,
  init?: { signal?: AbortSignal }
): Promise<GenerateResult> {
  try {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: init?.signal,
    });
    let raw: unknown = null;
    try {
      raw = await res.json();
    } catch {
      raw = { error: "Invalid server response" };
    }
    return interpretGenerateResponse(res.status, raw);
  } catch (e) {
    return {
      ok: false,
      status: 0,
      error: e instanceof Error ? e.message : "Network error",
      fatal: false,
      paywall: false,
    };
  }
}

/** Map a success payload into library history fields. */
export function historyFieldsFromSuccess(
  data: GenerateSuccess,
  meta: {
    effect: string;
    effectName: string;
    fallbackDuration?: number;
    fallbackAspect?: string;
    fallbackResolution?: string;
  }
): Omit<HistoryItem, "id" | "createdAt"> {
  return {
    videoUrl: data.videoUrl,
    effect: meta.effect,
    effectName: meta.effectName,
    model: data.model,
    watermark: Boolean(data.watermark),
    demo: Boolean(data.demo),
    duration:
      typeof data.duration === "number"
        ? data.duration
        : meta.fallbackDuration,
    aspectRatio:
      typeof data.aspectRatio === "string"
        ? data.aspectRatio
        : meta.fallbackAspect,
    resolution:
      typeof data.resolution === "string"
        ? data.resolution
        : meta.fallbackResolution,
    requestId:
      typeof data.requestId === "string" ? data.requestId : undefined,
  };
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * POST generate with one automatic retry on RATE_LIMITED / PROVIDER_RATE_LIMIT.
 * Used by batch so sequential jobs survive the soft 8/min window.
 */
export async function postGenerateWithRetry(
  body: GenerateRequestBody,
  opts?: { maxRetries?: number; signal?: AbortSignal }
): Promise<GenerateResult> {
  const maxRetries = opts?.maxRetries ?? 1;
  let attempt = 0;
  let result = await postGenerate(body, { signal: opts?.signal });
  while (
    !result.ok &&
    attempt < maxRetries &&
    (result.code === "RATE_LIMITED" || result.code === "PROVIDER_RATE_LIMIT")
  ) {
    attempt += 1;
    const waitSec = result.retryAfterSec ?? 8;
    await sleep(Math.min(60, Math.max(1, waitSec)) * 1000);
    result = await postGenerate(body, { signal: opts?.signal });
  }
  return result;
}
