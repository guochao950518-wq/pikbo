/**
 * Request metadata helpers (IP for soft rate limits).
 * Behind Vercel/proxy, prefer x-forwarded-for first hop.
 */

export function clientIp(req: Request): string {
  const xf = req.headers.get("x-forwarded-for");
  if (xf) {
    const first = xf.split(",")[0]?.trim();
    if (first) return first.slice(0, 64);
  }
  const real = req.headers.get("x-real-ip")?.trim();
  if (real) return real.slice(0, 64);
  const cf = req.headers.get("cf-connecting-ip")?.trim();
  if (cf) return cf.slice(0, 64);
  return "unknown";
}

/** Live vs cached mode — single source for /api/me + health honesty. */
export function generateMode(): "live-generate" | "demo-cached" {
  return process.env.FAL_KEY ? "live-generate" : "demo-cached";
}
