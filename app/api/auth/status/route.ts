import { NextResponse } from "next/server";
import { publicAuthStatus } from "@/lib/authConfig";
import { probeDurableCreditsStore } from "@/lib/durableCredits";
import { probeSupabase } from "@/lib/supabase/server";

export const runtime = "nodejs";

/** Public auth readiness — no secrets. */
export async function GET() {
  const auth = publicAuthStatus();
  const durable = await probeDurableCreditsStore();
  const supabase = await probeSupabase();
  return NextResponse.json({
    auth,
    supabase: {
      configured: supabase.configured,
      reachable: supabase.reachable,
      hasServiceRole: supabase.hasServiceRole,
      // never echo error details that might leak host internals beyond short note
      error: supabase.error ? "probe_failed" : undefined,
    },
    durableCredits: {
      backend: durable.backend,
      writable: durable.writable,
      configured: durable.configured,
    },
  });
}
