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

  const items: Array<{ key: keyof ActivationState; label: string; ok: boolean }> =
    [
      { key: "choseJob", label: "Pick a job (Etsy / TikTok / reveal…)", ok: state.choseJob },
      { key: "addedPhoto", label: "Add your toy photo", ok: state.addedPhoto },
      { key: "generated", label: "Generate one clip", ok: state.generated },
      {
        key: "savedOrShared",
        label: "Download, copy link, or open Library",
        ok: state.savedOrShared,
      },
    ];

  return (
    <div className="border-b border-white/10 bg-white/[0.03] px-4 py-2.5">
      <div className="mx-auto flex max-w-6xl flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--mint)]">
            First clip · {done}/{total}
          </p>
          <ul className="mt-1 flex flex-wrap gap-x-4 gap-y-0.5 text-[11px] text-white/60">
            {items.map((it) => (
              <li key={it.key} className={it.ok ? "text-[var(--mint)]" : ""}>
                {it.ok ? "✓" : "○"} {it.label}
              </li>
            ))}
          </ul>
        </div>
        <button
          type="button"
          className="text-[10px] text-white/40 hover:text-white/70"
          onClick={() => setState(saveActivation({ dismissed: true }))}
        >
          Hide
        </button>
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
