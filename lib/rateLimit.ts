/**
 * Tiny in-memory rate limit for generate/image.
 * Soft-launch only — multi-instance Vercel needs Redis later (T5 era).
 */

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

export type RateLimitResult =
  | { ok: true; remaining: number }
  | { ok: false; retryAfterSec: number };

/**
 * @param key session id or IP
 * @param limit max hits per window
 * @param windowMs window length
 */
export function takeToken(
  key: string,
  limit = 8,
  windowMs = 60_000
): RateLimitResult {
  const now = Date.now();
  let b = buckets.get(key);
  if (!b || now >= b.resetAt) {
    b = { count: 0, resetAt: now + windowMs };
    buckets.set(key, b);
  }
  if (b.count >= limit) {
    return {
      ok: false,
      retryAfterSec: Math.max(1, Math.ceil((b.resetAt - now) / 1000)),
    };
  }
  b.count += 1;
  return { ok: true, remaining: limit - b.count };
}

/** Prune occasionally so Map does not grow forever in long-lived dev. */
export function pruneRateLimit(maxEntries = 5000): void {
  if (buckets.size <= maxEntries) return;
  const now = Date.now();
  for (const [k, v] of buckets) {
    if (now >= v.resetAt) buckets.delete(k);
  }
  if (buckets.size > maxEntries) {
    // drop oldest half
    let i = 0;
    for (const k of buckets.keys()) {
      buckets.delete(k);
      if (++i > maxEntries / 2) break;
    }
  }
}
