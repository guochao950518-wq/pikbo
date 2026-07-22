import { ProductApiError, productErrorResponse } from "@/lib/product-errors";
import {
  assertOwnedProject,
  materializePublicJob,
  newGenerationJob,
  parseGenerationInput,
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

export async function GET(request: Request) {
  try {
    const session = await ensureSession();
    const validationMode = !process.env.FAL_KEY;
    const store =
      validationMode && productPersistenceMode() === "unavailable"
        ? getEphemeralValidationStore()
        : getProductStore();
    const projectId = new URL(request.url).searchParams.get("projectId") || undefined;
    if (projectId) await assertOwnedProject(store, session.id, projectId);
    const jobs = await store.listGenerations(session.id, projectId);
    return Response.json({
      jobs: await Promise.all(jobs.map((job) => materializePublicJob(store, job))),
      validationMode,
      persistence: store.mode,
      persisted: store.durable,
    });
  } catch (error) {
    return productErrorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    let raw: unknown;
    try {
      raw = await request.json();
    } catch {
      throw new ProductApiError("invalid_request", "Invalid JSON request", 400);
    }
    const input = parseGenerationInput(raw);
    const idempotencyKey = requestIdempotencyKey(request);
    const session = await ensureSession();
    const validationMode = !process.env.FAL_KEY;
    if (
      !validationMode &&
      input.assets.some((asset) => asset.dataUrl || !asset.assetId)
    ) {
      throw new ProductApiError(
        "live_assets_must_be_uploaded",
        "Live generation requires private uploaded asset IDs; request signed URLs from /api/assets/upload-url first.",
        409
      );
    }
    const unavailableValidation =
      validationMode && productPersistenceMode() === "unavailable";
    const store = unavailableValidation
      ? getEphemeralValidationStore()
      : getProductStore();
    await assertOwnedProject(store, session.id, input.projectId);

    const existing = await store.findGenerationByIdempotency(
      session.id,
      idempotencyKey
    );
    if (existing) {
      return Response.json({
        job: await materializePublicJob(store, existing),
        session: publicSession(session),
        validationMode,
        persistence: store.mode,
        persisted: store.durable,
        idempotentReplay: true,
      });
    }

    const model = validationMode
      ? "demo-no-provider-call"
      : falModelForInput(input, session.plan === "free");
    // Never persist base64 user photos inside a database JSON column. Demo
    // output is immediate; live mode above requires private asset IDs.
    const storedInput = {
      ...input,
      assets: input.assets.map((asset) => ({
        role: asset.role,
        ...(asset.assetId ? { assetId: asset.assetId } : {}),
      })),
    };
    let job = await store.createGeneration(
      newGenerationJob({
        ownerId: session.id,
        session,
        input: storedInput,
        idempotencyKey,
        demo: validationMode,
        model,
      })
    );

    if (validationMode) {
      job = await completeDemoJob(store, job);
      return Response.json(
        {
          job: await materializePublicJob(store, job),
          session: publicSession(session),
          validationMode: true,
          chargedCredits: 0,
          persistence: store.mode,
          persisted: store.durable,
          message:
            "Cached Pikbo Lab validation preview — no model request and no credit charge.",
        },
        { status: 201 }
      );
    }

    const queued = await queueLiveJob({ store, job, session });
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
