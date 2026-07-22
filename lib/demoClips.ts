/**
 * Cached Lab clips for demo generate path (no FAL_KEY / no live call).
 * Prefer exact preset match; fall back to rotating catalog.
 */

import { DEMO_VIDEOS } from "@/lib/demoVideos";

const FALLBACK = [
  "/demos/orbit-dance.mp4",
  "/demos/moon-glow.mp4",
  "/demos/scout-walk.mp4",
  "/demos/beatbot-neon.mp4",
  "/demos/orbit-aura.mp4",
  "/demos/moon-smoke.mp4",
  "/demos/scout-packshot-spin.mp4",
  "/demos/orbit-hyper-cgi.mp4",
  "/demos/moon-box-reveal.mp4",
  "/demos/beatbot-viral-hook.mp4",
  "/demos/scout-story-mode.mp4",
  "/demos/beatbot-unboxed.mp4",
] as const;

/** Resolve a product-relevant mp4 for demo mode. */
export function demoClipForEffect(effect: string): string {
  const exact = DEMO_VIDEOS.find((d) => d.preset === effect);
  if (exact?.mp4) return exact.mp4;

  let h = 0;
  for (let i = 0; i < effect.length; i++) {
    h = (h + effect.charCodeAt(i) * 17) % FALLBACK.length;
  }
  return FALLBACK[h] ?? FALLBACK[0];
}

/** Paths that must exist on disk for soft-launch demos. */
export function requiredDemoPaths(): string[] {
  return Array.from(new Set([...DEMO_VIDEOS.map((d) => d.mp4), ...FALLBACK]));
}
