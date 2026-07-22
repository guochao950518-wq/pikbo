import { createHash, createPublicKey, verify } from "crypto";
import { fal } from "@fal-ai/client";
import { ProductApiError } from "@/lib/product-errors";
import type { GenerationInput } from "@/lib/product-types";
import { modelForTier, resolutionForTier, seedanceDuration } from "@/lib/models";
import { getPreset } from "@/lib/presets";

type FalJwk = { kty?: string; crv?: string; x?: string };
let jwksCache: { expiresAt: number; keys: FalJwk[] } | null = null;

export function falWebhookUrl(): string {
  const explicit = process.env.FAL_WEBHOOK_URL?.trim();
  if (explicit) return explicit;
  const configured =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    process.env.VERCEL_URL;
  if (!configured) {
    throw new ProductApiError(
      "fal_webhook_url_unavailable",
      "Configure FAL_WEBHOOK_URL or NEXT_PUBLIC_SITE_URL before live async generation",
      503
    );
  }
  const base = configured.startsWith("http") ? configured : `https://${configured}`;
  return `${base.replace(/\/$/, "")}/api/webhooks/fal`;
}
export function falModelForInput(input: GenerationInput, freeTier: boolean): string {
  return modelForTier({ freeTier, prefer: input.modelId });
}

export async function submitFalGeneration(options: {
  input: GenerationInput;
  model: string;
  freeTier: boolean;
  source: { dataUrl?: string; signedUrl?: string };
}): Promise<string> {
  const key = process.env.FAL_KEY;
  if (!key) {
    throw new ProductApiError(
      "fal_not_configured",
      "fal.ai is not configured; use validation mode instead",
      503
    );
  }
  const preset = getPreset(options.input.presetId);
  if (!preset) throw new ProductApiError("unknown_preset", "Unknown preset", 400);

  fal.config({ credentials: key });
  let imageUrl = options.source.signedUrl;
  if (!imageUrl && options.source.dataUrl) {
    const blob = await (await fetch(options.source.dataUrl)).blob();
    imageUrl = await fal.storage.upload(
      new File([blob], "owned-toy-reference.png", {
        type: blob.type || "image/png",
      })
    );
  }
  if (!imageUrl) {
    throw new ProductApiError("front_asset_required", "Front photo required", 400);
  }
  const custom = options.input.prompt?.trim() || "";
  const prompt = custom
    ? `${preset.promptTemplate} User direction: ${custom}. Purpose: ${options.input.purpose}. Preserve the exact identity, proportions, colors, and surface details of the supplied collectible.`
    : `${preset.promptTemplate} Purpose: ${options.input.purpose}. Preserve the exact identity, proportions, colors, and surface details of the supplied collectible.`;

  const submission = await fal.queue.submit(options.model, {
    input: {
      prompt,
      image_url: imageUrl,
      duration: seedanceDuration(options.input.duration),
      aspect_ratio: options.input.aspectRatio,
      resolution: resolutionForTier(
        options.freeTier,
        options.input.resolution
      ),
      generate_audio: !options.freeTier,
    },
    webhookUrl: falWebhookUrl(),
  });
  if (!submission.request_id) {
    throw new ProductApiError(
      "fal_submission_failed",
      "fal.ai did not return a request ID",
      502
    );
  }
  return submission.request_id;
}

async function falJwks(): Promise<FalJwk[]> {
  if (jwksCache && jwksCache.expiresAt > Date.now()) return jwksCache.keys;
  const response = await fetch("https://rest.fal.ai/.well-known/jwks.json", {
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) return [];
  const body = (await response.json()) as { keys?: FalJwk[] };
  const keys = body.keys ?? [];
  jwksCache = { keys, expiresAt: Date.now() + 23 * 60 * 60 * 1_000 };
  return keys;
}

/** Official fal ED25519 verification: request/user/timestamp/body hash. */
export async function verifyFalWebhook(
  headers: Headers,
  rawBody: string
): Promise<boolean> {
  const requestId = headers.get("x-fal-webhook-request-id");
  const userId = headers.get("x-fal-webhook-user-id");
  const timestamp = headers.get("x-fal-webhook-timestamp");
  const signature = headers.get("x-fal-webhook-signature");
  if (!requestId || !userId || !timestamp || !signature) return false;
  const seconds = Number(timestamp);
  if (!Number.isFinite(seconds) || Math.abs(Date.now() / 1000 - seconds) > 300) {
    return false;
  }
  const bodyHash = createHash("sha256").update(rawBody).digest("hex");
  const message = Buffer.from(
    [requestId, userId, timestamp, bodyHash].join("\n"),
    "utf8"
  );
  const signatureBytes = Buffer.from(signature, "hex");
  if (signatureBytes.length !== 64) return false;
  const keys = await falJwks();
  return keys.some((jwk) => {
    if (!jwk.x) return false;
    try {
      const key = createPublicKey({
        key: { kty: "OKP", crv: "Ed25519", x: jwk.x },
        format: "jwk",
      });
      return verify(null, message, key, signatureBytes);
    } catch {
      return false;
    }
  });
}

export function falOutputVideo(payload: Record<string, unknown> | undefined) {
  const video = payload?.video as
    | { url?: unknown; content_type?: unknown }
    | undefined;
  const direct = payload?.video_url ?? payload?.url;
  const url = typeof video?.url === "string" ? video.url : direct;
  return {
    url: typeof url === "string" ? url : null,
    contentType:
      typeof video?.content_type === "string"
        ? video.content_type
        : "video/mp4",
  };
}
