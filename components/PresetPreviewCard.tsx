"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Preset } from "@/lib/presets";
import { DEMO_VIDEOS } from "@/lib/demoVideos";

/**
 * A preset can show video only when the Lab registry explicitly maps that clip
 * to the same preset. Unmatched presets remain visual recipe concepts.
 */
export function PresetPreviewCard({ preset }: { preset: Preset }) {
  const demo = DEMO_VIDEOS.find((item) => item.preset === preset.slug);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  const play = () => {
    if (!reducedMotion) videoRef.current?.play().catch(() => undefined);
  };
  const pause = () => videoRef.current?.pause();
  const hasVerifiedClip = Boolean(demo && !failed);

  return (
    <article
      className="group min-w-0"
      onMouseEnter={play}
      onMouseLeave={pause}
      onFocus={play}
      onBlur={pause}
    >
      <Link
        href={`/effects/${preset.slug}`}
        className="block overflow-hidden rounded-xl border border-white/10 bg-[#0c0b10] transition duration-300 hover:-translate-y-0.5 hover:border-white/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--lime)]"
      >
        <div
          className="relative grid aspect-[3/4] place-items-center overflow-hidden text-4xl"
          style={{ background: preset.gradient }}
        >
          {demo && !failed ? (
            <video
              ref={videoRef}
              muted
              loop
              playsInline
              preload="none"
              poster={demo.poster}
              onError={() => setFailed(true)}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.025]"
            >
              <source src={demo.webm} type="video/webm" />
              <source src={demo.mp4} type="video/mp4" />
            </video>
          ) : (
            <div className="grid h-full w-full place-items-center bg-black/10">
              <span className="drop-shadow-lg transition-transform duration-300 group-hover:scale-110">
                {preset.emoji}
              </span>
            </div>
          )}

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/5 to-transparent" />
          <span
            className={`absolute right-2 top-2 rounded-full px-2 py-1 text-[9px] font-black uppercase tracking-[0.12em] ${
              hasVerifiedClip
                ? "bg-[var(--lime)] text-black"
                : "border border-white/15 bg-black/55 text-white/75 backdrop-blur"
            }`}
          >
            {hasVerifiedClip ? "Verified Lab clip" : "Concept recipe"}
          </span>

          <span className="absolute inset-x-0 bottom-0 px-3 pb-3 pt-12 text-left">
            <span className="block text-sm font-bold text-white">
              {preset.name}
            </span>
            <span className="mt-1 block line-clamp-2 text-[11px] leading-4 text-white/65">
              {preset.tagline}
            </span>
            <span className="mt-2 flex items-center justify-between text-[9px] font-bold uppercase tracking-[0.12em] text-white/45">
              <span>
                {preset.duration}s · {preset.aspectRatio}
              </span>
              <span className="text-[var(--lime)] opacity-0 transition-opacity group-hover:opacity-100">
                Details →
              </span>
            </span>
          </span>
        </div>
      </Link>

      <div className="mt-2 flex items-center justify-between gap-2 px-1 text-[10px]">
        <span className="truncate text-white/35">
          {hasVerifiedClip ? "Exact preset match" : "No validated clip yet"}
        </span>
        <Link
          href={`/create?effect=${preset.slug}`}
          className="shrink-0 font-semibold text-[var(--lime)] hover:text-white"
        >
          Use recipe →
        </Link>
      </div>
    </article>
  );
}
