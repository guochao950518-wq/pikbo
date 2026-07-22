"use client";

import { useEffect, useState } from "react";

type Health = {
  ok: boolean;
  fal: boolean;
  stripe: boolean;
};

/** Small pill: demo vs live generation backend */
export function StatusBadge() {
  const [h, setH] = useState<Health | null>(null);

  useEffect(() => {
    const t = window.setTimeout(() => {
      fetch("/api/health")
        .then((r) => r.json())
        .then((d) => setH(d))
        .catch(() => setH({ ok: false, fal: false, stripe: false }));
    }, 0);
    return () => window.clearTimeout(t);
  }, []);

  if (!h) return null;

  return (
    <div className="flex flex-wrap gap-1.5 text-[9px] font-bold uppercase tracking-wide">
      <span
        className={`rounded-full px-2 py-0.5 ${
          h.fal
            ? "bg-[var(--mint)]/15 text-[var(--mint)]"
            : "bg-white/10 text-[var(--fg-dim)]"
        }`}
      >
        {h.fal ? "Seedance live" : "Demo mode"}
      </span>
      {h.stripe && (
        <span className="rounded-full bg-[var(--brand)]/15 px-2 py-0.5 text-[var(--brand)]">
          Stripe on
        </span>
      )}
    </div>
  );
}
