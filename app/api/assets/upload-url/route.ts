import { getProductStore, newProductId } from "@/lib/product-store";
import { productErrorResponse, ProductApiError } from "@/lib/product-errors";
import { ASSET_ROLES, type AssetRole, type ProductAsset } from "@/lib/product-types";
import { assertOwnedProject } from "@/lib/product-api";
import { ensureSession } from "@/lib/session";

export const runtime = "nodejs";

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);
const MAX_UPLOAD_BYTES = 20 * 1024 * 1024;

function safeFileName(value: unknown, contentType: string) {
  const fallback = `toy.${contentType.split("/")[1] || "jpg"}`;
  if (typeof value !== "string") return fallback;
  const clean = value
    .normalize("NFKC")
    .replace(/[^A-Za-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100);
  return clean || fallback;
}
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    if (!ALLOWED_TYPES.has(String(body.contentType))) {
      throw new ProductApiError(
        "unsupported_asset_type",
        "Upload a JPEG, PNG, WebP, or AVIF image",
        415
      );
    }
    if (!ASSET_ROLES.includes(body.role as AssetRole)) {
      throw new ProductApiError("invalid_asset_role", "Invalid asset role", 400);
    }
    const byteSize = Number(body.byteSize);
    if (!Number.isFinite(byteSize) || byteSize <= 0 || byteSize > MAX_UPLOAD_BYTES) {
      throw new ProductApiError(
        "invalid_asset_size",
        "Images must be no larger than 20 MB",
        413
      );
    }

    const session = await ensureSession();
    const store = getProductStore();
    if (!store.durable) {
      throw new ProductApiError(
        "cloud_storage_unavailable",
        "Cloud uploads need Supabase. Validation mode can still use an inline toy photo.",
        503,
        { persistence: store.mode }
      );
    }
    const projectId = typeof body.projectId === "string" ? body.projectId : undefined;
    await assertOwnedProject(store, session.id, projectId);
    const id = newProductId();
    const contentType = String(body.contentType);
    const fileName = safeFileName(body.fileName, contentType);
    const now = new Date().toISOString();
    const asset: ProductAsset = {
      id,
      ownerId: session.id,
      projectId: projectId ?? null,
      role: body.role as AssetRole,
      fileName,
      contentType,
      byteSize,
      storageBucket: process.env.SUPABASE_ASSETS_BUCKET || "pikbo-assets",
      storagePath: `${session.id}/inputs/${id}/${fileName}`,
      status: "pending",
      createdAt: now,
      updatedAt: now,
    };
    const saved = await store.createAsset(asset);
    const upload = await store.createSignedUpload(saved);
    return Response.json(
      { asset: saved, upload, persistence: store.mode, persisted: true },
      { status: 201 }
    );
  } catch (error) {
    return productErrorResponse(error);
  }
}
