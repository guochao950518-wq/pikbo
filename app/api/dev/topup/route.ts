import { NextResponse } from "next/server";
import { getPlan } from "@/lib/pricing";
import { ensureSession, publicSession, saveSession } from "@/lib/session";

export const runtime = "nodejs";

/**
 * Local / soft-debug only: refill free trial credits.
 * Enabled when NODE_ENV=development OR PIKBO_DEV_TOPUP=1.
 * Never rely on this in production traffic without the env flag.
 */
export async function POST() {
  const allowed =
    process.env.NODE_ENV === "development" ||
    process.env.PIKBO_DEV_TOPUP === "1";

  if (!allowed) {
    return NextResponse.json(
      { error: "Dev topup disabled", code: "FORBIDDEN" },
      { status: 403 }
    );
  }

  let session = await ensureSession();
  const plan = getPlan(session.plan === "free" ? "free" : session.plan);
  session = {
    ...session,
    credits: plan.credits,
  };
  await saveSession(session);

  return NextResponse.json({
    ok: true,
    message: `Refilled to ${plan.credits} credits (${session.plan})`,
    session: publicSession(session),
  });
}
