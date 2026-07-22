import { ProductApiError, productErrorResponse } from "@/lib/product-errors";
import {
  materializePublicJob,
  newGenerationJob,
  requestIdempotencyKey,
} from "@/lib/product-api";
import { completeDemoJob, queueLiveJob } from "@/lib/product-generation";
import { falModelForInput } from "@/lib/product-fal";
import {
  getEphemeralValidationStore,
  getProductStore,
  productPersistenceMode,
} from "@/lib/product-store";
import { ensureSession, publicSession } from "@/lib/session";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const session = await ensureSession();
    const validationMode = !process.env.FAL_KEY;
    const store =
      validationMode && productPersistenceMode() === "unavailable"
        ? getEphemeralValidationStore()
        : getProductStore();
    const current = await store.getGeneration(id);
    if (!current || current.ownerId !== session.id) {
      throw new ProductApiError("generation_not_found", "Generation not found", 404);
    }
    if (current.status === "queued" || current.status === "running") {
      return Response.json({
        job: await materializePublicJob(store, current),
        session: publicSession(session),
        validationMode,
        persistence: store.mode,
        persisted: store.durable,
        idempotentReplay: true,
      });
    }
    if (current.status === "succeeded") {
      throw new ProductApiError(
        "generation_already_succeeded",
        "Successful generations do not need retrying",
        409
      );
    }
    if (current.attempt >= current.maxAttempts) {
      throw new ProductApiError(
        "retry_limit_reached",
        "This generation reached its retry limit",
        409
      );
    }

    const retryKey = request.headers.get("idempotency-key")
      ? requestIdempotencyKey(request)
      : `retry:${current.id}:${current.attempt + 1}`;
    const existingRetry = await store.findGenerationByIdempotency(
      session.id,
      retryKey
    );
    if (existingRetry) {
      return Response.json({
        job: await materializePublicJob(store, existingRetry),
        session: publicSession(session),
        validationMode,
        persistence: store.mode,
        persisted: store.durable,
        idempotentReplay: true,
      });
    }

    let retry = await store.createGeneration(
      newGenerationJob({
        ownerId: session.id,
        session,
        input: current.input,
        idempotencyKey: retryKey,
        demo: validationMode,
        model: validationMode
          ? "demo-no-provider-call"
          : falModelForInput(current.input, session.plan === "free"),
        retryOfJobId: current.id,
        attempt: current.attempt + 1,
      })
    );

    if (validationMode) {
      retry = await completeDemoJob(store, retry);
      return Response.json({
        job: await materializePublicJob(store, retry),
        session: publicSession(session),
        validationMode: true,
        chargedCredits: 0,
        persistence: store.mode,
        persisted: store.durable,
        message:
          "Cached Pikbo Lab validation preview — no model request and no credit charge.",
      });
    }

    const queued = await queueLiveJob({ store, job: retry, session });
    return Response.json(
      {
        job: await materializePublicJob(store, queued.job),
        session: queued.session,
        validationMode: false,
        persistence: store.mode,
        persisted: true,
      },
      { status: 202 }
    );
  } catch (error) {
    return productErrorResponse(error);
  }
}
