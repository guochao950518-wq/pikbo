import { ProductApiError, productErrorResponse } from "@/lib/product-errors";
import { materializePublicJob } from "@/lib/product-api";
import { expireGenerationIfStale } from "@/lib/product-generation";
import {
  getEphemeralValidationStore,
  getProductStore,
  productPersistenceMode,
} from "@/lib/product-store";
import { ensureSession } from "@/lib/session";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const session = await ensureSession();
    const store =
      !process.env.FAL_KEY && productPersistenceMode() === "unavailable"
        ? getEphemeralValidationStore()
        : getProductStore();
    let job = await store.getGeneration(id);
    if (!job || job.ownerId !== session.id) {
      throw new ProductApiError("generation_not_found", "Generation not found", 404);
    }
    if (store.durable) job = await expireGenerationIfStale(store, job);
    return Response.json({
      job: await materializePublicJob(store, job),
      validationMode: !process.env.FAL_KEY,
      persistence: store.mode,
      persisted: store.durable,
    });
  } catch (error) {
    return productErrorResponse(error);
  }
}
