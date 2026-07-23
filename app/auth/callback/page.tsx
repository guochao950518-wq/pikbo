"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getSupabaseBrowser } from "@/lib/supabase/browser";
import { emitSessionRefresh } from "@/lib/sessionEvents";

/**
 * Email magic-link lands here with ?code=...
 * Exchanges the code for a session, claims durable Free account + one-time
 * guest credit migration, then sends the user to Profile.
 */
export default function AuthCallbackPage() {
  const [status, setStatus] = useState<"working" | "ok" | "error">("working");
  const [detail, setDetail] = useState("Signing you in…");

  useEffect(() => {
    let cancelled = false;
    async function run() {
      const supabase = getSupabaseBrowser();
      if (!supabase) {
        if (!cancelled) {
          setStatus("error");
          setDetail(
            "Browser Supabase client not ready. Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set, then restart dev server."
          );
        }
        return;
      }
      try {
        // PKCE / code in query
        const url = new URL(window.location.href);
        const code = url.searchParams.get("code");
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;
        } else {
          // Hash tokens (implicit) — getSession reads them
          const { error } = await supabase.auth.getSession();
          if (error) throw error;
        }

        const { data: sessionData } = await supabase.auth.getSession();
        const token = sessionData.session?.access_token;
        if (token) {
          try {
            const claimRes = await fetch("/api/auth/claim", {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            });
            const claim = (await claimRes.json()) as {
              ok?: boolean;
              guestMigration?: { migratedCredits?: number; note?: string };
              error?: string;
            };
            if (claimRes.ok && claim.ok) {
              const n = claim.guestMigration?.migratedCredits ?? 0;
              if (!cancelled) {
                setDetail(
                  n > 0
                    ? `Signed in · migrated ${n} guest credits. Redirecting…`
                    : "Signed in · durable Free account ready. Redirecting…"
                );
              }
            }
          } catch {
            // Claim is best-effort; session still works for profile display.
          }
        }

        emitSessionRefresh();
        if (!cancelled) {
          setStatus("ok");
          setDetail((d) =>
            d.startsWith("Signed in") ? d : "Signed in. Redirecting…"
          );
          window.setTimeout(() => {
            window.location.replace("/profile");
          }, 700);
        }
      } catch (e) {
        if (!cancelled) {
          setStatus("error");
          setDetail(
            e instanceof Error ? e.message : "Could not complete sign-in"
          );
        }
      }
    }
    void run();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="mx-auto max-w-md px-4 py-16 text-center">
      <h1 className="font-display text-2xl font-black uppercase tracking-tight">
        {status === "ok"
          ? "Welcome back"
          : status === "error"
            ? "Sign-in issue"
            : "Almost there"}
      </h1>
      <p className="mt-3 text-sm text-[var(--fg-muted)]">{detail}</p>
      {status === "error" && (
        <Link
          href="/login"
          className="mt-6 inline-block text-[var(--mint)] hover:underline"
        >
          Back to sign in
        </Link>
      )}
    </main>
  );
}
