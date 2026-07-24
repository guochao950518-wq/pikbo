"use client";

import { useEffect, useState } from "react";
import {
  activationProgress,
  loadActivation,
  saveActivation,
  type ActivationState,
} from "@/lib/activation";

/**
 * Lightweight activation checklist — not a multi-step tour.
 * Research: checklists + progressive disclosure beat slideshow tours.
 */
export function ActivationChecklist({
  hasImage,
  hasGenerated,
}: {
  hasImage: boolean;
  hasGenerated: boolean;
}) {
  const [state, setState] = useState<ActivationState | null>(null);

  useEffect(() => {
    const t = window.setTimeout(() => {
      let s = loadActivation();
      if (hasImage && !s.addedPhoto) s = saveActivation({ addedPhoto: true });
      if (hasGenerated && !s.generated) s = saveActivation({ generated: true });
      setState(s);
    }, 0);
    return () => window.clearTimeout(t);
  }, [hasImage, hasGenerated]);

  if (!state || state.dismissed) return null;
  const { done, total, complete } = activationProgress(state);
  if (complete) return null;
  const pct = Math.round((done / total) * 100);

  const items: Array<{ key: keyof ActivationState; label: string; ok: boolean }> =
    [
      { key: "choseJob", label: "Pick a job", ok: state.choseJob },
      { key: "addedPhoto", label: "Add photo", ok: state.addedPhoto },
      { key: "generated", label: "Generate", ok: state.generated },
      {
        key: "savedOrShared",
        label: "Save / share",
        ok: state.savedOrShared,
      },
    ];

  return (
    <div className="border-b border-white/10 bg-gradient-to-r from-[var(--mint)]/[0.06] to-transparent px-4 py-2.5">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--mint)]">
            First clip · {done}/{total}
          </p>
          <button
            type="button"
            className="text-[10px] text-white/40 hover:text-white/70"
            onClick={() => setState(saveActivation({ dismissed: true }))}
          >
            Hide
          </button>
        </div>
        <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-[var(--mint)] transition-all duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>
        <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-0.5 text-[11px] text-white/55">
          {items.map((it) => (
            <li
              key={it.key}
              className={it.ok ? "font-semibold text-[var(--mint)]" : ""}
            >
              {it.ok ? "✓" : "○"} {it.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function markActivationShared() {
  saveActivation({ savedOrShared: true });
}

export function markActivationJob() {
  saveActivation({ choseJob: true });
}
