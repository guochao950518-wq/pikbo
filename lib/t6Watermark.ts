/**
 * T6 — protected Free deliverables (file watermark bake).
 *
 * Honest status only. Player CSS overlay is NOT a file watermark.
 * Until ffmpeg/worker (or approved media service) produces a baked derivative,
 * Free live raw provider URLs stay undownloadable.
 */

export type T6Status = "blocked" | "ready";

export type T6Report = {
  status: T6Status;
  /** Never claim done without a verified baked file pipeline. */
  fileBake: false | true;
  playerOverlayIsNotFileWatermark: true;
  freeLiveRawDownload: "blocked" | "allowed";
  reason: string;
  /** Env / tooling presence only — not a green light alone. */
  tooling: {
    ffmpegHint: boolean;
    workerUrlConfigured: boolean;
  };
};

/**
 * Detect optional tooling without requiring it. Presence of FFmpeg on PATH
 * does not flip T6 ready until a bake endpoint is verified in production.
 */
export function t6ToolingProbe(): T6Report["tooling"] {
  return {
    // Soft signal only — agents may not have PATH ffmpeg even if deploy does.
    ffmpegHint: process.env.PIKBO_FFMPEG_PATH
      ? process.env.PIKBO_FFMPEG_PATH.length > 0
      : false,
    workerUrlConfigured: Boolean(
      (process.env.PIKBO_WATERMARK_WORKER_URL || "").startsWith("http")
    ),
  };
}

/**
 * Authoritative T6 readiness. Opt-in only via PIKBO_T6_FILE_BAKE=1 after
 * the bake pipeline is proven (never default true).
 */
export function t6Report(): T6Report {
  const tooling = t6ToolingProbe();
  const forcedReady = process.env.PIKBO_T6_FILE_BAKE === "1";
  if (forcedReady) {
    return {
      status: "ready",
      fileBake: true,
      playerOverlayIsNotFileWatermark: true,
      freeLiveRawDownload: "allowed",
      reason:
        "PIKBO_T6_FILE_BAKE=1 — operator asserts baked Free derivative pipeline is live",
      tooling,
    };
  }
  return {
    status: "blocked",
    fileBake: false,
    playerOverlayIsNotFileWatermark: true,
    freeLiveRawDownload: "blocked",
    reason:
      "No server-side baked watermark pipeline yet. Free Mini live raw provider URLs must not download; on-player mark is not a file watermark.",
    tooling,
  };
}

export function t6BlocksFreeLiveDownload(): boolean {
  return t6Report().freeLiveRawDownload === "blocked";
}
