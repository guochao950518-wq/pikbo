import { NextResponse } from "next/server";
import { ensureSession } from "@/lib/session";
import { getJob, toPublicJob } from "@/lib/generationJobs";

export const runtime = "nodejs";

type Props = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Props) {
  const { id } = await params;
  const session = await ensureSession();
  const job = getJob(id);
  if (!job || job.sessionId !== session.id) {
    return NextResponse.json(
      {
        ok: false,
        code: "NOT_FOUND",
        id,
        message:
          "No job in this session's local ledger. Soft-launch records jobs after POST /api/generate.",
      },
      { status: 404 }
    );
  }
  return NextResponse.json({
    ok: true,
    mode: "local-memory",
    durable: false,
    job: toPublicJob(job, session.id),
  });
}
