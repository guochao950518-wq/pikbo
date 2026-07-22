"use client";

import Link from "next/link";
import type { FeedItem } from "@/lib/videoFeed";
import { VideoTile } from "@/components/VideoTile";

export function VideoRail({
  label,
  title,
  href,
  items,
  wide,
}: {
  label: string;
  title?: string;
  href?: string;
  items: FeedItem[];
  /** Larger cards for HF-style app/model rails */
  wide?: boolean;
}) {
  return (
    <section className="border-b border-[var(--border)] py-4">
      <div className="mb-3 flex items-end justify-between px-4 sm:px-6">
        <div>
          <p className="section-label">{label}</p>
          {title && (
            <h2 className="mt-1 text-base font-bold tracking-tight sm:text-lg">
              {title}
            </h2>
          )}
        </div>
        {href && (
          <Link
            href={href}
            className="text-[11px] font-semibold text-[var(--mint)] hover:underline"
          >
            See all →
          </Link>
        )}
      </div>
      <div className="flex gap-3 overflow-x-auto px-4 pb-3 pt-1 snap-x snap-mandatory sm:px-6">
        {items.map((item) => (
          <div
            key={item.id}
            className={`shrink-0 snap-start ${
              wide
                ? "w-[72vw] max-w-[320px] sm:w-[280px]"
                : "w-[42vw] max-w-[200px] sm:w-[168px]"
            }`}
          >
            <VideoTile item={{ ...item, ratio: wide ? "16:9" : item.ratio }} />
          </div>
        ))}
      </div>
    </section>
  );
}
