import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { PRESETS } from "@/lib/presets";
import { allCategoryFeeds } from "@/lib/videoFeed";
import { VideoTile } from "@/components/VideoTile";
import { GenerateSuiteChrome } from "@/components/GenerateSuiteChrome";
import { listCreateShelfWorkflows } from "@/lib/workflows";
import { proofBackedRecipeSlugs } from "@/lib/seoIndex";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Toy video presets · Recipes",
  description:
    "Every Pikbo effect as a playable video — spin, unbox, dance, cinematic scenes for designer toys. Remake in Generate.",
  alternates: { canonical: "/effects" },
  openGraph: {
    title: `Toy video presets · Recipes | ${site.name}`,
    description:
      "Playable Lab recipes for designer toys — spin, unbox, dance, shelf. Remix in Generate.",
    url: `${site.url}/effects`,
  },
};

/** HF viral-presets wall + suite chrome (toy vertical) */
export default function EffectsHub() {
  const groups = allCategoryFeeds();
  const jobBlocks = listCreateShelfWorkflows().filter(
    (w) => w.id !== "photo-to-clip"
  );
  // Phase H: ItemList only proof-backed recipes (concept walls stay reachable/noindex).
  const proofSlugs = new Set(proofBackedRecipeSlugs());
  const proofPresets = PRESETS.filter((p) => proofSlugs.has(p.slug));
  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Pikbo Lab toy video recipes with proof",
    description:
      "Effect landings that have a unique Lab cached demo. Concept recipes without proof are omitted.",
    numberOfItems: proofPresets.length,
    itemListElement: proofPresets.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: p.name,
      url: `${site.url}/effects/${p.slug}`,
      description: p.seoDescription,
    })),
  };

  return (
    <div className="pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }}
      />
      <Suspense
        fallback={
          <div className="border-b border-white/10 px-4 py-3 text-sm text-white/40">
            Generate · Recipes
          </div>
        }
      >
        <GenerateSuiteChrome compact />
      </Suspense>

      <div className="sticky top-0 z-20 border-b border-white/[0.07] bg-black/85 px-4 py-3.5 backdrop-blur-xl sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="section-label">
              {PRESETS.length} recipes · {proofPresets.length} lab proof
            </p>
            <h1 className="font-display text-lg font-black tracking-tight sm:text-xl">
              Viral presets · remake in Generate
            </h1>
            <p className="mt-0.5 text-[11px] text-white/45">
              HF-style wall, toy-native · Lab-proof clips only claim unique media ·{" "}
              <Link href="/modules" className="font-semibold text-[var(--mint)] hover:underline">
                Module jobs →
              </Link>
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/create?try=1&sample=scout"
              className="btn btn-primary !px-4 !py-2 text-xs"
            >
              Try free
            </Link>
            <Link
              href="/flow"
              className="btn btn-ghost !px-3 !py-2 text-xs"
            >
              Flow
            </Link>
            <Link
              href="/modules"
              className="btn btn-ghost !px-3 !py-2 text-xs"
            >
              Modules
            </Link>
            <Link
              href="/create"
              className="btn btn-ghost !px-3 !py-2 text-xs"
            >
              Generate
            </Link>
            <Link
              href="/create?mode=seller-pack"
              className="btn btn-ghost !px-3 !py-2 text-xs"
            >
              Seller Pack
            </Link>
          </div>
        </div>

        {/* Job-first chips — suite modules on the recipe wall */}
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
          {jobBlocks.map((w) => (
            <Link
              key={w.id}
              href={w.href}
              className="shrink-0 rounded-full border border-[var(--mint)]/35 bg-[var(--mint)]/[0.1] px-3 py-1.5 text-[11px] font-semibold text-[var(--mint)] shadow-[0_0_20px_rgba(200,255,61,0.08)] transition hover:border-[var(--mint)] hover:bg-[var(--mint)]/15"
            >
              {w.emoji} {w.label}
            </Link>
          ))}
          {groups.map(({ category }) => (
            <a
              key={category.id}
              href={`#cat-${category.id}`}
              className="shrink-0 rounded-full border border-white/12 bg-white/[0.03] px-3 py-1.5 text-[11px] font-semibold text-white/55 transition hover:border-[var(--mint)]/40 hover:text-[var(--mint)]"
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
          className="scroll-mt-40 border-b border-white/[0.06] px-3 py-8 sm:px-5"
        >
          <div className="mb-4 flex flex-wrap items-end justify-between gap-2 px-1">
            <div>
              <h2 className="font-display text-base font-bold tracking-tight sm:text-lg">
                {category.label}
              </h2>
              <p className="mt-0.5 text-xs text-white/40">{category.blurb}</p>
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-white/30">
              {items.length} looks
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-2.5 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7">
            {items.map((item) => (
              <VideoTile key={item.id} item={item} compact />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
