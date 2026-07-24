/**
 * Shared /api/me response shape for Studio, badge, settings, batch.
 */

import type { PublicSession } from "@/lib/session";

export type GenerateMode = "live-generate" | "demo-cached";

export type MeDurableWallet = {
  accountId: string;
  availableCredits: number;
  reservedCredits: number;
  planId: string;
  backend?: "supabase" | "local-file";
  authority?: "shadow" | "authoritative";
};

/** Soft-launch free trial honesty from GET /api/me */
export type MeFreeTrial = {
  planId: string;
  isFreePlan: boolean;
  credits: number;
  clipsLeft: number;
  liveJobCredits: number;
  watermark: boolean;
  cachedDemoFree: boolean;
  freeLive: {
    modelClass: "seedance-mini";
    durationSec: 5;
    resolution: "480p";
    onPlayerMark: true;
  } | null;
  exhausted: boolean;
};

export type MeResponse = PublicSession & {
  mode?: GenerateMode | string;
  cachedDemoFree?: boolean;
  liveJobCredits?: number;
  freeTrial?: MeFreeTrial;
  signedIn?: boolean;
  authConfigured?: boolean;
  durableCreditsActive?: boolean;
  auth?: { id: string; email: string | null } | null;
  durable?: MeDurableWallet | null;
};

/** True when Free plan has fewer than one live job of credits left. */
export function freeTrialExhausted(me: MeResponse | null | undefined): boolean {
  if (!me) return false;
  if (me.freeTrial) return me.freeTrial.exhausted === true;
  if (me.plan !== "free") return false;
  const need = me.liveJobCredits ?? 10;
  return me.credits < need;
}

export function isDemoMode(me: MeResponse | null | undefined): boolean {
  if (!me) return false;
  return me.mode === "demo-cached";
}

/** Prefer durable available when signed-in shadow wallet exists (display only). */
export function displayCredits(me: MeResponse | null | undefined): number {
  if (!me) return 0;
  if (
    me.signedIn &&
    me.durable &&
    typeof me.durable.availableCredits === "number"
  ) {
    return me.durable.availableCredits;
  }
  return me.credits;
}

async function authHeaders(): Promise<HeadersInit> {
  if (typeof window === "undefined") return {};
  try {
    const { getSupabaseBrowser } = await import("@/lib/supabase/browser");
    const supabase = getSupabaseBrowser();
    if (!supabase) return {};
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    if (!token) return {};
    return { Authorization: `Bearer ${token}` };
  } catch {
    return {};
  }
}

export async function fetchMe(): Promise<MeResponse | null> {
  try {
    const headers = await authHeaders();
    const res = await fetch("/api/me", { headers });
    if (!res.ok) return null;
    return (await res.json()) as MeResponse;
  } catch {
    return null;
  }
}
