"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const KEY = "pikbo_onboard_v3";

export function OnboardingBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => {
      try {
        if (!localStorage.getItem(KEY)) setShow(true);
      } catch {
        setShow(true);
      }
    }, 0);
    return () => window.clearTimeout(t);
  }, []);

  if (!show) return null;

  function dismiss() {
    try {
      localStorage.setItem(KEY, "1");
    } catch {
      // ignore
    }
    setShow(false);
  }

  return (
    <div className="border-b border-[var(--mint)]/20 bg-gradient-to-r from-[var(--mint)]/[0.08] via-black/80 to-black/90 px-4 py-2.5 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
        <div className="min-w-0 text-sm">
          <span className="font-bold text-[var(--mint)]">
            One photo · listing or social clip
          </span>
          <span className="text-white/55">
            {" "}
            — free Mini trial 5s · 480p when live is on · Modules for job packs
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/create?try=1&sample=scout"
            onClick={dismiss}
            className="btn btn-primary px-3.5 py-1.5 text-xs"
          >
            Try free · 10s
          </Link>
          <Link
            href="/modules"
            onClick={dismiss}
            className="btn btn-ghost px-3 py-1.5 text-xs"
          >
            Modules
          </Link>
          <button
            type="button"
            onClick={dismiss}
            className="text-xs text-white/40 hover:text-white/70"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
