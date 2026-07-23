/**
 * Wave B — pure helpers for Create credit settlement, retry specs, free download gate.
 * Kept free of React so engine-smoke can assert honesty without a browser.
 */

import { CREDITS_PER_VIDEO } from "@/lib/pricing";

/** Settlement of the most recent generate attempt (not a historical version). */
export type RequestCreditState =
  | "0 cached"
  | "10 used"
  | "10 restored"
  | "refund unconfirmed"
  | null;

/** Immutable params that produced a successful version (Retry must reuse these). */
export type GenerationSpec = {
  image: string;
  effect: string;
  extra: string;
  aspectRatio: "9:16" | "16:9" | "1:1" | string;
  duration: number;
  resolution: string;
  model: string;
  seed?: number;
  /** Server requestId when the live job returned one. */
  requestId?: string;
};

/**
 * Map a failed generate result to the request settlement chip.
 * Network / abort → unconfirmed; confirmed refund → restored; else null
 * (validation / 402 before debit should not claim refund).
 */
export function requestCreditStateFromFailure(result: {
  creditsRefunded?: boolean;
  status: number;
}): Exclude<RequestCreditState, "0 cached" | "10 used"> {
  if (result.creditsRefunded === true) return "10 restored";
  if (result.status === 0) return "refund unconfirmed";
  return null;
}

/** Success path settlement for the last request. */
export function requestCreditStateFromSuccess(demo: boolean): "0 cached" | "10 used" {
  return demo ? "0 cached" : "10 used";
}

/**
 * After a failure, keep showing prior versions — but never let a version's
 * used/cached chip overwrite the last request settlement.
 */
export function preserveRequestSettlementOnVersionRestore(
  lastRequest: RequestCreditState,
  _versionCredit: "0 cached" | "10 used"
): RequestCreditState {
  void _versionCredit;
  return lastRequest;
}

/**
 * Selecting a historical version must not wipe the last failed settlement.
 */
export function requestSettlementAfterSelectVersion(
  lastRequest: RequestCreditState
): RequestCreditState {
  return lastRequest;
}

/**
 * Free live results expose a provider raw URL until server watermark bake exists.
 * Download must not treat that URL as a deliverable.
 * Cached demos may still offer open/download (not the user's live output).
 */
export function canDownloadResult(opts: {
  demo: boolean;
  watermark: boolean;
}): boolean {
  if (opts.demo) return true;
  if (opts.watermark) return false;
  return true;
}

export function freeLiveDownloadBlockReason(): string {
  return "Free Mini live clips cannot download the raw provider file yet — player mark is not a file watermark. Upgrade for a clean file, or keep the on-player preview.";
}

/** Build immutable spec snapshot at success time. */
export function buildGenerationSpec(input: {
  image: string;
  effect: string;
  extra: string;
  aspectRatio: string;
  duration: number;
  resolution: string;
  model: string;
  seed?: number;
  requestId?: string;
}): GenerationSpec {
  return {
    image: input.image,
    effect: input.effect,
    extra: input.extra,
    aspectRatio: input.aspectRatio,
    duration: input.duration,
    resolution: input.resolution,
    model: input.model,
    seed: input.seed,
    requestId: input.requestId,
  };
}

/** Server-echoed credit cost for honesty metadata. */
export function serverCostCredits(demo: boolean): number {
  return demo ? 0 : CREDITS_PER_VIDEO;
}
