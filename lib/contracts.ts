/**
 * Foundation contracts — single shapes for generate / session surfaces.
 * UI and API must not invent parallel field names.
 */

import type { PublicSession } from "@/lib/session";
import type { ModelPreference, SeedanceResolution } from "@/lib/models";
import { CREDITS_PER_VIDEO } from "@/lib/pricing";

export type GenerateRequestBody = {
  effect?: string;
  image?: string;
  extra?: string;
  duration?: number;
  aspectRatio?: string;
  model?: ModelPreference | string;
  resolution?: SeedanceResolution | string;
  seed?: number;
};

export type GenerateSuccess = {
  videoUrl: string;
  /** true when no live fal call was made (cached product demos) */
  demo: boolean;
  watermark: boolean;
  model: string;
  duration: number;
  aspectRatio: string;
  session: PublicSession;
  /** present on live fal jobs */
  requestId?: string;
  provider?: string;
};

export type GenerateErrorBody = {
  error: string;
  code?:
    | "INSUFFICIENT_CREDITS"
    | "INVALID_REQUEST"
    | "IMAGE_TOO_LARGE"
    | "UNKNOWN_EFFECT"
    | "MODEL_EMPTY"
    | "GENERATION_FAILED";
  need?: number;
  have?: number;
  model?: string;
  session?: PublicSession;
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
