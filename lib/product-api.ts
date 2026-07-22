import { randomUUID } from "crypto";
import { ProductApiError } from "@/lib/product-errors";
import type { ProductStore } from "@/lib/product-store";
import {
  ASSET_ROLES,
  publicGenerationJob,
  type AssetRole,
  type GenerationInput,
  type GenerationJob,
} from "@/lib/product-types";
import { clampDuration, normalizeAspect, type SeedanceResolution } from "@/lib/models";
import { getPreset } from "@/lib/presets";
import { CREDITS_PER_VIDEO, getPlan } from "@/lib/pricing";
import type { UserSession } from "@/lib/session";

const MAX_INLINE_IMAGE_BYTES = 15 * 1024 * 1024;
const DATA_IMAGE = /^data:image\/(png|jpeg|webp|avif);base64,/;

function cleanText(value: unknown, fallback: string, maxLength: number): string {
  if (typeof value !== "string") return fallback;
  const clean = value.trim();
  return clean ? clean.slice(0, maxLength) : fallback;
}

function validRole(value: unknown): value is AssetRole {
  return typeof value === "string" && ASSET_ROLES.includes(value as AssetRole);
}

function validateInlineImage(dataUrl: string): void {
  const match = DATA_IMAGE.exec(dataUrl);
  if (!match) {
    throw new ProductApiError(
      "invalid_inline_image",
      "Inline assets must be PNG, JPEG, WebP, or AVIF data URLs",
      400
    );
  }
  const payloadLength = dataUrl.length - match[0].length;
  const approximateBytes = Math.floor((payloadLength * 3) / 4);
  if (approximateBytes > MAX_INLINE_IMAGE_BYTES) {
    throw new ProductApiError(
      "inline_image_too_large",
      "Inline images must be 15 MB or smaller",
      413
    );
  }
}

export function parseGenerationInput(body: unknown): GenerationInput {
  if (!body || typeof body !== "object") {
    throw new ProductApiError("invalid_request", "Invalid JSON request", 400);
  }
  const raw = body as Record<string, unknown>;
  const presetId = cleanText(raw.presetId, "", 80);
  const preset = getPreset(presetId);
  if (!preset) {
    throw new ProductApiError("unknown_preset", "Unknown effect preset", 400);
  }
  if (!Array.isArray(raw.assets) || raw.assets.length === 0 || raw.assets.length > 4) {
    throw new ProductApiError(
      "invalid_assets",
      "Provide one to four owned-toy reference images",
      400
    );
  }
  const roles = new Set<AssetRole>();
  const assets = raw.assets.map((candidate) => {
    if (!candidate || typeof candidate !== "object") {
      throw new ProductApiError("invalid_asset", "Invalid asset reference", 400);
    }
    const item = candidate as Record<string, unknown>;
    if (!validRole(item.role) || roles.has(item.role)) {
      throw new ProductApiError(
        "invalid_asset_role",
        "Asset roles must be unique: front, side, back, or packaging",
        400
      );
    }
    roles.add(item.role);
    const assetId = cleanText(item.assetId, "", 100);
    const dataUrl = typeof item.dataUrl === "string" ? item.dataUrl : "";
    if (!assetId && !dataUrl) {
      throw new ProductApiError(
        "missing_asset_source",
        `The ${item.role} asset needs an assetId or dataUrl`,
        400
      );
    }
    if (dataUrl) validateInlineImage(dataUrl);
    return {
      role: item.role,
      ...(assetId ? { assetId } : {}),
      ...(dataUrl ? { dataUrl } : {}),
    };
  });
  if (!roles.has("front")) {
    throw new ProductApiError(
      "front_asset_required",
      "A front-facing toy photo is required",
      400
    );
  }

  const requestedResolution = raw.resolution;
  const resolution: SeedanceResolution =
    requestedResolution === "480p" ? "480p" : "720p";
  return {
    presetId,
    assets,
    purpose: cleanText(raw.purpose, "social post", 120),
    ...(typeof raw.prompt === "string" && raw.prompt.trim()
      ? { prompt: raw.prompt.trim().slice(0, 2_000) }
      : {}),
    aspectRatio: normalizeAspect(raw.aspectRatio, preset.aspectRatio),
    duration: clampDuration(raw.duration, preset.duration),
    modelId: cleanText(raw.modelId, "seedance-2", 100),
    resolution,
    ...(typeof raw.projectId === "string" && raw.projectId.trim()
      ? { projectId: raw.projectId.trim().slice(0, 100) }
      : {}),
  };
}

export function requestIdempotencyKey(request: Request): string {
  const supplied = request.headers.get("idempotency-key")?.trim();
  if (!supplied) return randomUUID();
  if (supplied.length > 128 || !/^[A-Za-z0-9._:-]+$/.test(supplied)) {
    throw new ProductApiError(
      "invalid_idempotency_key",
      "Idempotency-Key must be at most 128 URL-safe characters",
      400
    );
  }
  return supplied;
}

export function newGenerationJob(options: {
  ownerId: string;
  session: UserSession;
  input: GenerationInput;
  idempotencyKey: string;
  demo: boolean;
  model: string;
  retryOfJobId?: string | null;
  attempt?: number;
}): GenerationJob {
  const now = new Date().toISOString();
  const plan = getPlan(options.session.plan);
  return {
    id: randomUUID(),
    ownerId: options.ownerId,
    projectId: options.input.projectId ?? null,
    retryOfJobId: options.retryOfJobId ?? null,
    idempotencyKey: options.idempotencyKey,
    status: "queued",
    progress: 0,
    input: options.input,
    provider: options.demo ? "demo" : "fal",
    providerRequestId: null,
    model: options.model,
    outputAssetId: null,
    outputUrl: null,
    posterUrl: null,
    demo: options.demo,
    watermark: plan.watermark,
    estimatedCredits: options.demo ? 0 : CREDITS_PER_VIDEO,
    chargedCredits: 0,
    creditStatus: options.demo ? "not_required" : "reserved",
    attempt: options.attempt ?? 1,
    maxAttempts: 3,
    error: null,
    createdAt: now,
    updatedAt: now,
    startedAt: null,
    completedAt: null,
  };
}

export async function materializePublicJob(
  store: ProductStore,
  job: GenerationJob
) {
  let outputUrl = job.outputUrl;
  if (job.outputAssetId && store.durable) {
    const asset = await store.getAsset(job.outputAssetId);
    if (asset && asset.ownerId === job.ownerId) {
      outputUrl = await store.createSignedDownload(asset, 3600);
    }
  }
  return publicGenerationJob({ ...job, outputUrl });
}

export async function assertOwnedProject(
  store: ProductStore,
  ownerId: string,
  projectId: string | undefined
) {
  if (!projectId) return;
  const project = await store.getProject(projectId);
  if (!project || project.ownerId !== ownerId) {
    throw new ProductApiError("project_not_found", "Project not found", 404);
  }
}

export async function resolveFrontAssetUrl(
  store: ProductStore,
  ownerId: string,
  input: GenerationInput
): Promise<{ dataUrl?: string; signedUrl?: string }> {
  const front = input.assets.find((asset) => asset.role === "front");
  if (!front) throw new ProductApiError("front_asset_required", "Front photo required", 400);
  if (front.dataUrl) return { dataUrl: front.dataUrl };
  const asset = front.assetId ? await store.getAsset(front.assetId) : null;
  if (!asset || asset.ownerId !== ownerId || asset.role !== "front") {
    throw new ProductApiError("asset_not_found", "Front asset not found", 404);
  }
  return { signedUrl: await store.createSignedDownload(asset, 3600) };
}
