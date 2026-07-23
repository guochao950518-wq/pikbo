import type { Metadata } from "next";
import Link from "next/link";
import { ExploreProjectGrid } from "@/components/ExploreProjectGrid";
import {
  SHOWCASE_CATEGORIES,
  listShowcaseProjects,
  type ShowcaseCategory,
} from "@/lib/showcaseProjects";

export const metadata: Metadata = {
  title: "Explore Official AI Toy Video Projects",
  description:
    "Open PIKBO Lab toy-video projects, inspect the owned input and cached output, then reuse the exact recipe with a toy photo you own.",
  alternates: { canonical: "/explore" },
};

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string }>;
}) {
  const { cat } = await searchParams;
  const initialCategory =
    cat && SHOWCASE_CATEGORIES.some((item) => item.id === cat)
      ? (cat as "all" | ShowcaseCategory)
      : "all";
  const projects = listShowcaseProjects();

  return (
    <main className="min-h-screen bg-black pb-24 text-white">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-black/90 px-4 py-4 backdrop-blur sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#c8ff3d]">
              PIKBO Lab · traceable proof
            </p>
            <h1 className="font-display mt-1 text-2xl font-black uppercase tracking-tight sm:text-3xl">
              Open the project, not just the clip
            </h1>
            <p className="mt-1 max-w-2xl text-xs leading-relaxed text-white/45 sm:text-sm">
              Every card has an owned input still, a distinct output file, a
              registered recipe, and an honest cached/live record.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/modules"
              className="rounded-full border border-[#c8ff3d]/40 bg-[#c8ff3d]/10 px-5 py-2.5 text-xs font-black text-[#c8ff3d]"
            >
              Modules
            </Link>
            <Link
              href="/create"
              className="rounded-full bg-[#c8ff3d] px-5 py-2.5 text-xs font-black text-black"
            >
              Generate
            </Link>
            <Link
              href="/effects"
              className="rounded-full border border-white/15 px-4 py-2.5 text-xs font-bold text-white/70"
            >
              All effects
            </Link>
          </div>
        </div>
        <div className="mx-auto mt-3 flex max-w-7xl flex-wrap gap-x-4 gap-y-1 text-[10px] text-white/35">
          <span>{projects.length} distinct output files</span>
          <span>Cached playback · 0 credits</span>
          <span>Live runs · current 10-credit contract</span>
          <span>Mobile · one playing clip maximum</span>
        </div>
      </header>

      <section className="mx-auto max-w-7xl">
        <div className="px-4 pb-5 pt-7 sm:px-6">
          <h2 className="text-sm font-black uppercase tracking-wide text-white">
            Choose a toy job
          </h2>
          <p className="mt-1 text-xs text-white/40">
            Hover or focus to preview on desktop. On mobile, the project in view
            plays and the previous clip pauses.
          </p>
        </div>
        <ExploreProjectGrid
          projects={projects}
          initialCategory={initialCategory}
        />
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5 sm:flex-row sm:items-center">
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-[#c8ff3d]">
              Seller workflow
            </p>
            <h2 className="mt-1 text-lg font-black">
              One photo → three fixed marketplace formats
            </h2>
            <p className="mt-1 text-xs text-white/45">
              Listing Spin, Blind-box Reveal, and Social Flash keep independent
              queue and refund states.
            </p>
          </div>
          <Link
            href="/create?mode=seller-pack"
            className="shrink-0 rounded-full border border-[#c8ff3d]/40 px-5 py-2.5 text-xs font-black text-[#c8ff3d]"
          >
            Open Seller Pack →
          </Link>
        </div>
      </section>
    </main>
  );
}
