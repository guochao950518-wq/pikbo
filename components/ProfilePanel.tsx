"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { loadHistory } from "@/lib/history";
import { fetchMe, isDemoMode, type MeResponse } from "@/lib/meClient";
import { CREDITS_PER_VIDEO } from "@/lib/pricing";
import { SESSION_EVENT } from "@/lib/sessionEvents";

export function ProfilePanel() {
  const [session, setSession] = useState<MeResponse | null>(null);
  const [clips, setClips] = useState(0);

  useEffect(() => {
    function refresh() {
      void fetchMe().then((d) => {
        if (d) setSession(d);
      });
      setClips(loadHistory().length);
    }
    const t = window.setTimeout(refresh, 0);
    window.addEventListener(SESSION_EVENT, refresh);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener(SESSION_EVENT, refresh);
    };
  }, []);

  const perJob = session?.liveJobCredits ?? CREDITS_PER_VIDEO;
  const demo = isDemoMode(session);

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
            {demo ? " · demo-cached mode" : ""}
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
            {session ? Math.floor(session.credits / perJob) : "—"}
          </p>
          <p className="text-[10px] text-[var(--fg-dim)]">live jobs est.</p>
        </div>
        <div className="rounded-xl bg-[var(--bg-soft)] py-3">
          <p className="text-lg font-bold">{clips}</p>
          <p className="text-[10px] text-[var(--fg-dim)]">in library</p>
        </div>
      </div>

      <p className="text-xs text-[var(--fg-muted)]">
        {demo
          ? "Server is in demo-cached mode — labeled Lab clips cost 0 credits. Configure FAL_KEY for live Seedance Mini."
          : "Free live jobs use Seedance Mini at 480p with an on-player mark. Paid plans use the 720p path and include commercial listings."}
      </p>

      <div className="flex flex-col gap-2">
        <Link href="/pricing" className="btn btn-primary w-full text-sm">
          Manage plan
        </Link>
        <Link href="/library" className="btn btn-ghost w-full text-sm">
          Open library
        </Link>
        <Link href="/settings" className="btn btn-ghost w-full text-sm">
          Settings
        </Link>
      </div>
    </div>
  );
}
