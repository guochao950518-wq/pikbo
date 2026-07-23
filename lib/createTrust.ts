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
  /**
   * Session source-store key (preferred). Resolves to the still without
   * duplicating multi-MB Base64 across every version.
   */
  sourceKey: string;
  /**
   * @deprecated Prefer sourceKey + session source store. Kept optional only so
   * older in-memory stacks from a long session still typecheck.
   */
  image?: string;
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

/** FNV-1a style key for interning large stills in a session Map. */
export function sourceImageKey(image: string): string {
  let hash = 2166136261;
  const sample = image.length > 8192 ? image.slice(0, 4096) + image.slice(-4096) : image;
  for (let i = 0; i < sample.length; i += 1) {
    hash ^= sample.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return `src-${image.length.toString(36)}-${(hash >>> 0).toString(36)}`;
}

/**
 * Intern a still into a session store so 8 versions of the same photo share
 * one Base64 string in memory.
 */
export function internSourceImage(
  store: Record<string, string>,
  image: string
): { key: string; store: Record<string, string> } {
  const key = sourceImageKey(image);
  if (store[key] === image) return { key, store };
  if (store[key]) return { key, store };
  return { key, store: { ...store, [key]: image } };
}

export function resolveSpecImage(
  spec: GenerationSpec,
  store: Record<string, string>
): string | null {
  if (spec.sourceKey && store[spec.sourceKey]) return store[spec.sourceKey];
  if (typeof spec.image === "string" && spec.image) return spec.image;
  return null;
}

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
 * When PIKBO_T6_FILE_BAKE=1 (operator-proven bake), free live may download.
 */
export function canDownloadResult(opts: {
  demo: boolean;
  watermark: boolean;
}): boolean {
  if (opts.demo) return true;
  if (opts.watermark) {
    // Lazy import avoided — keep createTrust free of heavy deps.
    // T6 ready only when operator sets PIKBO_T6_FILE_BAKE=1.
    if (process.env.PIKBO_T6_FILE_BAKE === "1") return true;
    return false;
  }
  return true;
}

export function freeLiveDownloadBlockReason(): string {
  return "Free Mini live clips cannot download the raw provider file yet — player mark is not a file watermark (T6 blocked). Upgrade for a clean file, or keep the on-player preview.";
}

/** Build immutable spec snapshot at success time. */
export function buildGenerationSpec(input: {
  sourceKey: string;
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
    sourceKey: input.sourceKey,
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
