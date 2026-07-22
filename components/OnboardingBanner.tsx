"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const KEY = "pikbo_onboard_v1";

export function OnboardingBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Defer localStorage read to avoid sync setState-in-effect (React 19 lint)
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
    <div className="border-b border-[var(--border)] bg-[var(--bg-soft)] px-4 py-2.5 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
        <div className="text-sm">
          <span className="font-semibold text-[var(--mint)]">Tip</span>
          <span className="text-[var(--fg-muted)]">
            {" "}
            — scroll videos, tap any clip to remake with your toy photo
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/create"
            onClick={dismiss}
            className="btn btn-primary px-3 py-1.5 text-xs"
          >
            Start free
          </Link>
          <button
            type="button"
            onClick={dismiss}
            className="text-xs text-[var(--fg-dim)] hover:text-[var(--fg)]"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
