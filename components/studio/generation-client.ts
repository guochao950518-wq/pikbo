export type AssetRole = "front" | "side" | "back" | "packaging";

export type GenerationAsset = {
  role: AssetRole;
  dataUrl?: string;
  assetId?: string;
};

export type GenerationJobStatus =
  | "queued"
  | "running"
  | "succeeded"
  | "failed"
  | "canceled";

export type GenerationJob = {
  id: string;
  status: GenerationJobStatus;
  progress: number;
  outputUrl?: string;
  posterUrl?: string;
  demo: boolean;
  watermark: boolean;
  model?: string;
  error?: string;
  chargedCredits?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type GenerationRequest = {
  presetId: string;
  assets: GenerationAsset[];
  purpose: string;
  prompt?: string;
  aspectRatio: "9:16" | "1:1" | "16:9";
  duration: 5 | 10;
  modelId: "seedance-2" | "seedance-fast";
  resolution: "480p" | "720p";
  projectId?: string;
};

export type GenerationResponse = {
  job: GenerationJob;
  session?: unknown;
  validationMode: boolean;
  chargedCredits?: number;
};

export class GenerationApiError extends Error {
  status: number;
  code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "GenerationApiError";
    this.status = status;
    this.code = code;
  }
}

function normalizeStatus(value: unknown): GenerationJobStatus {
  if (value === "running" || value === "processing") return "running";
  if (value === "succeeded" || value === "completed" || value === "done") {
    return "succeeded";
  }
  if (value === "failed" || value === "error") return "failed";
  if (value === "canceled" || value === "cancelled") return "canceled";
  return "queued";
}

function normalizeResponse(payload: unknown): GenerationResponse {
  const root = (payload ?? {}) as Record<string, unknown>;
  const raw = ((root.job as Record<string, unknown> | undefined) ?? root) as Record<
    string,
    unknown
  >;
  const id = String(raw.id ?? root.jobId ?? "");
  if (!id) {
    throw new GenerationApiError("Generation service returned no job id.", 502);
  }

  const validationMode = Boolean(root.validationMode ?? raw.validationMode);
  const outputUrl = raw.outputUrl ?? raw.videoUrl ?? root.outputUrl ?? root.videoUrl;
  const progressValue = Number(raw.progress ?? 0);

  return {
    job: {
      id,
      status: normalizeStatus(raw.status),
      progress: Number.isFinite(progressValue)
        ? Math.min(100, Math.max(0, progressValue))
        : 0,
      outputUrl: typeof outputUrl === "string" ? outputUrl : undefined,
      posterUrl:
        typeof raw.posterUrl === "string" ? raw.posterUrl : undefined,
      demo: Boolean(raw.demo ?? root.demo ?? validationMode),
      watermark: Boolean(raw.watermark ?? root.watermark),
      model:
        typeof raw.model === "string"
          ? raw.model
          : typeof root.model === "string"
            ? root.model
            : undefined,
      error:
        typeof raw.error === "string"
          ? raw.error
          : typeof root.error === "string"
            ? root.error
            : undefined,
      chargedCredits:
        typeof raw.chargedCredits === "number"
          ? raw.chargedCredits
          : typeof root.chargedCredits === "number"
            ? root.chargedCredits
            : undefined,
      createdAt:
        typeof raw.createdAt === "string" ? raw.createdAt : undefined,
      updatedAt:
        typeof raw.updatedAt === "string" ? raw.updatedAt : undefined,
    },
    session: root.session,
    validationMode,
    chargedCredits:
      typeof root.chargedCredits === "number"
        ? root.chargedCredits
        : typeof raw.chargedCredits === "number"
          ? raw.chargedCredits
          : undefined,
  };
}

async function requestJson(url: string, init?: RequestInit) {
  const response = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
    cache: "no-store",
  });
  const payload = (await response.json().catch(() => ({}))) as Record<
    string,
    unknown
  >;
  if (!response.ok) {
    const message =
      typeof payload.error === "string"
        ? payload.error
        : typeof payload.message === "string"
          ? payload.message
          : "Generation request failed.";
    throw new GenerationApiError(
      message,
      response.status,
      typeof payload.code === "string" ? payload.code : undefined
    );
  }
  return normalizeResponse(payload);
}

export function createGeneration(input: GenerationRequest) {
  return requestJson("/api/generations", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function getGeneration(id: string, signal?: AbortSignal) {
  return requestJson(`/api/generations/${encodeURIComponent(id)}`, { signal });
}

export function retryGeneration(id: string) {
  return requestJson(`/api/generations/${encodeURIComponent(id)}/retry`, {
    method: "POST",
    body: JSON.stringify({}),
  });
}

type UploadableAsset = {
  role: AssetRole;
  dataUrl: string;
  fileName: string;
};

export async function uploadGenerationAssets(assets: UploadableAsset[]) {
  return Promise.all(
    assets.map(async (asset): Promise<GenerationAsset> => {
      const blob = await (await fetch(asset.dataUrl)).blob();
      const signedResponse = await fetch("/api/assets/upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: asset.role,
          fileName: asset.fileName,
          contentType: blob.type || "image/png",
          byteSize: blob.size,
        }),
      });
      const signed = (await signedResponse.json().catch(() => ({}))) as {
        asset?: { id?: string };
        upload?: { url?: string; token?: string };
        error?: string;
        message?: string;
        code?: string;
      };
      if (!signedResponse.ok || !signed.asset?.id || !signed.upload?.url) {
        throw new GenerationApiError(
          signed.error || signed.message || "Could not prepare a private asset upload.",
          signedResponse.status,
          signed.code
        );
      }
      const uploadUrl = new URL(signed.upload.url, window.location.origin);
      if (signed.upload.token && !uploadUrl.searchParams.has("token")) {
        uploadUrl.searchParams.set("token", signed.upload.token);
      }
      const uploadResponse = await fetch(uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": blob.type || "image/png",
          "x-upsert": "false",
        },
        body: blob,
      });
      if (!uploadResponse.ok) {
        throw new GenerationApiError(
          "The private asset upload failed. Your generation was not submitted.",
          uploadResponse.status,
          "ASSET_UPLOAD_FAILED"
        );
      }
      return { role: asset.role, assetId: signed.asset.id };
    })
  );
}

export async function waitForGeneration(
  initial: GenerationResponse,
  options: {
    signal?: AbortSignal;
    onUpdate?: (response: GenerationResponse) => void;
    intervalMs?: number;
    timeoutMs?: number;
  } = {}
) {
  let current = initial;
  const startedAt = Date.now();
  const intervalMs = options.intervalMs ?? 1800;
  const timeoutMs = options.timeoutMs ?? 8 * 60 * 1000;
  options.onUpdate?.(current);

  while (current.job.status === "queued" || current.job.status === "running") {
    if (options.signal?.aborted) throw new DOMException("Aborted", "AbortError");
    if (Date.now() - startedAt > timeoutMs) {
      throw new GenerationApiError(
        "The task is still running. It is safe to leave and check Library later.",
        408,
        "POLL_TIMEOUT"
      );
    }
    await new Promise<void>((resolve, reject) => {
      const timer = window.setTimeout(resolve, intervalMs);
      options.signal?.addEventListener(
        "abort",
        () => {
          window.clearTimeout(timer);
          reject(new DOMException("Aborted", "AbortError"));
        },
        { once: true }
      );
    });
    current = await getGeneration(current.job.id, options.signal);
    options.onUpdate?.(current);
  }

  return current;
}
