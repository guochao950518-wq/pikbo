"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { PublicSession } from "@/lib/session";
import { CREDITS_PER_VIDEO } from "@/lib/pricing";
import { SESSION_EVENT } from "@/lib/sessionEvents";

export function CreditsBadge() {
  const [session, setSession] = useState<PublicSession | null>(null);

  const load = useCallback(() => {
    fetch("/api/me")
      .then((r) => r.json())
      .then((data: PublicSession) => setSession(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const t = window.setTimeout(load, 0);
    const onRefresh = () => load();
    window.addEventListener(SESSION_EVENT, onRefresh);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener(SESSION_EVENT, onRefresh);
    };
  }, [load]);

  if (!session) {
    return (
      <span className="hidden text-xs text-[var(--fg-dim)] sm:inline">…</span>
    );
  }

  const clips = Math.floor(session.credits / CREDITS_PER_VIDEO);
  const low = session.credits < CREDITS_PER_VIDEO;

  return (
    <Link
      href="/pricing"
      className={`hidden items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors sm:flex ${
        low
          ? "border-[var(--brand)]/50 bg-[var(--grad-soft)] text-[var(--fg)]"
          : "border-[var(--border)] bg-white/5 text-[var(--fg-muted)] hover:border-white/20 hover:text-[var(--fg)]"
      }`}
      title={`${session.planName} · ${session.credits} credits · ~${clips} clips`}
    >
      <span className={low ? "text-[var(--brand)]" : "text-[var(--mint)]"}>
        {session.credits}
      </span>
      <span>credits</span>
      {low ? (
        <span className="rounded-full bg-[var(--brand)]/20 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-[var(--brand)]">
          upgrade
        </span>
      ) : session.plan !== "free" ? (
        <span className="rounded-full bg-[var(--grad-soft)] px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-[var(--fg)]">
          {session.planName}
        </span>
      ) : (
        <span className="text-[10px] text-[var(--fg-dim)]">~{clips}</span>
      )}
    </Link>
  );
}
