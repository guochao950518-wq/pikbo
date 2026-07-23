import { NextResponse } from "next/server";

export const runtime = "nodejs";

type Props = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Props) {
  const { id } = await params;
  return NextResponse.json(
    {
      ok: false,
      code: "NOT_IMPLEMENTED",
      phase: "D",
      id,
      message:
        "Job status polling is not live yet. Soft-launch results return inline from /api/generate.",
    },
    { status: 501 }
  );
}
