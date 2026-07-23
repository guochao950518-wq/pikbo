import type { Metadata } from "next";
import Link from "next/link";
import {
  buildVideoFeed,
  featuredStrip,
  suiteRail,
} from "@/lib/videoFeed";
import { VideoTile } from "@/components/VideoTile";
import { VideoRail } from "@/components/VideoRail";
import { CATEGORIES, PRESETS } from "@/lib/presets";
import { listOfficialProjectSlugs } from "@/lib/videoFeed";

export const metadata: Metadata = {
  title: "Explore AI Toy Video Recipes",
  description:
    "Explore official Pikbo examples and toy-video recipes for listings, drops, and social posts. Cached examples and unverified concepts are labeled separately.",
  alternates: { canonical: "/explore" },
};

/** Infinite-feel video explore — rails + dense masonry + category filters */
export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string }>;
}) {
  const sp = await searchParams;
  const cat = sp.cat;
  const featured = featuredStrip();
  const suite = suiteRail();
  const feedAll = buildVideoFeed();
  const feed =
    cat && CATEGORIES.some((c) => c.id === cat)
      ? feedAll.filter((item) => item.category === cat)
      : feedAll;
  const projectSlug = listOfficialProjectSlugs()[0] || "orbit-cgi";

  return (
    <div className="pb-24">
      <div className="sticky top-0 z-20 border-b border-[var(--border)] bg-[var(--bg)]/90 px-4 py-3 backdrop-blur sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="section-label">Explore</p>
            <h1 className="text-lg font-bold tracking-tight">
              Find a recipe for your next toy listing or drop
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
              href="/effects"
              className="btn btn-ghost !px-3 !py-2 text-xs"
            >
              Presets
            </Link>
            <Link
              href="/pricing"
              className="btn btn-ghost !px-3 !py-2 text-xs"
            >
              Pricing
            </Link>
          </div>
        </div>
        <div className="mt-2 flex gap-2 overflow-x-auto pb-0.5">
          {[
            { href: "/effects", label: "All presets" },
            { href: "/community", label: "Official examples" },
            { href: "/tools", label: "Tools" },
            { href: `/projects/${projectSlug}`, label: "Inside a recipe" },
            { href: "/create?mode=seller-pack", label: "Seller Pack" },
            { href: "/create", label: "Upload" },
          ].map((chip) => (
            <Link
              key={chip.href}
              href={chip.href}
              className="shrink-0 rounded-full border border-[var(--border)] px-3 py-1 text-[11px] font-semibold text-[var(--fg-muted)] hover:border-[var(--mint)] hover:text-[var(--mint)]"
            >
              {chip.label}
            </Link>
          ))}
        </div>
        {/* Wave A: category filter — open recipes by job type */}
        <div className="mt-2 flex gap-2 overflow-x-auto pb-0.5">
          <Link
            href="/explore"
            className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold ${
              !cat
                ? "bg-[var(--mint)] text-black"
                : "border border-[var(--border)] text-[var(--fg-muted)]"
            }`}
          >
            All categories
          </Link>
          {CATEGORIES.map((c) => (
            <Link
              key={c.id}
              href={`/explore?cat=${c.id}`}
              className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold ${
                cat === c.id
                  ? "bg-[var(--mint)] text-black"
                  : "border border-[var(--border)] text-[var(--fg-muted)]"
              }`}
            >
              {c.label}
            </Link>
          ))}
        </div>
      </div>

      <VideoRail
        label="Official Pikbo examples"
        title="Demonstrated looks you can open in Studio"
        href="/community"
        items={featured}
      />

      <VideoRail
        label="Cached workflow references"
        title="Configured paths · preview media labeled"
        href="/apps"
        items={suite}
        wide
      />

      <section className="px-3 py-5 sm:px-5">
        <div className="mb-3 flex items-end justify-between px-1">
          <div>
            <p className="section-label">
              {cat
                ? `${feed.length} in ${CATEGORIES.find((c) => c.id === cat)?.label || cat}`
                : `${PRESETS.length}+ effect recipes`}
            </p>
            <h2 className="mt-1 text-xl font-bold tracking-tight">
              Official examples and unverified concepts stay clearly separated
            </h2>
          </div>
        </div>
        <div className="columns-2 gap-2 sm:columns-3 sm:gap-3 lg:columns-4 xl:columns-5">
          {feed.map((item) => (
            <div key={item.id} className="mb-2 break-inside-avoid sm:mb-3">
              <VideoTile item={item} />
            </div>
          ))}
        </div>
        {feed.length === 0 && (
          <p className="py-12 text-center text-sm text-[var(--fg-dim)]">
            No official Lab clips in this category yet — browse{" "}
            <Link href="/effects" className="text-[var(--mint)] hover:underline">
              all presets
            </Link>
            .
          </p>
        )}
      </section>
    </div>
  );
}
