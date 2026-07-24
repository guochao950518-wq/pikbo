/**
 * Classify fal / provider failures so the UI can stay honest
 * (balance empty vs hard crash vs rate limit vs content policy).
 */

export type ProviderFailKind =
  | "balance"
  | "rate"
  | "timeout"
  | "content"
  | "other";

export function classifyProviderError(raw: string): ProviderFailKind {
  if (!raw) return "other";
  if (/Exhausted balance|locked|top up|insufficient.*credit/i.test(raw)) {
    return "balance";
  }
  if (/Forbidden/i.test(raw) && /balance|billing|quota/i.test(raw)) {
    return "balance";
  }
  if (/rate.?limit|too many|429|throttl/i.test(raw)) {
    return "rate";
  }
  if (
    /timeout|timed?\s*out|deadline exceeded|ETIMEDOUT|Gateway Time-out|504/i.test(
      raw
    )
  ) {
    return "timeout";
  }
  if (
    /content.?policy|nsfw|safety|moderation|blocked.?content|violat/i.test(raw)
  ) {
    return "content";
  }
  return "other";
}

export function providerErrorMessage(
  kind: ProviderFailKind,
  fallback: string
): string {
  if (kind === "balance") {
    return "Provider balance empty or account locked — top up at fal.ai/dashboard/billing (credits refunded).";
  }
  if (kind === "rate") {
    return "Provider rate limited — try again in a moment (credits refunded).";
  }
  if (kind === "timeout") {
    return "Provider timed out — try again; credits restored when the debit was confirmed.";
  }
  if (kind === "content") {
    return "Provider rejected the still or prompt under content policy — try a clearer product photo (credits restored).";
  }
  return fallback;
}

/** data:image/*;base64,... only — rejects non-image or missing payload. */
export function isValidImageDataUrl(image: string): boolean {
  if (!image || image.length < 32) return false;
  return /^data:image\/(jpeg|jpg|png|webp|gif);base64,/i.test(image);
}
