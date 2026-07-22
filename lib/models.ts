/**
 * Video backends for Pikbo.
 * Default stack: ByteDance Seedance via fal.ai (user requirement).
 *
 * Free  → Seedance 2.0 Fast (cheaper / lower latency)
 * Paid  → Seedance 2.0 full image-to-video
 *
 * Override anytime with FAL_MODEL / FAL_MODEL_FREE env vars.
 */

export const SEEDANCE_FAST =
  "bytedance/seedance-2.0/fast/image-to-video";
export const SEEDANCE_FULL =
  "bytedance/seedance-2.0/image-to-video";

/** @deprecated previous default — only if env points here */
export const KLING_I2V =
  "fal-ai/kling-video/v1.6/standard/image-to-video";

export function modelForTier(opts: {
  freeTier: boolean;
}): string {
  if (opts.freeTier) {
    return (
      process.env.FAL_MODEL_FREE ||
      process.env.FAL_MODEL ||
      SEEDANCE_FAST
    );
  }
  return process.env.FAL_MODEL || SEEDANCE_FULL;
}

export type SeedanceResolution = "480p" | "720p";

export function resolutionForTier(freeTier: boolean): SeedanceResolution {
  // Free keeps cost down; paid gets 720p balance (Seedance 2.0 max 720p on these endpoints)
  return freeTier ? "480p" : "720p";
}

/** Map preset duration (5 | 10) to Seedance enum string. */
export function seedanceDuration(
  seconds: number
): "4" | "5" | "6" | "7" | "8" | "9" | "10" | "auto" {
  if (seconds <= 4) return "4";
  if (seconds <= 5) return "5";
  if (seconds <= 6) return "6";
  if (seconds <= 8) return "8";
  if (seconds <= 10) return "10";
  return "auto";
}
