import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { ensureSession } from "@/lib/session";
import {
  localAssetMaxBytes,
  localAssetTtlMs,
  reserveLocalAssetId,
} from "@/lib/localAssets";

export const runtime = "nodejs";

/**
 * Phase D — local upload contract (no object storage yet).
 * Returns a same-origin PUT target for soft-launch demos. Clients may still
 * post Base64 to /api/generate; this path avoids repeating large payloads when
 * the local content route is used.
 *
 * Mints a session-scoped reservation so another cookie cannot PUT the same id.
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

  const maxBytes = localAssetMaxBytes();
  if (typeof byteLength === "number" && byteLength > maxBytes) {
    return NextResponse.json(
      {
        ok: false,
        code: "IMAGE_TOO_LARGE",
        error: `Max upload ${maxBytes} bytes`,
        maxBytes,
      },
      { status: 413 }
    );
  }

  const session = await ensureSession();
  // Rare: re-mint if the first id collides with a foreign reservation (UUID clash).
  let assetId = "";
  let expiresAt = "";
  for (let i = 0; i < 3; i++) {
    assetId = `asset_${randomUUID().replace(/-/g, "").slice(0, 16)}`;
    const reserved = reserveLocalAssetId({
      id: assetId,
      sessionId: session.id,
    });
    if (reserved.ok) {
      expiresAt = reserved.expiresAt;
      break;
    }
  }
  if (!expiresAt) {
    return NextResponse.json(
      {
        ok: false,
        code: "RESERVE_FAILED",
        error: "Could not reserve asset id — retry upload",
      },
      { status: 503 }
    );
  }

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
      maxBytes,
      ttlMs: localAssetTtlMs(),
      expiresAt,
      sessionId: session.id,
      note:
        "Local PUT target for soft-launch (session-reserved id). Object storage not wired. Soft-launch generate still accepts data URLs.",
      planned: {
        production: "signed PUT to private bucket; never expose permanent raw provider URLs",
      },
    },
    { status: 201 }
  );
}
