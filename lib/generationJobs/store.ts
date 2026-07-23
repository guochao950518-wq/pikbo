/**
 * In-process generation job ledger (Phase D local adapter).
 * Survives the soft-launch process for recovery/poll; not multi-node durable.
 * Supabase job table remains the production target (AUTH_CREDITS / Phase D PRD).
 */

import { canDownloadResult } from "@/lib/createTrust";
import type {
  GenerationJob,
  GenerationJobStatus,
  PublicGenerationJob,
} from "@/lib/generationJobs/types";

const MAX_JOBS = 200;
const jobs = new Map<string, GenerationJob>();
/** idempotencyKey → job id (session-scoped via key prefix) */
const byIdempotency = new Map<string, string>();

function nowIso(): string {
  return new Date().toISOString();
}

function newId(): string {
  return `job_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

function trimStore() {
  if (jobs.size <= MAX_JOBS) return;
  const ordered = [...jobs.values()].sort((a, b) =>
    a.createdAt.localeCompare(b.createdAt)
  );
  const drop = ordered.slice(0, jobs.size - MAX_JOBS);
  for (const j of drop) {
    jobs.delete(j.id);
    if (j.idempotencyKey) {
      byIdempotency.delete(`${j.sessionId}:${j.idempotencyKey}`);
    }
  }
}

export function downloadAllowedForJob(opts: {
  demo: boolean;
  watermark: boolean;
  status: GenerationJobStatus;
}): boolean {
  if (opts.status !== "succeeded") return false;
  return canDownloadResult({ demo: opts.demo, watermark: opts.watermark });
}

export function createJob(input: {
  sessionId: string;
  effect: string;
  status?: GenerationJobStatus;
  idempotencyKey?: string;
  parentJobId?: string;
}): GenerationJob {
  if (input.idempotencyKey) {
    const existingId = byIdempotency.get(
      `${input.sessionId}:${input.idempotencyKey}`
    );
    if (existingId) {
      const existing = jobs.get(existingId);
      if (existing) return existing;
    }
  }
  const t = nowIso();
  const job: GenerationJob = {
    id: newId(),
    sessionId: input.sessionId,
    status: input.status ?? "queued",
    effect: input.effect,
    demo: false,
    watermark: true,
    downloadAllowed: false,
    idempotencyKey: input.idempotencyKey,
    parentJobId: input.parentJobId,
    createdAt: t,
    updatedAt: t,
  };
  jobs.set(job.id, job);
  if (input.idempotencyKey) {
    byIdempotency.set(`${input.sessionId}:${input.idempotencyKey}`, job.id);
  }
  trimStore();
  return job;
}

/**
 * Soft-launch local retry: fork a new queued job from a prior attempt.
 * Does not re-run the provider (no stored still). Client must POST /api/generate
 * with the original image + effect; Seller Pack keeps sibling successes.
 */
export function forkRetryJob(input: {
  sessionId: string;
  parentId: string;
}):
  | { ok: true; job: GenerationJob; parent: GenerationJob }
  | { ok: false; code: "NOT_FOUND" | "NOT_OWNED"; message: string } {
  const parent = jobs.get(input.parentId);
  if (!parent) {
    return {
      ok: false,
      code: "NOT_FOUND",
      message: "Parent job not in this process ledger",
    };
  }
  if (parent.sessionId !== input.sessionId) {
    return {
      ok: false,
      code: "NOT_OWNED",
      message: "Job belongs to another session",
    };
  }
  const job = createJob({
    sessionId: input.sessionId,
    effect: parent.effect,
    status: "queued",
    parentJobId: parent.id,
    idempotencyKey: `retry:${parent.id}:${Math.floor(Date.now() / 5000)}`,
  });
  return { ok: true, job, parent };
}

export function getJob(id: string): GenerationJob | null {
  return jobs.get(id) ?? null;
}

/**
 * Cancel a queued/running local job. Terminal states are left unchanged.
 * Soft-launch sync generate cannot interrupt fal mid-flight; this marks the
 * ledger honestly for clients that abandon a poll.
 */
export function cancelJob(input: {
  sessionId: string;
  id: string;
}):
  | { ok: true; job: GenerationJob }
  | {
      ok: false;
      code: "NOT_FOUND" | "NOT_OWNED" | "NOT_CANCELABLE";
      message: string;
      job?: GenerationJob;
    } {
  const job = jobs.get(input.id);
  if (!job) {
    return {
      ok: false,
      code: "NOT_FOUND",
      message: "Job not in this process ledger",
    };
  }
  if (job.sessionId !== input.sessionId) {
    return {
      ok: false,
      code: "NOT_OWNED",
      message: "Job belongs to another session",
    };
  }
  if (job.status === "canceled") {
    return { ok: true, job };
  }
  if (job.status === "succeeded" || job.status === "failed") {
    return {
      ok: false,
      code: "NOT_CANCELABLE",
      message: `Job already ${job.status}`,
      job,
    };
  }
  const next = updateJob(job.id, {
    status: "canceled",
    error: "Canceled by client",
    errorCode: "CANCELED",
  });
  if (!next) {
    return {
      ok: false,
      code: "NOT_FOUND",
      message: "Job disappeared during cancel",
    };
  }
  return { ok: true, job: next };
}

export function listJobsForSession(
  sessionId: string,
  limit = 20
): GenerationJob[] {
  return [...jobs.values()]
    .filter((j) => j.sessionId === sessionId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, limit);
}

export function updateJob(
  id: string,
  patch: Partial<
    Omit<GenerationJob, "id" | "sessionId" | "createdAt" | "idempotencyKey">
  >
): GenerationJob | null {
  const cur = jobs.get(id);
  if (!cur) return null;
  const next: GenerationJob = {
    ...cur,
    ...patch,
    id: cur.id,
    sessionId: cur.sessionId,
    createdAt: cur.createdAt,
    updatedAt: nowIso(),
  };
  // Recompute download gate whenever status/demo/watermark change.
  if (
    patch.status !== undefined ||
    patch.demo !== undefined ||
    patch.watermark !== undefined
  ) {
    next.downloadAllowed = downloadAllowedForJob({
      demo: next.demo,
      watermark: next.watermark,
      status: next.status,
    });
  }
  jobs.set(id, next);
  return next;
}

/** Record a finished sync generate (success path). */
export function recordSucceededGenerate(input: {
  sessionId: string;
  effect: string;
  videoUrl: string;
  demo: boolean;
  watermark: boolean;
  model?: string;
  duration?: number;
  aspectRatio?: string;
  resolution?: string;
  costCredits?: number;
  creditsOutcome?: GenerationJob["creditsOutcome"];
  requestId?: string;
  provider?: string;
  /** Prefer provider requestId as job id when unique. */
  preferredId?: string;
}): GenerationJob {
  const t = nowIso();
  const id =
    input.preferredId && !jobs.has(input.preferredId)
      ? input.preferredId
      : newId();
  const job: GenerationJob = {
    id,
    sessionId: input.sessionId,
    status: "succeeded",
    effect: input.effect,
    demo: input.demo,
    watermark: input.watermark,
    downloadAllowed: downloadAllowedForJob({
      demo: input.demo,
      watermark: input.watermark,
      status: "succeeded",
    }),
    videoUrl: input.videoUrl,
    model: input.model,
    duration: input.duration,
    aspectRatio: input.aspectRatio,
    resolution: input.resolution,
    costCredits: input.costCredits,
    creditsOutcome: input.creditsOutcome,
    requestId: input.requestId,
    provider: input.provider,
    createdAt: t,
    updatedAt: t,
  };
  jobs.set(id, job);
  trimStore();
  return job;
}

/** Record a failed generate attempt (after debit path when known). */
export function recordFailedGenerate(input: {
  sessionId: string;
  effect: string;
  error: string;
  errorCode?: string;
  model?: string;
  creditsRefunded?: boolean;
  preferredId?: string;
}): GenerationJob {
  const t = nowIso();
  const id =
    input.preferredId && !jobs.has(input.preferredId)
      ? input.preferredId
      : newId();
  const creditsOutcome: GenerationJob["creditsOutcome"] = input.creditsRefunded
    ? "10 restored"
    : undefined;
  const job: GenerationJob = {
    id,
    sessionId: input.sessionId,
    status: "failed",
    effect: input.effect,
    demo: false,
    watermark: true,
    downloadAllowed: false,
    model: input.model,
    error: input.error,
    errorCode: input.errorCode,
    creditsRefunded: input.creditsRefunded,
    creditsOutcome,
    createdAt: t,
    updatedAt: t,
  };
  jobs.set(id, job);
  trimStore();
  return job;
}

export function toPublicJob(
  job: GenerationJob,
  sessionId: string
): PublicGenerationJob {
  const owned = job.sessionId === sessionId;
  // Never leak another session's video URL.
  if (!owned) {
    return {
      id: job.id,
      status: "failed",
      effect: job.effect,
      demo: false,
      watermark: true,
      downloadAllowed: false,
      error: "Not found",
      createdAt: job.createdAt,
      updatedAt: job.updatedAt,
      owned: false,
    };
  }
  const { sessionId: _s, ...rest } = job;
  void _s;
  return { ...rest, owned: true };
}

/** Test helper — clear process memory. */
export function __resetGenerationJobsForTests() {
  jobs.clear();
  byIdempotency.clear();
}
