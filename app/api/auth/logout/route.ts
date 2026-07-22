import { NextResponse } from "next/server";
import { clearSupabaseAuth } from "@/lib/supabaseAuth";
import { clearSession } from "@/lib/session";

export const runtime = "nodejs";

export async function POST(request: Request) {
  await clearSupabaseAuth();
  await clearSession();
  return NextResponse.json({ ok: true, redirect: new URL("/", request.url).pathname });
}
