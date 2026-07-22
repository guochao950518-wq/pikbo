"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef } from "react";
import type { Preset } from "@/lib/presets";
import { DEMO_VIDEOS } from "@/lib/demoVideos";

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

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) video.play().catch(() => undefined);
        else video.pause();
      },
      { threshold: 0.4 }
    );
    io.observe(video);
    return () => io.disconnect();
  }, [demo.id]);

  return (
    <Link href={`/effects/${preset.slug}`} className="video-tile group block">
      <div className="relative aspect-[3/4]">
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="metadata"
          poster={demo.poster}
          className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
        >
          <source src={demo.webm} type="video/webm" />
          <source src={demo.mp4} type="video/mp4" />
        </video>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
        <span className="absolute right-2 top-2 rounded-full bg-[var(--mint)] px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-black">
          {exact ? "Lab example" : "Concept · shared loop"}
        </span>
        <div className="absolute inset-x-0 bottom-0 p-3">
          <p className="text-sm font-bold text-white">{preset.name}</p>
          <p className="mt-0.5 line-clamp-2 text-[11px] text-white/65">
            {preset.tagline}
          </p>
          <p className="mt-1 text-[10px] font-semibold text-[var(--mint)] opacity-0 transition-opacity group-hover:opacity-100">
            Open tool →
          </p>
        </div>
      </div>
    </Link>
  );
}
