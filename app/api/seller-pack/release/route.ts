import { NextResponse } from "next/server";
import { releaseSellerPackChild } from "@/lib/durableCredits/sellerPack";
import { durableCreditsActive } from "@/lib/durableCredits";

export const runtime = "nodejs";

/** Release 10 credits on a Seller Pack shadow reservation after a failed child. */
export async function POST(req: Request) {
  let body: {
    reservationId?: string;
    jobId?: string;
    childKey?: string;
    childCredits?: number;
    reason?: string;
  } = {};
  try {
    body = (await req.json()) as typeof body;
  } catch {
    body = {};
  }
  if (!body.reservationId || typeof body.reservationId !== "string") {
    return NextResponse.json(
      { ok: false, code: "INVALID_REQUEST", error: "reservationId required" },
      { status: 400 }
    );
  }
  if (!durableCreditsActive()) {
    return NextResponse.json({ ok: true, skipped: true, code: "DURABLE_OFF" });
  }
  const result = await releaseSellerPackChild({
    reservationId: body.reservationId,
    jobId: body.jobId,
    childKey: body.childKey,
    childCredits: body.childCredits,
    reason: body.reason,
  });
  if (!result.ok) {
    return NextResponse.json(
      { ok: false, code: result.code, error: result.error },
      { status: 400 }
    );
  }
  return NextResponse.json({ ok: true });
}
