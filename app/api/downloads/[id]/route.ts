import { NextResponse } from "next/server";
import { ensureSession } from "@/lib/session";
import { findJobByRequestOrId, sweepTimedOutJobs } from "@/lib/generationJobs";
import { freeLiveDownloadBlockReason } from "@/lib/createTrust";

export const runtime = "nodejs";

type Props = { params: Promise<{ id: string }> };

/**
 * Phase E gate — controlled download authorization.
 * Free live raw provider URLs are never returned (T6 still blocked for bake).
 * Cached demos and paid (no watermark) may redirect to the known output URL.
 * Accepts job id or provider requestId (Create/Library may store either).
 */
export async function GET(_req: Request, { params }: Props) {
  const { id } = await params;
  const session = await ensureSession();
  sweepTimedOutJobs();
  const job = findJobByRequestOrId(id);
  if (!job || job.sessionId !== session.id) {
    return NextResponse.json(
      { ok: false, code: "NOT_FOUND", error: "Download not found for this session" },
      { status: 404 }
    );
  }
  if (job.status !== "succeeded" || !job.videoUrl) {
    return NextResponse.json(
      {
        ok: false,
        code: "NOT_READY",
        error: "Job has no successful deliverable",
        status: job.status,
      },
      { status: 409 }
    );
  }
  if (!job.downloadAllowed) {
    return NextResponse.json(
      {
        ok: false,
        code: "DOWNLOAD_BLOCKED",
        error: freeLiveDownloadBlockReason(),
        t6: "blocked",
        watermark: job.watermark,
        demo: job.demo,
      },
      { status: 403 }
    );
  }
  // Redirect to the allowed URL (demo assets or paid deliverable).
  // Free live never reaches here. Provider raw is not rewritten to a bake yet.
  return NextResponse.redirect(job.videoUrl, 302);
}
