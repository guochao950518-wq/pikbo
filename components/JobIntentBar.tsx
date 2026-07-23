"use client";

import Link from "next/link";
import { JOB_INTENTS, type JobIntentId } from "@/lib/jobIntents";

/**
 * Outcome-first chips — pick a job, not a model name.
 */
export function JobIntentBar({
  activeId,
  onPick,
}: {
  activeId?: JobIntentId | null;
  onPick: (id: JobIntentId) => void;
}) {
  return (
    <div className="border-b border-white/10 bg-black/40 px-4 py-3">
      <div className="mx-auto max-w-6xl">
        <p className="text-[10px] font-bold uppercase tracking-wider text-white/45">
          What are you making? · one tap
        </p>
        <div className="mt-2 flex gap-2 overflow-x-auto pb-0.5 [scrollbar-width:none]">
          {JOB_INTENTS.map((job) => {
            if (job.href) {
              return (
                <Link
                  key={job.id}
                  href={job.href}
                  className="shrink-0 rounded-full border border-[var(--mint)]/35 bg-[var(--mint)]/[0.08] px-3 py-1.5 text-left transition hover:border-[var(--mint)]"
                >
                  <span className="block text-[11px] font-bold text-[var(--mint)]">
                    {job.label}
                  </span>
                  <span className="block max-w-[10rem] text-[10px] text-white/50">
                    {job.blurb}
                  </span>
                </Link>
              );
            }
            const active = activeId === job.id;
            return (
              <button
                key={job.id}
                type="button"
                onClick={() => onPick(job.id)}
                className={`shrink-0 rounded-full border px-3 py-1.5 text-left transition ${
                  active
                    ? "border-[var(--mint)] bg-[var(--mint)]/15 text-[var(--mint)]"
                    : "border-white/15 text-white/75 hover:border-white/30"
                }`}
              >
                <span className="block text-[11px] font-bold">{job.label}</span>
                <span className="block max-w-[10rem] text-[10px] opacity-70">
                  {job.blurb}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
