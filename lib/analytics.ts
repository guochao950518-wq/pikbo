"use client";

export type PikboEvent =
  | "engaged_30s"
  | "engaged_60s"
  | "hero_video_start"
  | "showcase_video_play"
  | "template_select"
  | "studio_start"
  | "generation_start"
  | "generation_success"
  | "generation_failed"
  | "pricing_plan_select";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/** No-op unless NEXT_PUBLIC_GA_ID is configured. */
export function track(
  event: PikboEvent,
  properties: Record<string, string | number | boolean | undefined> = {}
) {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", event, properties);
}
