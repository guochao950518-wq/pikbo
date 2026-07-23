import { NextResponse } from "next/server";

export const runtime = "nodejs";

type Props = { params: Promise<{ id: string }> };

/** Phase D — retry a durable job without re-quoting siblings. */
export async function POST(_req: Request, { params }: Props) {
  const { id } = await params;
  return NextResponse.json(
    {
      ok: false,
      code: "NOT_IMPLEMENTED",
      phase: "D",
      id,
      message:
        "Durable job retry is not live. Soft-launch: retry from Create / Seller Pack UI (new quote for that child only).",
    },
    { status: 501 }
  );
}
