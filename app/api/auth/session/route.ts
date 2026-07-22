import { NextResponse } from "next/server";
import { getSupabaseAuthUser, supabaseAuthConfigured } from "@/lib/supabaseAuth";

export const runtime = "nodejs";

export async function GET() {
  const user = await getSupabaseAuthUser();
  return NextResponse.json({
    configured: supabaseAuthConfigured(),
    authenticated: Boolean(user),
    user: user ? { id: user.id, email: user.email } : null,
  });
}
