import { getShowcaseProject } from "@/lib/showcase";

export const dynamic = "force-static";

export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;
  const project = getShowcaseProject(slug);

  if (!project) {
    return Response.json(
      { error: "showcase_not_found", message: "Showcase project not found" },
      { status: 404 }
    );
  }

  return Response.json({ project });
}
