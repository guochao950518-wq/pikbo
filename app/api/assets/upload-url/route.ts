import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { ensureSession } from "@/lib/session";

export const runtime = "nodejs";

const MAX_BYTES = 8_000_000;

/**
 * Phase D — local upload contract (no object storage yet).
 * Returns a same-origin PUT target for soft-launch demos. Clients may still
 * post Base64 to /api/generate; this path avoids repeating large payloads when
 * the local content route is used.
 */
export async function POST(req: Request) {
  let contentType = "image/jpeg";
  let byteLength: number | undefined;
  try {
    const body = (await req.json()) as {
      contentType?: string;
      byteLength?: number;
    };
    if (typeof body.contentType === "string" && body.contentType.startsWith("image/")) {
      contentType = body.contentType.slice(0, 64);
    }
    if (typeof body.byteLength === "number") byteLength = body.byteLength;
  } catch {
    // empty body ok
  }

  if (typeof byteLength === "number" && byteLength > MAX_BYTES) {
    return NextResponse.json(
      {
        ok: false,
        code: "IMAGE_TOO_LARGE",
        error: `Max upload ${MAX_BYTES} bytes`,
        maxBytes: MAX_BYTES,
      },
      { status: 413 }
    );
  }

  const session = await ensureSession();
  const assetId = `asset_${randomUUID().replace(/-/g, "").slice(0, 16)}`;
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

  return NextResponse.json(
    {
      ok: true,
      mode: "local-memory",
      durable: false,
      assetId,
      uploadUrl: `/api/assets/${assetId}/content`,
      method: "PUT",
      headers: {
        "Content-Type": contentType,
        "X-Pikbo-Session": "cookie",
      },
      maxBytes: MAX_BYTES,
      expiresAt,
      sessionId: session.id,
      note:
        "Local PUT target for soft-launch. Object storage (S3/Supabase Storage) not wired. Soft-launch generate still accepts data URLs.",
      planned: {
        production: "signed PUT to private bucket; never expose permanent raw provider URLs",
      },
    },
    { status: 201 }
  );
}
