import { NextResponse } from "next/server";
import { ensureSession } from "@/lib/session";
import {
  getLocalAsset,
  localAssetMaxBytes,
  putLocalAsset,
} from "@/lib/localAssets";

export const runtime = "nodejs";

type Props = { params: Promise<{ id: string }> };

/**
 * Phase D local asset body — PUT bytes after POST /api/assets/upload-url.
 * GET returns the stored data URL for the owning session (soft-launch only).
 */
export async function PUT(req: Request, { params }: Props) {
  const { id } = await params;
  if (!id.startsWith("asset_")) {
    return NextResponse.json(
      { ok: false, code: "INVALID_ID", error: "Unknown asset id shape" },
      { status: 400 }
    );
  }
  const session = await ensureSession();
  const contentType =
    req.headers.get("content-type")?.split(";")[0]?.trim() || "image/jpeg";
  const buf = Buffer.from(await req.arrayBuffer());
  const result = putLocalAsset({
    id,
    sessionId: session.id,
    contentType,
    bytes: buf,
  });
  if (!result.ok) {
    const status =
      result.code === "IMAGE_TOO_LARGE"
        ? 413
        : result.code === "NOT_OWNED"
          ? 403
          : result.code === "EXPIRED"
            ? 410
            : 400;
    return NextResponse.json(
      {
        ok: false,
        code: result.code,
        error: result.error,
        maxBytes: localAssetMaxBytes(),
      },
      { status }
    );
  }
  // Never echo multi-MB dataUrl back — client already has the still locally.
  // Generate reads via getLocalAsset(session) on the server.
  return NextResponse.json({
    ok: true,
    mode: "local-memory",
    durable: false,
    assetId: result.asset.id,
    byteLength: result.asset.byteLength,
    contentType: result.asset.contentType,
    expiresAt: result.asset.expiresAt,
    note: "In-process only · session-owned · expires ~15m · not multi-node durable",
  });
}

export async function GET(_req: Request, { params }: Props) {
  const { id } = await params;
  const session = await ensureSession();
  const asset = getLocalAsset(id, session.id);
  if (!asset) {
    return NextResponse.json(
      {
        ok: false,
        code: "NOT_FOUND",
        error: "Asset missing, expired, or not owned by this session",
      },
      { status: 404 }
    );
  }
  return NextResponse.json({
    ok: true,
    mode: "local-memory",
    assetId: asset.id,
    contentType: asset.contentType,
    byteLength: asset.byteLength,
    expiresAt: asset.expiresAt,
    dataUrl: asset.dataUrl,
  });
}
