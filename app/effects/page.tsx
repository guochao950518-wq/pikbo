import type { Metadata } from "next";
import Link from "next/link";
import { CATEGORIES, PRESETS } from "@/lib/presets";
import { DEMO_VIDEOS } from "@/lib/demoVideos";
import { PresetPreviewCard } from "@/components/PresetPreviewCard";

export const metadata: Metadata = {
  title: "Toy video effects",
  description:
    "Browse verified PIKBO Lab clips and clearly labeled concept recipes for owned-toy videos.",
  alternates: { canonical: "/effects" },
};

export default function EffectsHub() {
  const verifiedPresetSlugs = new Set(DEMO_VIDEOS.map((demo) => demo.preset));
  const verifiedCount = PRESETS.filter((preset) =>
    verifiedPresetSlugs.has(preset.slug)
  ).length;

  return (
    <div className="min-h-screen bg-[#050507] pb-24 text-white">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-[#050507]/92 px-4 py-4 backdrop-blur-xl sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--lime)]">
              Effects library · {PRESETS.length} recipes
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
              Toy motion, packed tight
            </h1>
          </div>
          <div className="flex gap-2">
            <Link href="/create" className="btn btn-primary !px-4 !py-2 text-xs">
              Create
            </Link>
            <Link
              href="/supercomputer"
              className="btn btn-ghost !border-white/15 !px-4 !py-2 text-xs"
            >
              SKU Campaign
            </Link>
          </div>
        </div>

        <div className="mx-auto mt-4 flex max-w-[1600px] gap-2 overflow-x-auto pb-1">
          {CATEGORIES.map((category) => (
            <a
              key={category.id}
              href={`#category-${category.id}`}
              className="shrink-0 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[11px] font-semibold text-white/55 transition hover:border-white/30 hover:text-white"
            >
              {category.label}
            </a>
          ))}
        </div>
      </header>

      <main className="mx-auto max-w-[1600px] px-3 sm:px-5 lg:px-8">
        <section className="grid gap-3 border-b border-white/10 py-5 text-xs text-white/55 sm:grid-cols-[1fr_auto] sm:items-center">
          <p className="max-w-3xl leading-relaxed">
            Video appears only when a cached PIKBO Lab clip is mapped to this
            exact preset. “Verified Lab clip” confirms that mapping, not provider
            provenance. Everything else stays a Concept recipe until its own
            output is validated.
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-[var(--lime)] px-3 py-1.5 font-bold text-black">
              {verifiedCount} verified Lab clips
            </span>
            <span className="rounded-full border border-white/15 px-3 py-1.5 font-bold text-white/65">
              {PRESETS.length - verifiedCount} concept recipes
            </span>
          </div>
        </section>

        {CATEGORIES.map((category) => {
          const presets = PRESETS.filter(
            (preset) => preset.category === category.id
          );

          return (
            <section
              key={category.id}
              id={`category-${category.id}`}
              className="scroll-mt-32 border-b border-white/10 py-8 last:border-b-0"
            >
              <div className="mb-4 flex items-end justify-between gap-4 px-1">
                <div>
                  <h2 className="text-lg font-semibold tracking-tight">
                    {category.label}
                  </h2>
                  <p className="mt-1 max-w-xl text-xs text-white/40">
                    {category.blurb}
                  </p>
                </div>
                <span className="shrink-0 text-[10px] font-bold uppercase tracking-[0.16em] text-white/30">
                  {presets.length} recipes
                </span>
              </div>

              <div className="grid grid-cols-2 gap-x-2 gap-y-5 sm:grid-cols-3 sm:gap-x-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
                {presets.map((preset) => (
                  <PresetPreviewCard key={preset.slug} preset={preset} />
                ))}
              </div>
            </section>
          );
        })}
      </main>
    </div>
  );
}
