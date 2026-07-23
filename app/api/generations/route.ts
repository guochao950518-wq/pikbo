import { NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * Phase D skeleton — durable async generations.
 * Soft-launch continues to use POST /api/generate.
 * This route exists so clients can probe capability without fake success.
 */
export async function GET() {
  return NextResponse.json(
    {
      ok: false,
      code: "NOT_IMPLEMENTED",
      phase: "D",
      message:
        "Async generations API is scaffolded. Use POST /api/generate for soft-launch synchronous jobs.",
      compatibility: {
        syncGenerate: "/api/generate",
        planned: [
          "POST /api/generations",
          "GET /api/generations/[id]",
          "POST /api/generations/[id]/retry",
        ],
      },
    },
    { status: 501 }
  );
}

export async function POST() {
  return NextResponse.json(
    {
      ok: false,
      code: "NOT_IMPLEMENTED",
      phase: "D",
      message:
        "Durable job queue is not live. Soft-launch uses POST /api/generate (sync).",
      hint: "Requires Phase C Supabase + Phase D storage/webhooks.",
    },
    { status: 501 }
  );
}
