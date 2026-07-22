import { ensureSession } from "@/lib/session";
import { getProductStore, newProductId } from "@/lib/product-store";
import { ProductApiError, productErrorResponse } from "@/lib/product-errors";

export const runtime = "nodejs";

export async function GET() {
  try {
    const session = await ensureSession();
    const store = getProductStore();
    const projects = await store.listProjects(session.id);
    return Response.json({
      projects,
      persistence: store.mode,
      persisted: store.durable,
    });
  } catch (error) {
    return productErrorResponse(error);
  }
}
export async function POST(request: Request) {
  try {
    const session = await ensureSession();
    const store = getProductStore();
    if (!store.durable) {
      throw new ProductApiError(
        "cloud_projects_unavailable",
        "Cloud projects need Supabase; local validation does not pretend to save across devices.",
        503,
        { persistence: store.mode }
      );
    }
    const body = (await request.json()) as { name?: unknown };
    const name = typeof body.name === "string" ? body.name.trim().slice(0, 80) : "";
    if (!name) {
      throw new ProductApiError("project_name_required", "Project name required", 400);
    }
    const now = new Date().toISOString();
    const project = await store.createProject({
      id: newProductId(),
      ownerId: session.id,
      name,
      createdAt: now,
      updatedAt: now,
    });
    return Response.json(
      { project, persistence: store.mode, persisted: true },
      { status: 201 }
    );
  } catch (error) {
    return productErrorResponse(error);
  }
}
