import { NextResponse } from "next/server";
import { CREDITS_PER_VIDEO } from "@/lib/pricing";
import { generateMode } from "@/lib/requestMeta";
import { ensureSession, publicSession } from "@/lib/session";

export const runtime = "nodejs";

/**
 * Session + generate mode for Studio honesty.
 * Clients use `mode` to label live vs free cached-demo path without a separate health call.
 */
export async function GET() {
  const session = await ensureSession();
  const mode = generateMode();
  return NextResponse.json({
    ...publicSession(session),
    mode,
    /** Cached demos never charge; live jobs use flat CREDITS_PER_VIDEO */
    cachedDemoFree: true,
    liveJobCredits: CREDITS_PER_VIDEO,
  });
}
