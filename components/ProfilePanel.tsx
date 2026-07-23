"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { loadHistory } from "@/lib/history";
import { fetchMe, isDemoMode, type MeResponse } from "@/lib/meClient";
import { CREDITS_PER_VIDEO } from "@/lib/pricing";
import { SESSION_EVENT } from "@/lib/sessionEvents";
import { getSupabaseBrowser } from "@/lib/supabase/browser";

type DurableClaim = {
  signedIn: boolean;
  email: string | null;
  availableCredits: number | null;
  migratedNote: string | null;
};

export function ProfilePanel() {
  const [session, setSession] = useState<MeResponse | null>(null);
  const [clips, setClips] = useState(0);
  const [auth, setAuth] = useState<DurableClaim>({
    signedIn: false,
    email: null,
    availableCredits: null,
    migratedNote: null,
  });
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    function refreshGuest() {
      void fetchMe().then((d) => {
        if (d) setSession(d);
      });
      setClips(loadHistory().length);
    }

    async function refreshAuth() {
      const supabase = getSupabaseBrowser();
      if (!supabase) {
        setAuth({
          signedIn: false,
          email: null,
          availableCredits: null,
          migratedNote: null,
        });
        return;
      }
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      const email = data.session?.user?.email ?? null;
      if (!token) {
        setAuth({
          signedIn: false,
          email: null,
          availableCredits: null,
          migratedNote: null,
        });
        return;
      }
      try {
        // Claim is idempotent — ensures wallet + one-time guest migrate.
        const res = await fetch("/api/auth/claim", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const body = (await res.json()) as {
          ok?: boolean;
          user?: { email?: string | null };
          wallet?: { availableCredits?: number };
          guestMigration?: { note?: string; migratedCredits?: number };
        };
        if (res.ok && body.ok) {
          setAuth({
            signedIn: true,
            email: body.user?.email ?? email,
            availableCredits:
              typeof body.wallet?.availableCredits === "number"
                ? body.wallet.availableCredits
                : null,
            migratedNote: body.guestMigration?.note ?? null,
          });
        } else {
          setAuth({
            signedIn: true,
            email,
            availableCredits: null,
            migratedNote: null,
          });
        }
      } catch {
        setAuth({
          signedIn: true,
          email,
          availableCredits: null,
          migratedNote: null,
        });
      }
    }

    function refresh() {
      refreshGuest();
      void refreshAuth();
    }

    const t = window.setTimeout(refresh, 0);
    window.addEventListener(SESSION_EVENT, refresh);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener(SESSION_EVENT, refresh);
    };
  }, []);

  async function signOut() {
    setSigningOut(true);
    try {
      const supabase = getSupabaseBrowser();
      await supabase?.auth.signOut();
      setAuth({
        signedIn: false,
        email: null,
        availableCredits: null,
        migratedNote: null,
      });
    } finally {
      setSigningOut(false);
    }
  }

  const perJob = session?.liveJobCredits ?? CREDITS_PER_VIDEO;
  const demo = isDemoMode(session);
  const displayCredits =
    auth.signedIn && auth.availableCredits !== null
      ? auth.availableCredits
      : session?.credits;

  return (
    <div className="card mt-8 space-y-4 p-6">
      <div className="flex items-center gap-3">
        <div
          className="grid h-14 w-14 place-items-center rounded-full text-xl"
          style={{ background: "var(--grad)" }}
        >
          🧸
        </div>
        <div>
          <p className="font-semibold">
            {auth.signedIn
              ? auth.email || "Signed-in creator"
              : session
                ? `${session.planName} creator`
                : "Guest creator"}
          </p>
          <p className="text-xs text-[var(--fg-dim)]">
            {auth.signedIn
              ? "Supabase account · durable Free wallet (local ledger until Postgres migration)"
              : "Guest cookie · this device only"}
            {demo ? " · demo-cached mode" : ""}
          </p>
        </div>
      </div>

      {auth.signedIn && auth.migratedNote ? (
        <p className="rounded-xl border border-[var(--mint)]/25 bg-[var(--mint)]/[0.06] px-3 py-2 text-[11px] leading-relaxed text-[var(--fg-muted)]">
          {auth.migratedNote}
        </p>
      ) : null}

      <div className="grid grid-cols-3 gap-2 border-t border-[var(--border)] pt-4 text-center">
        <div className="rounded-xl bg-[var(--bg-soft)] py-3">
          <p className="text-lg font-bold text-[var(--mint)]">
            {displayCredits ?? "—"}
          </p>
          <p className="text-[10px] text-[var(--fg-dim)]">
            {auth.signedIn ? "durable cr." : "credits"}
          </p>
        </div>
        <div className="rounded-xl bg-[var(--bg-soft)] py-3">
          <p className="text-lg font-bold">
            {displayCredits !== undefined && displayCredits !== null
              ? Math.floor(Number(displayCredits) / perJob)
              : "—"}
          </p>
          <p className="text-[10px] text-[var(--fg-dim)]">live jobs est.</p>
        </div>
        <div className="rounded-xl bg-[var(--bg-soft)] py-3">
          <p className="text-lg font-bold">{clips}</p>
          <p className="text-[10px] text-[var(--fg-dim)]">in library</p>
        </div>
      </div>

      <p className="text-xs text-[var(--fg-muted)]">
        {auth.signedIn
          ? "Generate still debits the guest cookie this soft-launch cycle. Durable wallet is reserved/settled in shadow when DURABLE_CREDITS=local; Supabase SQL migration remains the production store."
          : demo
            ? "Server is in demo-cached mode — labeled Lab clips cost 0 credits. Configure FAL_KEY for live Seedance Mini."
            : "Free live jobs use Seedance Mini at 480p with an on-player mark. Paid plans use the 720p path and include commercial listings."}
      </p>

      <div className="flex flex-col gap-2">
        <Link href="/create" className="btn btn-primary w-full text-sm">
          Open Generate
        </Link>
        <div className="grid grid-cols-2 gap-2">
          <Link href="/modules" className="btn btn-ghost w-full text-sm">
            Modules
          </Link>
          <Link
            href="/create?mode=seller-pack"
            className="btn btn-ghost w-full text-sm"
          >
            Seller Pack
          </Link>
        </div>
        {!auth.signedIn ? (
          <Link href="/login" className="btn btn-ghost w-full text-sm">
            Sign in · cross-device later
          </Link>
        ) : (
          <button
            type="button"
            disabled={signingOut}
            onClick={() => void signOut()}
            className="btn btn-ghost w-full text-sm disabled:opacity-50"
          >
            {signingOut ? "Signing out…" : "Sign out"}
          </button>
        )}
        <Link href="/library" className="btn btn-ghost w-full text-sm">
          Open library · {clips} clip{clips === 1 ? "" : "s"}
        </Link>
        <Link href="/pricing" className="btn btn-ghost w-full text-sm">
          Manage plan
        </Link>
        <Link href="/settings" className="btn btn-ghost w-full text-sm">
          Settings
        </Link>
      </div>
    </div>
  );
}
