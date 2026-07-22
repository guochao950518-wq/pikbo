import { ProductApiError } from "@/lib/product-errors";
import type { CreditReservation, ProductStore } from "@/lib/product-store";
import type {
  GenerationJob,
  ProductAsset,
  ProductProject,
  SignedUpload,
} from "@/lib/product-types";

type JsonRecord = Record<string, unknown>;

const DEFAULT_BUCKET = "pikbo-assets";

function config() {
  return {
    url: process.env.SUPABASE_URL?.replace(/\/$/, "") ?? "",
    key: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
    bucket: process.env.SUPABASE_ASSETS_BUCKET || DEFAULT_BUCKET,
  };
}

export function supabaseProductConfigured(): boolean {
  const { url, key } = config();
  return Boolean(url && key);
}

async function supabaseFetch<T>(
  path: string,
  init: RequestInit = {},
  options?: { allowConflict?: boolean }
): Promise<T> {
  const { url, key } = config();
  const response = await fetch(`${url}${path}`, {
    ...init,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      ...init.headers,
    },
    cache: "no-store",
  });
  if (options?.allowConflict && response.status === 409) {
    return null as T;
  }
  if (!response.ok) {
    const body = await response.text();
    const insufficient = body.includes("insufficient_credits");
    throw new ProductApiError(
      insufficient ? "insufficient_credits" : "supabase_request_failed",
      insufficient ? "Not enough credits" : "Persistent product store request failed",
      insufficient ? 402 : 502,
      { upstreamStatus: response.status }
    );
  }
  if (response.status === 204) return undefined as T;
  const text = await response.text();
  return (text ? JSON.parse(text) : null) as T;
}

function assetToRow(asset: ProductAsset): JsonRecord {
  return {
    id: asset.id,
    owner_id: asset.ownerId,
    project_id: asset.projectId,
    role: asset.role,
    file_name: asset.fileName,
    content_type: asset.contentType,
    byte_size: asset.byteSize,
    storage_bucket: asset.storageBucket,
    storage_path: asset.storagePath,
    status: asset.status,
    created_at: asset.createdAt,
    updated_at: asset.updatedAt,
  };
}

function rowToAsset(row: JsonRecord): ProductAsset {
  return {
    id: String(row.id),
    ownerId: String(row.owner_id),
    projectId: row.project_id ? String(row.project_id) : null,
    role: row.role as ProductAsset["role"],
    fileName: String(row.file_name),
    contentType: String(row.content_type),
    byteSize: typeof row.byte_size === "number" ? row.byte_size : null,
    storageBucket: String(row.storage_bucket),
    storagePath: String(row.storage_path),
    status: row.status as ProductAsset["status"],
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };
}

function projectToRow(project: ProductProject): JsonRecord {
  return {
    id: project.id,
    owner_id: project.ownerId,
    name: project.name,
    created_at: project.createdAt,
    updated_at: project.updatedAt,
  };
}

function rowToProject(row: JsonRecord): ProductProject {
  return {
    id: String(row.id),
    ownerId: String(row.owner_id),
    name: String(row.name),
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };
}

function generationToRow(job: GenerationJob): JsonRecord {
  return {
    id: job.id,
    owner_id: job.ownerId,
    project_id: job.projectId,
    retry_of_job_id: job.retryOfJobId,
    idempotency_key: job.idempotencyKey,
    status: job.status,
    progress: job.progress,
    input: job.input,
    provider: job.provider,
    provider_request_id: job.providerRequestId,
    model: job.model,
    output_asset_id: job.outputAssetId,
    output_url: job.outputUrl,
    poster_url: job.posterUrl,
    demo: job.demo,
    watermark: job.watermark,
    estimated_credits: job.estimatedCredits,
    charged_credits: job.chargedCredits,
    credit_status: job.creditStatus,
    attempt: job.attempt,
    max_attempts: job.maxAttempts,
    error: job.error,
    created_at: job.createdAt,
    updated_at: job.updatedAt,
    started_at: job.startedAt,
    completed_at: job.completedAt,
  };
}

function rowToGeneration(row: JsonRecord): GenerationJob {
  return {
    id: String(row.id),
    ownerId: String(row.owner_id),
    projectId: row.project_id ? String(row.project_id) : null,
    retryOfJobId: row.retry_of_job_id ? String(row.retry_of_job_id) : null,
    idempotencyKey: String(row.idempotency_key),
    status: row.status as GenerationJob["status"],
    progress: Number(row.progress),
    input: row.input as GenerationJob["input"],
    provider: row.provider as GenerationJob["provider"],
    providerRequestId: row.provider_request_id
      ? String(row.provider_request_id)
      : null,
    model: String(row.model),
    outputAssetId: row.output_asset_id ? String(row.output_asset_id) : null,
    outputUrl: row.output_url ? String(row.output_url) : null,
    posterUrl: row.poster_url ? String(row.poster_url) : null,
    demo: Boolean(row.demo),
    watermark: Boolean(row.watermark),
    estimatedCredits: Number(row.estimated_credits),
    chargedCredits: Number(row.charged_credits),
    creditStatus: row.credit_status as GenerationJob["creditStatus"],
    attempt: Number(row.attempt),
    maxAttempts: Number(row.max_attempts),
    error: row.error ? String(row.error) : null,
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
    startedAt: row.started_at ? String(row.started_at) : null,
    completedAt: row.completed_at ? String(row.completed_at) : null,
  };
}

function encodePath(path: string): string {
  return path.split("/").map(encodeURIComponent).join("/");
}

class SupabaseProductStore implements ProductStore {
  readonly mode = "supabase" as const;
  readonly durable = true;

  async createAsset(asset: ProductAsset) {
    const rows = await supabaseFetch<JsonRecord[]>("/rest/v1/pikbo_assets", {
      method: "POST",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify(assetToRow(asset)),
    });
    return rowToAsset(rows[0]);
  }

  async getAsset(id: string) {
    const rows = await supabaseFetch<JsonRecord[]>(
      `/rest/v1/pikbo_assets?id=eq.${encodeURIComponent(id)}&limit=1`
    );
    return rows[0] ? rowToAsset(rows[0]) : null;
  }

  async createSignedUpload(asset: ProductAsset): Promise<SignedUpload> {
    const { url, bucket } = config();
    const payload = await supabaseFetch<{ url?: string; token?: string }>(
      `/storage/v1/object/upload/sign/${encodeURIComponent(bucket)}/${encodePath(asset.storagePath)}`,
      { method: "POST", body: JSON.stringify({ upsert: false }) }
    );
    if (!payload?.url || !payload.token) {
      throw new ProductApiError(
        "storage_sign_failed",
        "Storage did not return a signed upload URL",
        502
      );
    }
    return {
      url: payload.url.startsWith("http") ? payload.url : `${url}${payload.url}`,
      token: payload.token,
      path: asset.storagePath,
      expiresIn: 7200,
    };
  }

  async createSignedDownload(asset: ProductAsset, expiresIn = 3600) {
    const { url } = config();
    const payload = await supabaseFetch<{
      signedURL?: string;
      signedUrl?: string;
    }>(
      `/storage/v1/object/sign/${encodeURIComponent(asset.storageBucket)}/${encodePath(asset.storagePath)}`,
      { method: "POST", body: JSON.stringify({ expiresIn }) }
    );
    const signed = payload.signedURL || payload.signedUrl;
    if (!signed) {
      throw new ProductApiError(
        "storage_sign_failed",
        "Storage did not return a signed download URL",
        502
      );
    }
    return signed.startsWith("http") ? signed : `${url}${signed}`;
  }

  async persistRemoteOutput(
    ownerId: string,
    jobId: string,
    remoteUrl: string,
    contentType?: string
  ) {
    const remote = await fetch(remoteUrl, { cache: "no-store" });
    if (!remote.ok || !remote.body) {
      throw new ProductApiError(
        "provider_output_download_failed",
        "Could not copy the provider output to private storage",
        502,
        { upstreamStatus: remote.status }
      );
    }
    const declaredBytes = Number(remote.headers.get("content-length") || 0);
    if (declaredBytes > 150 * 1024 * 1024) {
      throw new ProductApiError(
        "provider_output_too_large",
        "Provider output exceeds the 150 MB storage limit",
        502
      );
    }
    const mime = contentType || remote.headers.get("content-type") || "video/mp4";
    const bytes = new Uint8Array(await remote.arrayBuffer());
    return this.persistOutputBytes(
      ownerId,
      jobId,
      bytes,
      "output_source",
      mime
    );
  }

  async persistOutputBytes(
    ownerId: string,
    jobId: string,
    bytes: Uint8Array,
    kind: "output_source" | "output_watermarked" | "poster",
    contentType: string
  ) {
    if (bytes.byteLength > 150 * 1024 * 1024) {
      throw new ProductApiError(
        "output_storage_too_large",
        "Output exceeds the 150 MB storage limit",
        502
      );
    }
    const extension = contentType.includes("webm")
      ? "webm"
      : contentType.includes("image")
        ? "webp"
        : "mp4";
    const { url, key, bucket } = config();
    const storagePath = `${ownerId}/outputs/${jobId}/${kind}.${extension}`;
    const upload = await fetch(
      `${url}/storage/v1/object/${encodeURIComponent(bucket)}/${encodePath(storagePath)}`,
      {
        method: "POST",
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
          "Content-Type": contentType,
          "x-upsert": "false",
        },
        body: Buffer.from(bytes),
      }
    );
    if (!upload.ok && upload.status !== 409) {
      throw new ProductApiError(
        "output_storage_failed",
        "Could not save the output to private storage",
        502,
        { upstreamStatus: upload.status }
      );
    }
    const now = new Date().toISOString();
    const asset: ProductAsset = {
      id: crypto.randomUUID(),
      ownerId,
      projectId: null,
      role: kind,
      fileName: `pikbo-${jobId}-${kind}.${extension}`,
      contentType,
      byteSize: bytes.byteLength,
      storageBucket: bucket,
      storagePath,
      status: "ready",
      createdAt: now,
      updatedAt: now,
    };
    return this.createAsset(asset);
  }

  async createProject(project: ProductProject) {
    const rows = await supabaseFetch<JsonRecord[]>("/rest/v1/pikbo_projects", {
      method: "POST",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify(projectToRow(project)),
    });
    return rowToProject(rows[0]);
  }

  async listProjects(ownerId: string) {
    const rows = await supabaseFetch<JsonRecord[]>(
      `/rest/v1/pikbo_projects?owner_id=eq.${encodeURIComponent(ownerId)}&order=updated_at.desc`
    );
    return rows.map(rowToProject);
  }

  async getProject(id: string) {
    const rows = await supabaseFetch<JsonRecord[]>(
      `/rest/v1/pikbo_projects?id=eq.${encodeURIComponent(id)}&limit=1`
    );
    return rows[0] ? rowToProject(rows[0]) : null;
  }

  async createGeneration(job: GenerationJob) {
    const rows = await supabaseFetch<JsonRecord[]>(
      "/rest/v1/pikbo_generation_jobs",
      {
        method: "POST",
        headers: { Prefer: "return=representation" },
        body: JSON.stringify(generationToRow(job)),
      },
      { allowConflict: true }
    );
    if (rows?.[0]) return rowToGeneration(rows[0]);
    const existing = await this.findGenerationByIdempotency(
      job.ownerId,
      job.idempotencyKey
    );
    if (!existing) throw new Error("Generation idempotency conflict without row");
    return existing;
  }

  async updateGeneration(id: string, patch: Partial<GenerationJob>) {
    const complete = { ...patch } as GenerationJob;
    const row = generationToRow(complete);
    const allowed = Object.fromEntries(
      Object.entries(row).filter(([, value]) => value !== undefined)
    );
    delete allowed.id;
    delete allowed.owner_id;
    delete allowed.created_at;
    const rows = await supabaseFetch<JsonRecord[]>(
      `/rest/v1/pikbo_generation_jobs?id=eq.${encodeURIComponent(id)}`,
      {
        method: "PATCH",
        headers: { Prefer: "return=representation" },
        body: JSON.stringify(allowed),
      }
    );
    if (!rows[0]) throw new Error(`Generation ${id} not found`);
    return rowToGeneration(rows[0]);
  }

  async getGeneration(id: string) {
    const rows = await supabaseFetch<JsonRecord[]>(
      `/rest/v1/pikbo_generation_jobs?id=eq.${encodeURIComponent(id)}&limit=1`
    );
    return rows[0] ? rowToGeneration(rows[0]) : null;
  }

  async listGenerations(ownerId: string, projectId?: string) {
    const projectFilter = projectId
      ? `&project_id=eq.${encodeURIComponent(projectId)}`
      : "";
    const rows = await supabaseFetch<JsonRecord[]>(
      `/rest/v1/pikbo_generation_jobs?owner_id=eq.${encodeURIComponent(ownerId)}${projectFilter}&order=updated_at.desc&limit=50`
    );
    return rows.map(rowToGeneration);
  }

  async findGenerationByIdempotency(ownerId: string, idempotencyKey: string) {
    const rows = await supabaseFetch<JsonRecord[]>(
      `/rest/v1/pikbo_generation_jobs?owner_id=eq.${encodeURIComponent(ownerId)}&idempotency_key=eq.${encodeURIComponent(idempotencyKey)}&limit=1`
    );
    return rows[0] ? rowToGeneration(rows[0]) : null;
  }

  async findGenerationByProviderRequest(providerRequestId: string) {
    const rows = await supabaseFetch<JsonRecord[]>(
      `/rest/v1/pikbo_generation_jobs?provider_request_id=eq.${encodeURIComponent(providerRequestId)}&limit=1`
    );
    return rows[0] ? rowToGeneration(rows[0]) : null;
  }

  async recordWebhookEvent(eventId: string, requestId: string) {
    const claimed = await supabaseFetch<boolean>(
      "/rest/v1/rpc/pikbo_claim_webhook_event",
      {
        method: "POST",
        body: JSON.stringify({
          p_event_id: eventId,
          p_provider: "fal",
          p_request_id: requestId,
        }),
      }
    );
    return claimed === true;
  }

  async getCreditBalance(ownerId: string) {
    const rows = await supabaseFetch<Array<{ balance?: number }>>(
      `/rest/v1/pikbo_credit_accounts?owner_id=eq.${encodeURIComponent(ownerId)}&select=balance&limit=1`
    );
    return typeof rows[0]?.balance === "number" ? rows[0].balance : null;
  }

  async reserveCredits(
    ownerId: string,
    jobId: string,
    amount: number,
    initialBalance: number
  ): Promise<CreditReservation> {
    try {
      const data = await supabaseFetch<Array<{ balance: number }>>(
        "/rest/v1/rpc/pikbo_reserve_generation_credits",
        {
          method: "POST",
          body: JSON.stringify({
            p_owner_id: ownerId,
            p_job_id: jobId,
            p_amount: amount,
            p_initial_balance: initialBalance,
          }),
        }
      );
      return { ok: true, balance: Number(data[0]?.balance ?? 0) };
    } catch (error) {
      if (error instanceof ProductApiError && error.code === "insufficient_credits") {
        return { ok: false, balance: 0, need: amount };
      }
      throw error;
    }
  }

  async settleCredits(
    ownerId: string,
    jobId: string,
    outcome: "charged" | "refunded"
  ) {
    await supabaseFetch("/rest/v1/rpc/pikbo_settle_generation_credits", {
      method: "POST",
      body: JSON.stringify({
        p_owner_id: ownerId,
        p_job_id: jobId,
        p_outcome: outcome,
      }),
    });
  }
}

let singleton: SupabaseProductStore | null = null;

export function createSupabaseProductStore(): ProductStore {
  singleton ??= new SupabaseProductStore();
  return singleton;
}
