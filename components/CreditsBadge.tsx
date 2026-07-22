"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { PublicSession } from "@/lib/session";

export function CreditsBadge() {
  const [session, setSession] = useState<PublicSession | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/me")
      .then((r) => r.json())
      .then((data: PublicSession) => {
        if (!cancelled) setSession(data);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  if (!session) {
    return (
      <span className="hidden text-xs text-[var(--fg-dim)] sm:inline">…</span>
    );
  }

  return (
    <Link
      href="/pricing"
      className="hidden items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-soft)] px-3 py-1.5 text-xs font-medium text-[var(--fg-muted)] transition-colors hover:border-[var(--brand)] hover:text-[var(--fg)] sm:flex"
      title={`${session.planName} plan · ${session.credits} credits`}
    >
      <span className="text-[var(--mint)]">{session.credits}</span>
      <span>credits</span>
      {session.plan !== "free" && (
        <span className="rounded-full bg-[var(--grad-soft)] px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-[var(--fg)]">
          {session.planName}
        </span>
      )}
    </Link>
  );
}
