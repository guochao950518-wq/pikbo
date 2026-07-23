import { NextResponse } from "next/server";
import { getSupabaseAnonServer } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { site } from "@/lib/site";

export const runtime = "nodejs";

/**
 * Send email magic link via Supabase Auth.
 * Requires SUPABASE_URL + anon key. Redirects to /auth/callback.
 */
export async function POST(req: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        code: "NOT_CONFIGURED",
        error: "Supabase is not configured on this server",
      },
      { status: 503 }
    );
  }

  let email = "";
  try {
    const body = (await req.json()) as { email?: string };
    email = typeof body.email === "string" ? body.email.trim() : "";
  } catch {
    return NextResponse.json(
      { ok: false, code: "INVALID_REQUEST", error: "Expected JSON { email }" },
      { status: 400 }
    );
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { ok: false, code: "INVALID_EMAIL", error: "Enter a valid email" },
      { status: 400 }
    );
  }

  const supabase = getSupabaseAnonServer();
  if (!supabase) {
    return NextResponse.json(
      { ok: false, code: "CLIENT_ERROR", error: "Could not init Supabase" },
      { status: 500 }
    );
  }

  const origin =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    process.env.SITE_URL?.replace(/\/$/, "") ||
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL.replace(/\/$/, "")}`
      : null) ||
    "http://localhost:3000";

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      shouldCreateUser: true,
    },
  });

  if (error) {
    // Do not leak internals; common cause: email auth disabled / SMTP not set
    console.error("[auth/magic-link]", error.message);
    return NextResponse.json(
      {
        ok: false,
        code: "SUPABASE_AUTH_ERROR",
        error:
          error.message.includes("Error sending") ||
          error.message.toLowerCase().includes("smtp")
            ? "Could not send email. In Supabase Dashboard enable Email auth and check SMTP / rate limits."
            : error.message.slice(0, 160),
      },
      { status: 502 }
    );
  }

  return NextResponse.json({
    ok: true,
    message: `If the address is valid, a magic link is on the way. Check spam too. (${site.name})`,
    email,
  });
}
