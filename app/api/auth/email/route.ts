import { NextResponse } from "next/server";
import {
  authenticateWithEmail,
  supabaseAuthConfigured,
} from "@/lib/supabaseAuth";
import { currentPeriodKey, saveSession } from "@/lib/session";
import { getPlan } from "@/lib/pricing";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!supabaseAuthConfigured()) {
    return NextResponse.json(
      { error: "Cloud accounts are not configured in this preview" },
      { status: 503 }
    );
  }
  let body: { mode?: string; email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const mode = body.mode === "signup" ? "signup" : "login";
  const email = body.email?.trim().toLowerCase() ?? "";
  const password = body.password ?? "";
  if (!/^\S+@\S+\.\S+$/.test(email) || password.length < 8) {
    return NextResponse.json(
      { error: "Enter a valid email and a password of at least 8 characters" },
      { status: 400 }
    );
  }
  try {
    const result = await authenticateWithEmail({ mode, email, password });
    if (result.user && !result.confirmationRequired) {
      const free = getPlan("free");
      await saveSession({
        id: result.user.id,
        plan: "free",
        credits: free.credits,
        periodKey: currentPeriodKey(),
      });
    }
    return NextResponse.json({
      ok: true,
      user: result.user ? { id: result.user.id, email: result.user.email } : null,
      confirmationRequired: result.confirmationRequired,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Authentication failed" },
      { status: 401 }
    );
  }
}
