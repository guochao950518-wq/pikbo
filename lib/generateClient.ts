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
  /** Soft-launch: live debit restored after provider/validation failure. */
  creditsRefunded?: boolean;
  /** Stop further batch jobs (credits / provider balance empty). */
  fatal: boolean;
  /** Open paywall UI (user allowance, not provider). */
  paywall: boolean;
};

export type GenerateOk = {
  ok: true;
  status: number;
  data: GenerateSuccess;
  /**
   * True when the first attempt used assetId, server returned ASSET_NOT_FOUND,
   * and a second POST with inline fallbackImage succeeded. Clients should clear
   * the dead assetId and re-register the still for later smaller POSTs.
   */
  recoveredFromAssetMiss?: boolean;
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
  const creditsRefunded = body.creditsRefunded === true;

  let error =
    body.error ||
    (code === "RATE_LIMITED"
      ? `Too many generates — try again in ${retryAfterSec ?? "a few"}s`
      : code === "JOB_IN_FLIGHT"
        ? `A generate is already running — try again in ${retryAfterSec ?? "a few"}s`
        : code === "PROVIDER_BALANCE"
          ? "Provider balance empty — credits refunded."
          : code === "RIGHTS_REQUIRED"
            ? "Confirm you own this photo and have the right to animate it"
            : code === "UNKNOWN_EFFECT"
              ? "Unknown effect — pick a registered recipe"
              : code === "IMAGE_TOO_LARGE"
                ? "Image too large (max ~8MB)"
                : code === "ASSET_NOT_FOUND"
                  ? "Photo asset expired on the server — re-upload or retry with the same still"
                  : "Generation failed");

  // PRD §5: recoverable failures must say whether the 10 credits were restored.
  if (
    creditsRefunded &&
    !/refund|restored|credit/i.test(error)
  ) {
    error = `${error} · 10 credits restored`;
  }

  return {
    ok: false,
    status,
    error,
    code,
    session: body.session,
    retryAfterSec,
    creditsRefunded,
    fatal,
    paywall,
  };
}

async function generateAuthHeaders(): Promise<Record<string, string>> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (typeof window === "undefined") return headers;
  try {
    const { getSupabaseBrowser } = await import("@/lib/supabase/browser");
    const supabase = getSupabaseBrowser();
    if (!supabase) return headers;
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    if (token) headers.Authorization = `Bearer ${token}`;
  } catch {
    /* guest path */
  }
  return headers;
}

export async function postGenerate(
  body: GenerateRequestBody,
  init?: { signal?: AbortSignal }
): Promise<GenerateResult> {
  try {
    const headers = await generateAuthHeaders();
    const res = await fetch("/api/generate", {
      method: "POST",
      headers,
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
    const aborted =
      (e instanceof Error && e.name === "AbortError") ||
      (typeof DOMException !== "undefined" &&
        e instanceof DOMException &&
        e.name === "AbortError");
    return {
      ok: false,
      status: 0,
      error: aborted
        ? "Request canceled — if credits were debited, check balance or retry (refund unconfirmed until server confirms)"
        : e instanceof Error
          ? e.message
          : "Network error",
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
    /** Remix handoff — official Lab project id */
    sourceProject?: string;
    channel?: string;
    /** Existing same-browser Library grouping. */
    projectId?: string;
    projectName?: string;
    inputImage?: string;
    /** Optional Toy Identity SKU for Library grouping/filter. */
    sku?: string;
  }
): Omit<HistoryItem, "id" | "createdAt"> {
  return {
    videoUrl: data.videoUrl,
    projectId: meta.projectId,
    projectName: meta.projectName,
    inputImage: meta.inputImage,
    sku: meta.sku,
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
    sourceProject: meta.sourceProject,
    channel: meta.channel,
    status: "succeeded",
    creditStatus: data.demo ? "0 cached" : "10 used",
  };
}

/** Sleep that rejects with AbortError when signal aborts (cancel mid-retry wait). */
export function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(
        typeof DOMException !== "undefined"
          ? new DOMException("Aborted", "AbortError")
          : Object.assign(new Error("Aborted"), { name: "AbortError" })
      );
      return;
    }
    const t = setTimeout(() => {
      signal?.removeEventListener("abort", onAbort);
      resolve();
    }, ms);
    function onAbort() {
      clearTimeout(t);
      reject(
        typeof DOMException !== "undefined"
          ? new DOMException("Aborted", "AbortError")
          : Object.assign(new Error("Aborted"), { name: "AbortError" })
      );
    }
    signal?.addEventListener("abort", onAbort, { once: true });
  });
}

async function bearerAuthHeaders(): Promise<Record<string, string>> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (typeof window === "undefined") return headers;
  try {
    const { getSupabaseBrowser } = await import("@/lib/supabase/browser");
    const supabase = getSupabaseBrowser();
    if (!supabase) return headers;
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    if (token) headers.Authorization = `Bearer ${token}`;
  } catch {
    /* guest */
  }
  return headers;
}

/** Seller Pack durable shadow reserve (30 for 3 children). Non-fatal if durable off. */
export async function reserveSellerPackShadowClient(input?: {
  childCount?: number;
  idempotencyKey?: string;
}): Promise<{
  ok: boolean;
  reservationId?: string;
  code?: string;
  error?: string;
  quoteCredits?: number;
}> {
  try {
    const headers = await bearerAuthHeaders();
    const res = await fetch("/api/seller-pack/reserve", {
      method: "POST",
      headers,
      body: JSON.stringify(input ?? {}),
    });
    const raw = (await res.json().catch(() => ({}))) as {
      ok?: boolean;
      code?: string;
      error?: string;
      quoteCredits?: number;
      pack?: { reservationId?: string };
    };
    if (raw.ok && raw.pack?.reservationId) {
      return {
        ok: true,
        reservationId: raw.pack.reservationId,
        quoteCredits: raw.quoteCredits,
      };
    }
    return {
      ok: false,
      code: raw.code || String(res.status),
      error: raw.error,
      quoteCredits: raw.quoteCredits,
    };
  } catch (e) {
    return {
      ok: false,
      code: "NETWORK",
      error: e instanceof Error ? e.message : "reserve failed",
    };
  }
}

export async function settleSellerPackChildClient(input: {
  reservationId: string;
  jobId?: string;
  childKey?: string;
}): Promise<void> {
  try {
    const headers = await bearerAuthHeaders();
    await fetch("/api/seller-pack/settle", {
      method: "POST",
      headers,
      body: JSON.stringify(input),
    });
  } catch {
    /* best-effort shadow */
  }
}

export async function releaseSellerPackChildClient(input: {
  reservationId: string;
  jobId?: string;
  childKey?: string;
  reason?: string;
}): Promise<void> {
  try {
    const headers = await bearerAuthHeaders();
    await fetch("/api/seller-pack/release", {
      method: "POST",
      headers,
      body: JSON.stringify(input),
    });
  } catch {
    /* best-effort shadow */
  }
}

/**
 * POST generate with automatic recovery:
 * - one retry on RATE_LIMITED / PROVIDER_RATE_LIMIT / JOB_IN_FLIGHT
 * - one ASSET_NOT_FOUND recovery: drop expired assetId and re-POST inline still
 *   (Phase D local assets TTL ~15m / process restart — Seller Pack mid-queue)
 */
export async function postGenerateWithRetry(
  body: GenerateRequestBody,
  opts?: {
    maxRetries?: number;
    signal?: AbortSignal;
    /**
     * Local data URL for the still. Used only when the server returns
     * ASSET_NOT_FOUND for body.assetId (never re-debits on the failed attempt).
     */
    fallbackImage?: string;
  }
): Promise<GenerateResult> {
  const maxRetries = opts?.maxRetries ?? 1;
  let attempt = 0;
  let result = await postGenerate(body, { signal: opts?.signal });
  while (
    !result.ok &&
    attempt < maxRetries &&
    (result.code === "RATE_LIMITED" ||
      result.code === "PROVIDER_RATE_LIMIT" ||
      result.code === "JOB_IN_FLIGHT")
  ) {
    attempt += 1;
    // Prefer server Retry-After; keep JOB_IN_FLIGHT waits short (active job may finish soon).
    const waitSec =
      result.code === "JOB_IN_FLIGHT"
        ? Math.min(8, Math.max(2, result.retryAfterSec ?? 2))
        : (result.retryAfterSec ?? 8);
    try {
      await sleep(Math.min(60, Math.max(1, waitSec)) * 1000, opts?.signal);
    } catch (e) {
      const aborted =
        (e instanceof Error && e.name === "AbortError") ||
        (typeof DOMException !== "undefined" &&
          e instanceof DOMException &&
          e.name === "AbortError");
      if (aborted) {
        return {
          ok: false,
          status: 0,
          error:
            "Request canceled — if credits were debited, check balance or retry (refund unconfirmed until server confirms)",
          fatal: false,
          paywall: false,
        };
      }
      throw e;
    }
    result = await postGenerate(body, { signal: opts?.signal });
  }

  // Asset registry miss: re-post with inline still once (no second rate-limit loop).
  const fallback = opts?.fallbackImage;
  if (
    !result.ok &&
    result.code === "ASSET_NOT_FOUND" &&
    typeof body.assetId === "string" &&
    body.assetId &&
    typeof fallback === "string" &&
    fallback.startsWith("data:image") &&
    fallback.length >= 32
  ) {
    const recovered = await postGenerate(
      { ...body, assetId: undefined, image: fallback },
      { signal: opts?.signal }
    );
    if (recovered.ok) {
      return { ...recovered, recoveredFromAssetMiss: true };
    }
    return recovered;
  }
  return result;
}
