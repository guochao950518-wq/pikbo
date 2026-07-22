"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { FeedItem } from "@/lib/videoFeed";
import { VideoTile } from "@/components/VideoTile";
import { CATEGORIES } from "@/lib/presets";

/** HF Viral Presets wall: chips + dense autoplay masonry */
export function HomeViralWall({ items }: { items: FeedItem[] }) {
  const [filter, setFilter] = useState<string>("all");

  const chips = useMemo(
    () => [
      { id: "all", label: "ALL" },
      ...CATEGORIES.map((c) => ({
        id: c.id,
        label: c.label.toUpperCase(),
      })),
      { id: "demo", label: "LAB CLIPS" },
    ],
    []
  );

  const wall = useMemo(() => {
    if (filter === "all") return items;
    if (filter === "demo") return items.filter((i) => i.kind === "demo");
    return items.filter((i) => i.category === filter);
  }, [filter, items]);

  return (
    <section className="px-2 py-6 sm:px-4">
      <div className="mb-3 flex flex-wrap items-end justify-between gap-2 px-2">
        <div>
          <Link
            href="/effects"
            className="text-xl font-bold tracking-tight hover:text-[var(--mint)] sm:text-2xl"
          >
            Viral toy presets
          </Link>
          <p className="mt-1 text-sm text-[var(--fg-dim)]">
            Scroll the wall · every card is a remakeable recipe
          </p>
        </div>
        <Link
          href="/effects"
          className="text-xs font-semibold text-[var(--mint)] hover:underline"
        >
          View all presets →
        </Link>
      </div>

      <div className="mb-4 flex gap-2 overflow-x-auto px-2 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {chips.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setFilter(c.id)}
            className={`shrink-0 rounded-full border px-3 py-1.5 text-[10px] font-bold tracking-wide transition ${
              filter === c.id
                ? "border-[var(--mint)] bg-[var(--mint)] text-black"
                : "border-white/10 bg-white/[0.03] text-[var(--fg-muted)] hover:border-white/20"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="columns-2 gap-2 sm:columns-3 sm:gap-2.5 md:columns-4 lg:columns-5 xl:columns-6 2xl:columns-7">
        {wall.map((item) => (
          <div key={item.id} className="mb-2 break-inside-avoid sm:mb-2.5">
            <VideoTile item={item} compact />
          </div>
        ))}
      </div>
    </section>
  );
}
