import { after } from "next/server";
import { ProductApiError, productErrorResponse } from "@/lib/product-errors";
import { falOutputVideo, verifyFalWebhook } from "@/lib/product-fal";
import { getProductStore } from "@/lib/product-store";
import type { FalWebhookPayload, GenerationJob } from "@/lib/product-types";
import {
  burnFreeTierWatermark,
  watermarkWorkerConfigured,
} from "@/lib/videoWatermark";

export const runtime = "nodejs";
export const maxDuration = 180;

function webhookError(payload: FalWebhookPayload): string {
  if (typeof payload.error === "string") return payload.error.slice(0, 1_000);
  if (payload.error?.message) return payload.error.message.slice(0, 1_000);
  return "fal generation failed";
}

async function failAndRefund(job: GenerationJob, message: string) {
  const store = getProductStore();
  const current = await store.getGeneration(job.id);
  if (!current || current.status === "succeeded" || current.status === "failed") {
    return;
  }
  if (current.creditStatus === "reserved") {
    await store.settleCredits(current.ownerId, current.id, "refunded");
  }
  await store.updateGeneration(job.id, {
    status: "failed",
    progress: 0,
    outputAssetId: null,
    outputUrl: null,
    chargedCredits: 0,
    creditStatus:
      current.creditStatus === "reserved" ? "refunded" : current.creditStatus,
    error: message.slice(0, 1_000),
    completedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
}

async function finalizeSuccessfulJob(
  job: GenerationJob,
  payload: FalWebhookPayload
) {
  const store = getProductStore();
  const current = await store.getGeneration(job.id);
  if (!current || current.status === "succeeded" || current.status === "failed") {
    return;
  }
  job = current;
  const output = falOutputVideo(payload.payload);
  if (!output.url) {
    await failAndRefund(job, "fal returned no video output");
    return;
  }
  try {
    let outputAsset;
    if (job.watermark) {
      if (!watermarkWorkerConfigured()) {
        throw new ProductApiError(
          "watermark_worker_unavailable",
          "Free-tier output is blocked because FFMPEG_PATH is not configured",
          503
        );
      }
      const watermarked = await burnFreeTierWatermark(output.url);
      outputAsset = await store.persistOutputBytes(
        job.ownerId,
        job.id,
        watermarked,
        "output_watermarked",
        "video/mp4"
      );
    } else {
      outputAsset = await store.persistRemoteOutput(
        job.ownerId,
        job.id,
        output.url,
        output.contentType
      );
    }
    const beforeCommit = await store.getGeneration(job.id);
    if (
      !beforeCommit ||
      (beforeCommit.status !== "queued" && beforeCommit.status !== "running")
    ) {
      return;
    }
    const now = new Date().toISOString();
    await store.updateGeneration(job.id, {
      status: "succeeded",
      progress: 100,
      outputAssetId: outputAsset.id,
      // Never persist or expose the provider's public URL. GET signs our asset.
      outputUrl: null,
      chargedCredits: job.estimatedCredits,
      creditStatus: "charged",
      error: null,
      completedAt: now,
      updatedAt: now,
    });
    await store.settleCredits(job.ownerId, job.id, "charged");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Output processing failed";
    await failAndRefund(job, message);
  }
}

export async function POST(request: Request) {
  const rawBody = await request.text();
  try {
    if (!(await verifyFalWebhook(request.headers, rawBody))) {
      throw new ProductApiError(
        "invalid_fal_signature",
        "Invalid fal webhook signature",
        401
      );
    }
    let payload: FalWebhookPayload;
    try {
      payload = JSON.parse(rawBody) as FalWebhookPayload;
    } catch {
      throw new ProductApiError("invalid_fal_payload", "Invalid webhook JSON", 400);
    }
    const requestId = payload.request_id;
    const headerRequestId = request.headers.get("x-fal-webhook-request-id");
    if (!requestId || requestId !== headerRequestId) {
      throw new ProductApiError(
        "fal_request_id_mismatch",
        "Webhook request ID mismatch",
        400
      );
    }
    const store = getProductStore();
    if (!store.durable) {
      throw new ProductApiError(
        "persistent_generation_store_required",
        "fal webhooks require durable storage",
        503
      );
    }
    const job = await store.findGenerationByProviderRequest(requestId);
    if (!job) {
      throw new ProductApiError("generation_not_found", "Generation not found", 404);
    }
    if (payload.status !== "OK" && payload.status !== "ERROR") {
      throw new ProductApiError(
        "unsupported_fal_status",
        "Unsupported fal webhook status",
        400
      );
    }
    const eventId = `fal:${requestId}`;
    const claimed = await store.recordWebhookEvent(eventId, requestId);
    if (!claimed) {
      return Response.json({ received: true, duplicate: true });
    }
    if (job.status === "succeeded" || job.status === "failed") {
      return Response.json({ received: true, terminal: true });
    }
    if (payload.status === "ERROR") {
      await failAndRefund(job, webhookError(payload));
      return Response.json({ received: true, status: "failed" });
    }

    await store.updateGeneration(job.id, {
      status: "running",
      progress: 90,
      startedAt: job.startedAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    // fal expects a quick acknowledgement. Media copy/watermark work continues
    // within this route's configured maxDuration after the response is sent.
    after(async () => {
      try {
        await finalizeSuccessfulJob(job, payload);
      } catch (error) {
        console.error("fal output finalization failed", job.id, error);
      }
    });
    return Response.json({ received: true, status: "processing" }, { status: 202 });
  } catch (error) {
    return productErrorResponse(error);
  }
}
