"use client";

import Link from "next/link";
import { useMemo } from "react";
import type { Preset } from "@/lib/presets";
import { DEMO_VIDEOS } from "@/lib/demoVideos";
import { AutoPlayVideo } from "@/components/AutoPlayVideo";
import { createRemixHref } from "@/lib/remixIntent";

/** Exact Lab examples and shared concept backdrops are labeled separately. */
export function PresetPreviewCard({ preset }: { preset: Preset }) {
  const { demo, exact } = useMemo(() => {
    const exact = DEMO_VIDEOS.find((d) => d.preset === preset.slug);
    if (exact) return { demo: exact, exact: true };
    const idx = Math.abs(
      preset.slug.split("").reduce((a, c) => a + c.charCodeAt(0), 0)
    );
    return { demo: DEMO_VIDEOS[idx % DEMO_VIDEOS.length], exact: false };
  }, [preset.slug]);

  return (
    <Link
      href={createRemixHref(preset.slug, exact ? demo.id : undefined)}
      className="video-tile group block overflow-hidden"
    >
      <div className="relative aspect-[3/4]">
        <AutoPlayVideo
          poster={demo.poster}
          webm={demo.webm}
          mp4={demo.mp4}
          focusable={false}
          className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
        <span
          className={`absolute right-2 top-2 rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-wider ${
            exact
              ? "bg-[var(--mint)] text-black shadow-[0_0_16px_rgba(200,255,61,0.35)]"
              : "border border-white/15 bg-black/60 text-white/70"
          }`}
        >
          {exact ? "Lab proof" : "Concept"}
        </span>
        <div className="absolute inset-x-0 bottom-0 p-3">
          <p className="text-[13px] font-bold leading-snug text-white">
            {preset.emoji} {preset.name}
          </p>
          <p className="mt-0.5 line-clamp-2 text-[11px] text-white/60">
            {preset.tagline}
          </p>
          <p className="mt-2 inline-flex items-center gap-1 rounded-full bg-[var(--mint)]/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[var(--mint)] ring-1 ring-[var(--mint)]/25 opacity-90 transition group-hover:bg-[var(--mint)] group-hover:text-black group-hover:opacity-100">
            Remake →
          </p>
        </div>
      </div>
    </Link>
  );
}
