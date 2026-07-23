/**
 * Optional privacy-conscious product analytics (Phase H).
 * No key → no-op. Missing config must never break rendering.
 */

export type AnalyticsEvent =
  | "landing_view"
  | "project_open"
  | "recipe_use"
  | "upload_ready"
  | "generate_start"
  | "generate_result"
  | "export_click";

export type AnalyticsPayload = {
  event: AnalyticsEvent;
  path?: string;
  recipe?: string;
  demo?: boolean;
  meta?: Record<string, string | number | boolean | null | undefined>;
};

function endpoint(): string | null {
  const url = process.env.NEXT_PUBLIC_ANALYTICS_URL?.trim();
  return url || null;
}

/** Client-safe fire-and-forget. Swallows all errors. */
export function track(payload: AnalyticsPayload): void {
  try {
    const url = endpoint();
    if (!url) return;
    if (typeof window === "undefined") return;
    const body = JSON.stringify({
      ...payload,
      ts: Date.now(),
      href: window.location.href,
    });
    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      const blob = new Blob([body], { type: "application/json" });
      navigator.sendBeacon(url, blob);
      return;
    }
    void fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
      mode: "no-cors",
    }).catch(() => undefined);
  } catch {
    // never throw into product UI
  }
}

export function analyticsConfigured(): boolean {
  return Boolean(endpoint());
}
