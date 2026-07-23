import { NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * Phase D — provider completion webhook (idempotent settle/release).
 * Soft-launch uses synchronous fal.subscribe inside /api/generate.
 */
export async function POST() {
  return NextResponse.json(
    {
      ok: false,
      code: "NOT_IMPLEMENTED",
      phase: "D",
      message:
        "Video provider webhooks are not live. Soft-launch settles inline on /api/generate.",
    },
    { status: 501 }
  );
}
