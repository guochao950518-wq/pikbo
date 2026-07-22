/**
 * Video backends for Pikbo.
 * Default: ByteDance Seedance via fal.ai
 * Free  → Fast · Paid → Full (user can prefer Fast on paid too)
 */

export const SEEDANCE_FAST =
  "bytedance/seedance-2.0/fast/image-to-video";
export const SEEDANCE_FULL =
  "bytedance/seedance-2.0/image-to-video";

export type ModelPreference = "seedance-2" | "seedance-fast";

export function modelForTier(opts: {
  freeTier: boolean;
  prefer?: ModelPreference | string | null;
}): string {
  // Free plan always on Fast (cost control)
  if (opts.freeTier) {
    return process.env.FAL_MODEL_FREE || SEEDANCE_FAST;
  }
  if (opts.prefer === "seedance-fast") {
    return process.env.FAL_MODEL_FREE || SEEDANCE_FAST;
  }
  return process.env.FAL_MODEL || SEEDANCE_FULL;
}

export type SeedanceResolution = "480p" | "720p";

export function resolutionForTier(
  freeTier: boolean,
  prefer?: SeedanceResolution | string | null
): SeedanceResolution {
  if (freeTier) return "480p";
  if (prefer === "480p" || prefer === "720p") return prefer;
  return "720p";
}

/** fal text-to-image for Image Studio (cheap/fast default). */
export const IMAGE_MODEL =
  process.env.FAL_IMAGE_MODEL || "fal-ai/flux/schnell";

export type AspectRatio = "9:16" | "16:9" | "1:1" | "auto";

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

export function clampDuration(n: unknown, fallback = 5): number {
  const v = Number(n);
  if (!Number.isFinite(v)) return fallback;
  return Math.min(10, Math.max(4, Math.round(v)));
}

export function normalizeAspect(
  a: unknown,
  fallback: AspectRatio = "9:16"
): AspectRatio {
  if (a === "9:16" || a === "16:9" || a === "1:1" || a === "auto") return a;
  return fallback;
}
