"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  displayCredits,
  fetchMe,
  isDemoMode,
  type MeResponse,
} from "@/lib/meClient";
import { CREDITS_PER_VIDEO } from "@/lib/pricing";
import { SESSION_EVENT } from "@/lib/sessionEvents";

export function CreditsBadge({ compact }: { compact?: boolean }) {
  const [session, setSession] = useState<MeResponse | null>(null);

  const load = useCallback(() => {
    void fetchMe().then((data) => {
      if (data) setSession(data);
    });
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
      <span
        className={
          compact
            ? "text-[10px] text-white/30"
            : "hidden text-xs text-[var(--fg-dim)] sm:inline"
        }
      >
        …
      </span>
    );
  }

  const credits = displayCredits(session);
  const perJob = session.liveJobCredits ?? CREDITS_PER_VIDEO;
  const clips = Math.floor(credits / perJob);
  const low = credits < perJob;
  const demo = isDemoMode(session);
  const signed = Boolean(session.signedIn && session.durable);

  if (compact) {
    return (
      <Link
        href={signed ? "/profile" : "/pricing"}
        className={`grid h-8 min-w-8 place-items-center rounded-full border px-1.5 text-[10px] font-bold ${
          low && !demo
            ? "border-amber-400/50 text-amber-300"
            : "border-white/10 text-[var(--mint)]"
        }`}
        title={
          demo
            ? `${credits} credits · demo-cached free`
            : signed
              ? `${credits} durable shadow · cookie still generates`
              : `${credits} credits`
        }
      >
        {credits}
      </Link>
    );
  }

  return (
    <Link
      href={signed ? "/profile" : "/pricing"}
      className={`hidden items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors sm:flex ${
        low && !demo
          ? "border-[var(--brand)]/50 bg-[var(--grad-soft)] text-[var(--fg)]"
          : "border-[var(--border)] bg-white/5 text-[var(--fg-muted)] hover:border-white/20 hover:text-[var(--fg)]"
      }`}
      title={
        demo
          ? `${session.planName} · demo-cached · live needs ${perJob} credits each`
          : signed
            ? `Signed-in · durable shadow ${credits} cr · ~${clips} live · cookie still authoritative for generate`
            : `${session.planName} · ${credits} credits · ~${clips} live jobs`
      }
    >
      <span
        className={
          low && !demo ? "text-[var(--brand)]" : "text-[var(--mint)]"
        }
      >
        {credits}
      </span>
      <span>credits</span>
      {demo ? (
        <span className="rounded-full bg-white/10 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-[var(--fg-dim)]">
          demo
        </span>
      ) : signed ? (
        <span className="rounded-full bg-[var(--mint)]/15 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-[var(--mint)]">
          account
        </span>
      ) : low ? (
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
