/**
 * Foundation contracts — single shapes for generate / session surfaces.
 * UI and API must not invent parallel field names.
 */

import type { PublicSession } from "@/lib/session";
import type { ModelPreference, SeedanceResolution } from "@/lib/models";
import { CREDITS_PER_VIDEO } from "@/lib/pricing";

export type GenerateRequestBody = {
  effect?: string;
  /** data:image… URL (soft-launch default). Optional when assetId is set. */
  image?: string;
  /**
   * Phase D local asset id from POST /api/assets/upload-url + PUT content.
   * Server resolves the image for this session — avoids re-posting large Base64.
   */
  assetId?: string;
  extra?: string;
  duration?: number;
  aspectRatio?: string;
  model?: ModelPreference | string;
  resolution?: SeedanceResolution | string;
  seed?: number;
  /**
   * Soft-launch PRD §3/§5 — client must confirm ownership before submit.
   * Server rejects live jobs without this flag (demo path also requires it).
   */
  ownsRights?: boolean;
};

export type GenerateSuccess = {
  videoUrl: string;
  /** true when no live fal call was made (cached product demos) */
  demo: boolean;
  watermark: boolean;
  model: string;
  duration: number;
  aspectRatio: string;
  /** Server-enforced resolution (480p free / 720p paid default) */
  resolution: string;
  session: PublicSession;
  /** present on live fal jobs */
  requestId?: string;
  provider?: string;
  /** why demo was returned — only when demo:true */
  demoReason?: "no_provider_key";
  /**
   * Wave B — server-validated recipe slug actually used for this job.
   * Client must only label "server returned" when this field is present.
   */
  effect?: string;
  /** Credits charged for this success (0 cached demo · CREDITS_PER_VIDEO live). */
  costCredits?: number;
  /** Human credit outcome for the result strip. */
  creditsOutcome?: "0 cached" | "10 used";
};

export type GenerateErrorBody = {
  error: string;
  code?:
    | "INSUFFICIENT_CREDITS"
    | "INVALID_REQUEST"
    | "IMAGE_TOO_LARGE"
    | "ASSET_NOT_FOUND"
    | "UNKNOWN_EFFECT"
    | "MODEL_EMPTY"
    | "GENERATION_FAILED"
    | "PROVIDER_BALANCE"
    | "PROVIDER_RATE_LIMIT"
    | "PROVIDER_TIMEOUT"
    | "CONTENT_POLICY"
    | "RATE_LIMITED"
    | "JOB_IN_FLIGHT"
    | "RIGHTS_REQUIRED"
    | "UNSAFE_URL"
    /** Client-side only — fetch never reached a typed server body. */
    | "NETWORK_ERROR"
    | "REQUEST_CANCELED";
  need?: number;
  have?: number;
  model?: string;
  session?: PublicSession;
  /** seconds to wait on rate limits */
  retryAfterSec?: number;
  /**
   * Soft-launch PRD §5 — true when a live debit was restored after failure.
   * Absent/false when no debit occurred (validation, rate limit, demo path).
   */
  creditsRefunded?: boolean;
};

/** Future metering hook — flat cost today, structured for model×duration later. */
export type JobMeterInput = {
  freeTier: boolean;
  durationSec: number;
  resolution: SeedanceResolution;
  modelId: string;
};

/**
 * Credit cost for one generation job.
 * Today: flat CREDITS_PER_VIDEO. Tomorrow: branch on model/duration/resolution.
 */
export function jobCostCredits(job?: JobMeterInput): number {
  void job; // reserved for model×duration metering
  return CREDITS_PER_VIDEO;
}
