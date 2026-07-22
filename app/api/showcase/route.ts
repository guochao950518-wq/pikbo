import { SHOWCASE_PROJECTS } from "@/lib/showcase";

export const dynamic = "force-static";

export function GET() {
  return Response.json({ projects: SHOWCASE_PROJECTS });
}
