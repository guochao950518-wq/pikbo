"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { PublicSession } from "@/lib/session";
import { CREDITS_PER_VIDEO } from "@/lib/pricing";
import { loadHistory } from "@/lib/history";
import { SESSION_EVENT } from "@/lib/sessionEvents";

type AuthState = {
  configured: boolean;
  authenticated: boolean;
  user: { id: string; email?: string } | null;
};

export function ProfilePanel() {
  const [session, setSession] = useState<PublicSession | null>(null);
  const [clips, setClips] = useState(0);
  const [billingBusy, setBillingBusy] = useState(false);
  const [billingError, setBillingError] = useState<string | null>(null);
  const [auth, setAuth] = useState<AuthState | null>(null);

  useEffect(() => {
    let active = true;
    function refresh() {
      fetch("/api/me")
        .then((r) => r.json())
        .then((data: PublicSession) => {
          if (active) setSession(data);
        })
        .catch(() => {});
      fetch("/api/auth/session")
        .then((response) => response.json())
        .then((data: AuthState) => {
          if (active) setAuth(data);
        })
        .catch(() => {});
      setClips(loadHistory().length);
    }
    const t = window.setTimeout(refresh, 0);
    window.addEventListener(SESSION_EVENT, refresh);
    return () => {
      active = false;
      window.clearTimeout(t);
      window.removeEventListener(SESSION_EVENT, refresh);
    };
  }, []);

  async function openBillingPortal() {
    setBillingBusy(true);
    setBillingError(null);
    try {
      const response = await fetch("/api/billing/portal", { method: "POST" });
      const data = await response.json();
      if (!response.ok || !data.url) {
        throw new Error(data.error || "Could not open billing portal");
      }
      window.location.href = data.url;
    } catch (error) {
      setBillingError(
        error instanceof Error ? error.message : "Could not open billing portal"
      );
      setBillingBusy(false);
    }
  }

  async function signOut() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  }

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
            {auth?.user?.email || (session ? `${session.planName} creator` : "Guest creator")}
          </p>
          <p className="text-xs text-[var(--fg-dim)]">
            {auth?.authenticated
              ? "Cloud account · credits and jobs follow this identity"
              : "Guest validation workspace · this browser only"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 border-t border-[var(--border)] pt-4 text-center">
        <div className="rounded-xl bg-[var(--bg-soft)] py-3">
          <p className="text-lg font-bold text-[var(--mint)]">
            {session?.credits ?? "—"}
          </p>
          <p className="text-[10px] text-[var(--fg-dim)]">credits</p>
        </div>
        <div className="rounded-xl bg-[var(--bg-soft)] py-3">
          <p className="text-lg font-bold">
            {session
              ? Math.floor(session.credits / CREDITS_PER_VIDEO)
              : "—"}
          </p>
          <p className="text-[10px] text-[var(--fg-dim)]">clips left</p>
        </div>
        <div className="rounded-xl bg-[var(--bg-soft)] py-3">
          <p className="text-lg font-bold">{clips}</p>
          <p className="text-[10px] text-[var(--fg-dim)]">in library</p>
        </div>
      </div>

      <p className="text-xs text-[var(--fg-muted)]">
        Free tier uses watermarked Seedance Fast at 480p. Paid 720p access and
        billing remain in test mode until the pre-launch checks pass.
      </p>

      <div className="flex flex-col gap-2">
        {session?.plan !== "free" ? (
          <button
            type="button"
            onClick={openBillingPortal}
            disabled={billingBusy}
            className="btn btn-primary w-full text-sm disabled:opacity-60"
          >
            {billingBusy ? "Opening test billing…" : "Manage test billing"}
          </button>
        ) : (
          <Link href="/pricing" className="btn btn-primary w-full text-sm">
            Review test plans
          </Link>
        )}
        {billingError && (
          <p className="text-center text-xs text-[var(--brand)]">{billingError}</p>
        )}
        <Link href="/library" className="btn btn-ghost w-full text-sm">
          Open library
        </Link>
        <Link href="/create" className="btn btn-ghost w-full text-sm">
          Generate a clip
        </Link>
        {auth?.authenticated ? (
          <button type="button" onClick={signOut} className="text-xs text-[var(--fg-dim)] hover:text-white">
            Sign out
          </button>
        ) : auth?.configured ? (
          <Link href="/login" className="text-center text-xs text-[var(--mint)] hover:underline">
            Sign in for cross-device sync
          </Link>
        ) : (
          <p className="text-center text-[10px] text-[var(--fg-dim)]">
            Cloud accounts are disabled in this private preview.
          </p>
        )}
      </div>
    </div>
  );
}
