import { NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * Phase D — signed/direct upload URL.
 * Soft-launch still posts Base64 to /api/generate.
 */
export async function POST() {
  return NextResponse.json(
    {
      ok: false,
      code: "NOT_IMPLEMENTED",
      phase: "D",
      message:
        "Direct asset upload is not live. Soft-launch still accepts image data URLs on /api/generate.",
      planned: {
        method: "POST",
        returns: ["uploadUrl", "assetId", "expiresAt"],
        maxBytes: 8_000_000,
      },
    },
    { status: 501 }
  );
}
