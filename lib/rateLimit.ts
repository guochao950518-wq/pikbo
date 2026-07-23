/**
 * Tiny in-memory rate limit for generate/image.
 * Soft-launch only — multi-instance Vercel needs Redis later (T5 era).
 */

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

/**
 * Per-session in-flight jobs — blocks double-click double-charge on one instance.
 * Map stores startedAt so a Vercel hard-kill that skips `finally` cannot wedge
 * the session forever (TTL ≥ maxDuration on generate = 180s).
 */
const inflight = new Map<string, number>();

/** Default ~3m20s — slightly above generate maxDuration (180s). */
const DEFAULT_INFLIGHT_TTL_MS = 200_000;

export function inflightTtlMs(): number {
  const raw = Number(process.env.PIKBO_INFLIGHT_TTL_MS || 0);
  if (Number.isFinite(raw) && raw >= 30_000) return Math.floor(raw);
  return DEFAULT_INFLIGHT_TTL_MS;
}

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

/**
 * Session + IP pair for generate/image.
 * Session: 8/min (normal UX). IP: 24/min (guest-cookie rotation wool).
 */
export function takeGenerateBudget(
  sessionId: string,
  ip: string,
  kind: "gen" | "img" = "gen"
): RateLimitResult {
  pruneRateLimit();
  // IP first so rotation cannot burn 8×N session keys as freely
  const ipRl = takeToken(`${kind}ip:${ip || "unknown"}`, 24, 60_000);
  if (!ipRl.ok) return ipRl;
  return takeToken(`${kind}:${sessionId}`, 8, 60_000);
}

function pruneStaleInflight(now = Date.now()): void {
  const ttl = inflightTtlMs();
  for (const [key, started] of inflight) {
    if (now - started >= ttl) inflight.delete(key);
  }
}

/** Acquire exclusive in-flight lock for a session (single Node instance). */
export function tryBeginJob(sessionId: string): boolean {
  const now = Date.now();
  const started = inflight.get(sessionId);
  if (started !== undefined) {
    if (now - started < inflightTtlMs()) return false;
    // Stale lock — previous request likely killed without endJob.
    inflight.delete(sessionId);
  }
  inflight.set(sessionId, now);
  return true;
}

export function endJob(sessionId: string): void {
  inflight.delete(sessionId);
}

/**
 * Seconds until an in-flight lock frees (for JOB_IN_FLIGHT Retry-After).
 * Returns 1 when no lock is held.
 */
export function jobInFlightRetryAfterSec(sessionId: string): number {
  const started = inflight.get(sessionId);
  if (started === undefined) return 1;
  const remainingMs = inflightTtlMs() - (Date.now() - started);
  if (remainingMs <= 0) {
    inflight.delete(sessionId);
    return 1;
  }
  return Math.max(1, Math.ceil(remainingMs / 1000));
}

/** Ops probe — active locks after pruning stale entries. */
export function inflightJobCount(): number {
  pruneStaleInflight();
  return inflight.size;
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
  pruneStaleInflight(now);
}

/** Test helper — clear buckets + inflight. */
export function __resetRateLimitForTests(): void {
  buckets.clear();
  inflight.clear();
}
