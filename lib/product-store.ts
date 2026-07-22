import { randomUUID } from "crypto";
import { ProductPersistenceUnavailableError } from "@/lib/product-errors";
import { createSupabaseProductStore, supabaseProductConfigured } from "@/lib/product-supabase";
import type {
  GenerationJob,
  ProductAsset,
  ProductPersistenceMode,
  ProductProject,
  SignedUpload,
} from "@/lib/product-types";

export type CreditReservation =
  | { ok: true; balance: number }
  | { ok: false; balance: number; need: number };

export interface ProductStore {
  readonly mode: ProductPersistenceMode;
  readonly durable: boolean;
  createAsset(asset: ProductAsset): Promise<ProductAsset>;
  getAsset(id: string): Promise<ProductAsset | null>;
  createSignedUpload(asset: ProductAsset): Promise<SignedUpload>;
  createSignedDownload(asset: ProductAsset, expiresIn?: number): Promise<string>;
  persistRemoteOutput(
    ownerId: string,
    jobId: string,
    remoteUrl: string,
    contentType?: string
  ): Promise<ProductAsset>;
  persistOutputBytes(
    ownerId: string,
    jobId: string,
    bytes: Uint8Array,
    kind: "output_source" | "output_watermarked" | "poster",
    contentType: string
  ): Promise<ProductAsset>;
  createProject(project: ProductProject): Promise<ProductProject>;
  listProjects(ownerId: string): Promise<ProductProject[]>;
  getProject(id: string): Promise<ProductProject | null>;
  createGeneration(job: GenerationJob): Promise<GenerationJob>;
  updateGeneration(
    id: string,
    patch: Partial<GenerationJob>
  ): Promise<GenerationJob>;
  getGeneration(id: string): Promise<GenerationJob | null>;
  listGenerations(ownerId: string, projectId?: string): Promise<GenerationJob[]>;
  findGenerationByIdempotency(
    ownerId: string,
    idempotencyKey: string
  ): Promise<GenerationJob | null>;
  findGenerationByProviderRequest(
    providerRequestId: string
  ): Promise<GenerationJob | null>;
  recordWebhookEvent(eventId: string, requestId: string): Promise<boolean>;
  getCreditBalance(ownerId: string): Promise<number | null>;
  reserveCredits(
    ownerId: string,
    jobId: string,
    amount: number,
    initialBalance: number
  ): Promise<CreditReservation>;
  settleCredits(
    ownerId: string,
    jobId: string,
    outcome: "charged" | "refunded"
  ): Promise<void>;
}

class EphemeralProductStore implements ProductStore {
  readonly mode = "ephemeral" as const;
  readonly durable = false;
  private readonly assets = new Map<string, ProductAsset>();
  private readonly projects = new Map<string, ProductProject>();
  private readonly jobs = new Map<string, GenerationJob>();
  private readonly webhookEvents = new Set<string>();

  async createAsset(asset: ProductAsset) {
    this.assets.set(asset.id, structuredClone(asset));
    return asset;
  }

  async getAsset(id: string) {
    return this.assets.get(id) ?? null;
  }

  async createSignedUpload(): Promise<SignedUpload> {
    throw new ProductPersistenceUnavailableError();
  }

  async createSignedDownload(): Promise<string> {
    throw new ProductPersistenceUnavailableError();
  }

  async persistRemoteOutput(): Promise<ProductAsset> {
    throw new ProductPersistenceUnavailableError();
  }

  async persistOutputBytes(): Promise<ProductAsset> {
    throw new ProductPersistenceUnavailableError();
  }

  async createProject(project: ProductProject) {
    this.projects.set(project.id, structuredClone(project));
    return project;
  }

  async listProjects(ownerId: string) {
    return [...this.projects.values()]
      .filter((project) => project.ownerId === ownerId)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }

  async getProject(id: string) {
    return this.projects.get(id) ?? null;
  }

  async createGeneration(job: GenerationJob) {
    const existing = await this.findGenerationByIdempotency(
      job.ownerId,
      job.idempotencyKey
    );
    if (existing) return existing;
    this.jobs.set(job.id, structuredClone(job));
    return job;
  }

  async updateGeneration(id: string, patch: Partial<GenerationJob>) {
    const current = this.jobs.get(id);
    if (!current) throw new Error(`Generation ${id} not found`);
    const next = { ...current, ...structuredClone(patch), id };
    this.jobs.set(id, next);
    return next;
  }

  async getGeneration(id: string) {
    return this.jobs.get(id) ?? null;
  }

  async listGenerations(ownerId: string, projectId?: string) {
    return [...this.jobs.values()]
      .filter(
        (job) =>
          job.ownerId === ownerId && (!projectId || job.projectId === projectId)
      )
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
      .slice(0, 50);
  }

  async findGenerationByIdempotency(ownerId: string, idempotencyKey: string) {
    return (
      [...this.jobs.values()].find(
        (job) =>
          job.ownerId === ownerId && job.idempotencyKey === idempotencyKey
      ) ?? null
    );
  }

  async findGenerationByProviderRequest(providerRequestId: string) {
    return (
      [...this.jobs.values()].find(
        (job) => job.providerRequestId === providerRequestId
      ) ?? null
    );
  }

  async recordWebhookEvent(eventId: string) {
    if (this.webhookEvents.has(eventId)) return false;
    this.webhookEvents.add(eventId);
    return true;
  }

  async getCreditBalance(): Promise<number | null> {
    return null;
  }

  async reserveCredits(): Promise<CreditReservation> {
    throw new ProductPersistenceUnavailableError();
  }

  async settleCredits() {
    throw new ProductPersistenceUnavailableError();
  }
}

const globalProductStore = globalThis as typeof globalThis & {
  __pikboProductStore?: EphemeralProductStore;
};

function ephemeralStore(): EphemeralProductStore {
  globalProductStore.__pikboProductStore ??= new EphemeralProductStore();
  return globalProductStore.__pikboProductStore;
}

/** Explicit validation-only store; callers must return persisted:false. */
export function getEphemeralValidationStore(): ProductStore {
  return ephemeralStore();
}

export function productPersistenceMode(): ProductPersistenceMode | "unavailable" {
  if (supabaseProductConfigured()) return "supabase";
  if (
    process.env.NODE_ENV !== "production" ||
    process.env.PIKBO_ALLOW_EPHEMERAL_PRODUCT_STORE === "1"
  ) {
    return "ephemeral";
  }
  return "unavailable";
}

/**
 * Ephemeral mode is deliberately limited to development/private validation.
 * Production refuses to label process memory as cloud persistence.
 */
export function getProductStore(): ProductStore {
  if (supabaseProductConfigured()) return createSupabaseProductStore();
  if (productPersistenceMode() === "ephemeral") return ephemeralStore();
  throw new ProductPersistenceUnavailableError();
}

export function newProductId(): string {
  return randomUUID();
}
