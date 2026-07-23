/**
 * Shared /api/me response shape for Studio, badge, settings, batch.
 */

import type { PublicSession } from "@/lib/session";

export type GenerateMode = "live-generate" | "demo-cached";

export type MeResponse = PublicSession & {
  mode?: GenerateMode | string;
  cachedDemoFree?: boolean;
  liveJobCredits?: number;
};

export function isDemoMode(me: MeResponse | null | undefined): boolean {
  if (!me) return false;
  return me.mode === "demo-cached";
}

export async function fetchMe(): Promise<MeResponse | null> {
  try {
    const res = await fetch("/api/me");
    if (!res.ok) return null;
    return (await res.json()) as MeResponse;
  } catch {
    return null;
  }
}
