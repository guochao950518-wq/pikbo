/**
 * Phase D — generation job records (local memory adapter until Supabase).
 * Soft-launch still runs sync /api/generate; jobs are recorded for poll/recovery.
 */

export type GenerationJobStatus =
  | "queued"
  | "running"
  | "succeeded"
  | "failed"
  | "canceled";

export type GenerationJob = {
  id: string;
  sessionId: string;
  status: GenerationJobStatus;
  effect: string;
  demo: boolean;
  watermark: boolean;
  /** Free live raw provider URL must not be downloadable (T6). */
  downloadAllowed: boolean;
  videoUrl?: string;
  model?: string;
  duration?: number;
  aspectRatio?: string;
  resolution?: string;
  costCredits?: number;
  creditsOutcome?: "0 cached" | "10 used" | "10 restored" | "refund unconfirmed";
  creditsRefunded?: boolean;
  requestId?: string;
  provider?: string;
  error?: string;
  errorCode?: string;
  /** Client-supplied idempotency key (optional). */
  idempotencyKey?: string;
  createdAt: string;
  updatedAt: string;
};

/** Public view — never exposes private storage paths. */
export type PublicGenerationJob = Omit<GenerationJob, "sessionId"> & {
  /** True when this session owns the job. */
  owned: boolean;
};
