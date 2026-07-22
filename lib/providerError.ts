/**
 * Classify fal / provider failures so the UI can stay honest
 * (balance empty vs hard crash vs rate limit).
 */

export type ProviderFailKind = "balance" | "rate" | "other";

export function classifyProviderError(raw: string): ProviderFailKind {
  if (/Exhausted balance|locked|top up|insufficient.*credit/i.test(raw)) {
    return "balance";
  }
  if (/Forbidden/i.test(raw) && /balance|billing|quota/i.test(raw)) {
    return "balance";
  }
  if (/rate.?limit|too many|429/i.test(raw)) {
    return "rate";
  }
  return "other";
}

export function providerErrorMessage(kind: ProviderFailKind, fallback: string): string {
  if (kind === "balance") {
    return "Provider balance empty or account locked — top up at fal.ai/dashboard/billing (credits refunded).";
  }
  if (kind === "rate") {
    return "Provider rate limited — try again in a moment (credits refunded).";
  }
  return fallback;
}

/** data:image/*;base64,... only — rejects non-image or missing payload. */
export function isValidImageDataUrl(image: string): boolean {
  if (!image || image.length < 32) return false;
  return /^data:image\/(jpeg|jpg|png|webp|gif);base64,/i.test(image);
}
