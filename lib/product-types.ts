import type { AspectRatio, SeedanceResolution } from "@/lib/models";

export const ASSET_ROLES = [
  "front",
  "side",
  "back",
  "packaging",
] as const;

export type AssetRole = (typeof ASSET_ROLES)[number];
export type ProductAssetRole =
  | AssetRole
  | "output_source"
  | "output_watermarked"
  | "poster";
export type GenerationStatus =
  | "queued"
  | "running"
  | "succeeded"
  | "failed"
  | "canceled";
export type CreditStatus = "not_required" | "reserved" | "charged" | "refunded";
export type ProductPersistenceMode = "supabase" | "ephemeral";

export type ProductAsset = {
  id: string;
  ownerId: string;
  projectId: string | null;
  role: ProductAssetRole;
  fileName: string;
  contentType: string;
  byteSize: number | null;
  storageBucket: string;
  storagePath: string;
  status: "pending" | "ready" | "failed";
  createdAt: string;
  updatedAt: string;
};

export type ProductProject = {
  id: string;
  ownerId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export type GenerationInputAsset = {
  role: AssetRole;
  assetId?: string;
  /** Demo-only. Live jobs upload this to fal storage before queue submission. */
  dataUrl?: string;
};

export type GenerationInput = {
  presetId: string;
  assets: GenerationInputAsset[];
  purpose: string;
  prompt?: string;
  aspectRatio: AspectRatio;
  duration: number;
  modelId: string;
  resolution: SeedanceResolution;
  projectId?: string;
};

export type GenerationJob = {
  id: string;
  ownerId: string;
  projectId: string | null;
  retryOfJobId: string | null;
  idempotencyKey: string;
  status: GenerationStatus;
  progress: number;
  input: GenerationInput;
  provider: "fal" | "demo";
  providerRequestId: string | null;
  model: string;
  outputAssetId: string | null;
  outputUrl: string | null;
  posterUrl: string | null;
  demo: boolean;
  watermark: boolean;
  estimatedCredits: number;
  chargedCredits: number;
  creditStatus: CreditStatus;
  attempt: number;
  maxAttempts: number;
  error: string | null;
  createdAt: string;
  updatedAt: string;
  startedAt: string | null;
  completedAt: string | null;
};

export type PublicGenerationJob = {
  id: string;
  presetId: string;
  status: GenerationStatus;
  progress: number;
  outputUrl?: string;
  posterUrl?: string;
  demo: boolean;
  watermark: boolean;
  model: string;
  error?: string;
  chargedCredits: number;
  createdAt: string;
  updatedAt: string;
};

export function publicGenerationJob(job: GenerationJob): PublicGenerationJob {
  return {
    id: job.id,
    presetId: job.input.presetId,
    status: job.status,
    progress: job.progress,
    ...(job.outputUrl ? { outputUrl: job.outputUrl } : {}),
    ...(job.posterUrl ? { posterUrl: job.posterUrl } : {}),
    demo: job.demo,
    watermark: job.watermark,
    model: job.model,
    ...(job.error ? { error: job.error } : {}),
    chargedCredits: job.chargedCredits,
    createdAt: job.createdAt,
    updatedAt: job.updatedAt,
  };
}

export type FalWebhookPayload = {
  request_id?: string;
  gateway_request_id?: string;
  status?: "OK" | "ERROR" | string;
  payload?: Record<string, unknown>;
  error?: string | { message?: string };
};

export type SignedUpload = {
  url: string;
  token: string;
  path: string;
  expiresIn: number;
};
