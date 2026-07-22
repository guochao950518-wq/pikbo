"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { PublicSession } from "@/lib/session";
import { CREDITS_PER_VIDEO } from "@/lib/pricing";
import { loadHistory } from "@/lib/history";

export function ProfilePanel() {
  const [session, setSession] = useState<PublicSession | null>(null);
  const [clips, setClips] = useState(0);

  useEffect(() => {
    fetch("/api/me")
      .then((r) => r.json())
      .then((d: PublicSession) => setSession(d))
      .catch(() => {});
    const t = window.setTimeout(() => {
      setClips(loadHistory().length);
    }, 0);
    return () => window.clearTimeout(t);
  }, []);

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
            {session ? `${session.planName} creator` : "Guest creator"}
          </p>
          <p className="text-xs text-[var(--fg-dim)]">
            Cookie session · multi-device login later
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
        Free tier uses Seedance Fast + watermark. Upgrade for HD Seedance 2.0
        and commercial listings.
      </p>

      <div className="flex flex-col gap-2">
        <Link href="/pricing" className="btn btn-primary w-full text-sm">
          Manage plan
        </Link>
        <Link href="/library" className="btn btn-ghost w-full text-sm">
          Open library
        </Link>
        <Link href="/create" className="btn btn-ghost w-full text-sm">
          Generate a clip
        </Link>
      </div>
    </div>
  );
}
