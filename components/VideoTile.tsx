"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { FeedItem } from "@/lib/videoFeed";

function aspectClass(ratio: FeedItem["ratio"]) {
  if (ratio === "9:16") return "aspect-[9/14]";
  if (ratio === "1:1") return "aspect-square";
  if (ratio === "16:9") return "aspect-video";
  return "aspect-[4/5]";
}

/** Autoplay-on-visible video card — Higgsfield-style retention unit */
export function VideoTile({ item }: { item: FeedItem }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.35) {
          video.play().catch(() => undefined);
        } else {
          video.pause();
        }
      },
      { threshold: [0, 0.35, 0.7] }
    );
    io.observe(video);
    return () => io.disconnect();
  }, [item.id]);

  return (
    <Link href={item.href} className="video-tile group block">
      <div className={`relative ${aspectClass(item.ratio)}`}>
        <video
          ref={ref}
          className="absolute inset-0 h-full w-full object-cover"
          poster={item.demo.poster}
          muted
          loop
          playsInline
          preload="metadata"
          onLoadedData={() => setReady(true)}
        >
          <source src={item.demo.webm} type="video/webm" />
          <source src={item.demo.mp4} type="video/mp4" />
        </video>
        {!ready && (
          <div
            className="absolute inset-0 animate-pulse"
            style={{ background: `linear-gradient(135deg, ${item.demo.accent}33, #000)` }}
          />
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90" />
        {item.badge && (
          <span className="absolute left-2 top-2 rounded-full border border-white/10 bg-black/55 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white/80 backdrop-blur">
            {item.badge}
          </span>
        )}
        <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
          <p className="line-clamp-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white/50">
            {item.subtitle}
          </p>
          <h3 className="mt-0.5 line-clamp-2 text-sm font-semibold text-white sm:text-base">
            {item.title}
          </h3>
          <p className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-[var(--mint)]/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[var(--mint)] ring-1 ring-[var(--mint)]/30 transition group-hover:bg-[var(--mint)] group-hover:text-black">
            Recreate
            <span aria-hidden>→</span>
          </p>
        </div>
      </div>
    </Link>
  );
}
