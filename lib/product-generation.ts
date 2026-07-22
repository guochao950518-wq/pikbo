import { DEMO_VIDEOS } from "@/lib/demoVideos";
import { ProductApiError } from "@/lib/product-errors";
import { resolveFrontAssetUrl } from "@/lib/product-api";
import { submitFalGeneration } from "@/lib/product-fal";
import type { ProductStore } from "@/lib/product-store";
import type { GenerationJob } from "@/lib/product-types";
import { publicSession, saveSession, type UserSession } from "@/lib/session";

function generationTimeoutMs(): number {
  const configured = Number(process.env.GENERATION_TIMEOUT_MS || 20 * 60 * 1_000);
  if (!Number.isFinite(configured)) return 20 * 60 * 1_000;
  return Math.min(2 * 60 * 60 * 1_000, Math.max(5 * 60 * 1_000, configured));
}

export async function expireGenerationIfStale(
  store: ProductStore,
  job: GenerationJob
): Promise<GenerationJob> {
  if (job.status !== "queued" && job.status !== "running") return job;
  const createdAt = Date.parse(job.createdAt);
  if (!Number.isFinite(createdAt) || Date.now() - createdAt < generationTimeoutMs()) {
    return job;
  }
  const current = await store.getGeneration(job.id);
  if (!current || (current.status !== "queued" && current.status !== "running")) {
    return current ?? job;
  }
  if (current.creditStatus === "reserved") {
    await store.settleCredits(current.ownerId, current.id, "refunded");
  }
  const now = new Date().toISOString();
  return store.updateGeneration(current.id, {
    status: "failed",
    progress: 0,
    chargedCredits: 0,
    creditStatus:
      current.creditStatus === "reserved" ? "refunded" : current.creditStatus,
    error: "generation_timeout",
    completedAt: now,
    updatedAt: now,
  });
}

export async function completeDemoJob(
  store: ProductStore,
  job: GenerationJob
): Promise<GenerationJob> {
  const demo =
    DEMO_VIDEOS.find((item) => item.preset === job.input.presetId) ??
    DEMO_VIDEOS[0];
  const now = new Date().toISOString();
  return store.updateGeneration(job.id, {
    status: "succeeded",
    progress: 100,
    provider: "demo",
    providerRequestId: null,
    model: "demo-no-provider-call",
    outputUrl: demo.mp4,
    posterUrl: demo.poster,
    demo: true,
    watermark: true,
    estimatedCredits: 0,
    chargedCredits: 0,
    creditStatus: "not_required",
    error: null,
    startedAt: now,
    completedAt: now,
    updatedAt: now,
  });
}

export async function queueLiveJob(options: {
  store: ProductStore;
  job: GenerationJob;
  session: UserSession;
}): Promise<{ job: GenerationJob; session: ReturnType<typeof publicSession> }> {
  const { store, job, session } = options;
  if (!store.durable) {
    throw new ProductApiError(
      "persistent_generation_store_required",
      "Live generation requires Supabase so jobs and refunds survive restarts",
      503
    );
  }
  const reservation = await store.reserveCredits(
    session.id,
    job.id,
    job.estimatedCredits,
    session.credits
  );
  if (!reservation.ok) {
    const failed = await store.updateGeneration(job.id, {
      status: "failed",
      progress: 0,
      creditStatus: "not_required",
      error: "insufficient_credits",
      completedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    throw new ProductApiError(
      "insufficient_credits",
      "Not enough credits",
      402,
      { need: reservation.need, have: reservation.balance, job: failed }
    );
  }

  const reservedSession = { ...session, credits: reservation.balance };
  await saveSession(reservedSession);
  try {
    const source = await resolveFrontAssetUrl(store, session.id, job.input);
    const providerRequestId = await submitFalGeneration({
      input: job.input,
      model: job.model,
      freeTier: session.plan === "free",
      source,
    });
    const queued = await store.updateGeneration(job.id, {
      status: "queued",
      progress: 5,
      providerRequestId,
      creditStatus: "reserved",
      error: null,
      updatedAt: new Date().toISOString(),
    });
    return { job: queued, session: publicSession(reservedSession) };
  } catch (error) {
    await store.settleCredits(session.id, job.id, "refunded");
    await saveSession(session);
    const message = error instanceof Error ? error.message : "fal submission failed";
    const failed = await store.updateGeneration(job.id, {
      status: "failed",
      progress: 0,
      chargedCredits: 0,
      creditStatus: "refunded",
      error: message,
      completedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    throw new ProductApiError(
      "fal_submission_failed",
      "Generation could not be queued; reserved credits were refunded",
      502,
      { job: failed }
    );
  }
}
