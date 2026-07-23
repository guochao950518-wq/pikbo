import { NextResponse } from "next/server";
import { CREDITS_PER_VIDEO } from "@/lib/pricing";
import { generateMode } from "@/lib/requestMeta";
import { ensureSession, publicSession } from "@/lib/session";
import {
  durableCreditsActive,
  getPersonalWallet,
} from "@/lib/durableCredits";
import { getAuthUserFromRequest } from "@/lib/supabase/user";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const runtime = "nodejs";

/**
 * Session + generate mode for Studio honesty.
 * Optional Bearer token enriches response with Supabase auth + durable wallet
 * (shadow ledger). Cookie credits remain the soft-launch generate authority.
 */
export async function GET(req: Request) {
  const session = await ensureSession();
  const mode = generateMode();
  const base = {
    ...publicSession(session),
    mode,
    /** Cached demos never charge; live jobs use flat CREDITS_PER_VIDEO */
    cachedDemoFree: true,
    liveJobCredits: CREDITS_PER_VIDEO,
    authConfigured: isSupabaseConfigured(),
    durableCreditsActive: durableCreditsActive(),
  };

  const user = await getAuthUserFromRequest(req);
  if (!user) {
    return NextResponse.json({
      ...base,
      signedIn: false,
      auth: null,
      durable: null,
    });
  }

  let durable: {
    accountId: string;
    availableCredits: number;
    reservedCredits: number;
    planId: string;
  } | null = null;
  try {
    durable = await getPersonalWallet(user.id);
  } catch {
    durable = null;
  }

  return NextResponse.json({
    ...base,
    signedIn: true,
    auth: {
      id: user.id,
      email: user.email,
    },
    durable: durable
      ? {
          accountId: durable.accountId,
          availableCredits: durable.availableCredits,
          reservedCredits: durable.reservedCredits,
          planId: durable.planId,
          /** Display hint — cookie still debit authority for soft-launch live jobs */
          authority: "shadow" as const,
        }
      : null,
  });
}
