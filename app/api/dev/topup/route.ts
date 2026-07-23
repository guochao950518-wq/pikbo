import { NextResponse } from "next/server";
import { getPlan } from "@/lib/pricing";
import { ensureSession, publicSession, saveSession } from "@/lib/session";

export const runtime = "nodejs";

/**
 * Local / soft-debug only: refill free trial credits.
 * Allowed only when NODE_ENV=development, or when PIKBO_DEV_TOPUP=1
 * outside Vercel/production hosts. Never on production traffic.
 */
export async function POST() {
  const isProdHost =
    process.env.VERCEL_ENV === "production" ||
    process.env.NODE_ENV === "production";
  const allowed =
    process.env.NODE_ENV === "development" ||
    (!isProdHost && process.env.PIKBO_DEV_TOPUP === "1");

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
