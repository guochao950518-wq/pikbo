import { NextResponse } from "next/server";
import { ensureSession, publicSession } from "@/lib/session";

export const runtime = "nodejs";

export async function GET() {
  const session = await ensureSession();
  return NextResponse.json(publicSession(session));
}
