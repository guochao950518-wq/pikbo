"use client";

import Link from "next/link";
import { AutoPlayVideo } from "@/components/AutoPlayVideo";
import type { FeedItem } from "@/lib/videoFeed";

function aspectClass(ratio: FeedItem["ratio"], compact?: boolean) {
  if (compact) {
    if (ratio === "9:16") return "aspect-[9/13]";
    if (ratio === "1:1") return "aspect-square";
    if (ratio === "16:9") return "aspect-video";
    return "aspect-[4/5]";
  }
  if (ratio === "9:16") return "aspect-[9/14]";
  if (ratio === "1:1") return "aspect-square";
  if (ratio === "16:9") return "aspect-video";
  return "aspect-[4/5]";
}

/**
 * Autoplay-on-visible video card — shared AutoPlayVideo budget
 * (mobile ≤1 concurrent · non-hero preload none · Link owns focus).
 */
export function VideoTile({
  item,
  compact,
}: {
  item: FeedItem;
  compact?: boolean;
}) {
  return (
    <Link
      href={item.href}
      className="video-tile group block overflow-hidden rounded-xl border border-white/[0.08] bg-black shadow-[0_8px_24px_-12px_rgba(0,0,0,0.8)]"
      aria-label={`Open ${item.title}`}
    >
      <div className={`relative ${aspectClass(item.ratio, compact)}`}>
        <AutoPlayVideo
          poster={item.demo.poster}
          webm={item.demo.webm}
          mp4={item.demo.mp4}
          focusable={false}
          className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/15 to-transparent opacity-95" />
        {item.badge && (
          <span className="absolute left-2 top-2 rounded-full border border-white/10 bg-black/55 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white/80 backdrop-blur">
            {item.badge}
          </span>
        )}
        <div
          className={`absolute inset-x-0 bottom-0 ${compact ? "p-2.5" : "p-3 sm:p-4"}`}
        >
          <p className="line-clamp-1 text-[9px] font-bold uppercase tracking-[0.14em] text-white/50">
            {item.subtitle}
          </p>
          <h3
            className={`mt-0.5 line-clamp-2 font-semibold text-white ${
              compact ? "text-[12px] leading-snug" : "text-sm sm:text-base"
            }`}
          >
            {item.title}
          </h3>
          {!compact && (
            <p className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-[var(--mint)]/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[var(--mint)] ring-1 ring-[var(--mint)]/30 transition group-hover:bg-[var(--mint)] group-hover:text-black">
              Remix with my toy
              <span aria-hidden>→</span>
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
