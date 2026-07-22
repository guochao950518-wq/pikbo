import type { Metadata } from "next";
import Link from "next/link";
import { PRESETS } from "@/lib/presets";
import { allCategoryFeeds } from "@/lib/videoFeed";
import { VideoTile } from "@/components/VideoTile";

export const metadata: Metadata = {
  title: "Toy video presets",
  description:
    "Every Pikbo effect as a playable video — spin, unbox, dance, cinematic scenes for designer toys.",
  alternates: { canonical: "/effects" },
};

/** HF viral-presets wall: every card is video */
export default function EffectsHub() {
  const groups = allCategoryFeeds();

  return (
    <div className="pb-24">
      <div className="sticky top-0 z-20 border-b border-[var(--border)] bg-[var(--bg)]/90 px-4 py-3 backdrop-blur sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="section-label">{PRESETS.length} presets</p>
            <h1 className="text-lg font-bold tracking-tight sm:text-xl">
              Viral presets · remake in Generate
            </h1>
          </div>
          <div className="flex gap-2">
            <Link
              href="/create"
              className="btn btn-primary !px-4 !py-2 text-xs"
            >
              Generate
            </Link>
            <Link
              href="/supercomputer"
              className="btn btn-ghost !px-3 !py-2 text-xs"
            >
              Batch
            </Link>
          </div>
        </div>
        <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
          {groups.map(({ category }) => (
            <a
              key={category.id}
              href={`#cat-${category.id}`}
              className="shrink-0 rounded-full border border-[var(--border)] px-3 py-1 text-[11px] font-semibold text-[var(--fg-muted)] hover:border-[var(--mint)] hover:text-[var(--mint)]"
            >
              {category.label}
            </a>
          ))}
        </div>
      </div>

      {groups.map(({ category, items }) => (
        <section
          key={category.id}
          id={`cat-${category.id}`}
          className="scroll-mt-28 border-b border-[var(--border)] px-3 py-6 sm:px-5"
        >
          <div className="mb-3 px-1">
            <h2 className="text-base font-bold tracking-tight">
              {category.label}
            </h2>
            <p className="text-xs text-[var(--fg-dim)]">{category.blurb}</p>
          </div>
          <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 sm:gap-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7">
            {items.map((item) => (
              <VideoTile key={item.id} item={item} compact />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
