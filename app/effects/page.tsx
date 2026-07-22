import type { Metadata } from "next";
import Link from "next/link";
import { CATEGORIES, presetsByCategory, PRESETS } from "@/lib/presets";
import { PresetCard } from "@/components/PresetCard";

export const metadata: Metadata = {
  title: "All toy video effects",
  description:
    "Every Pikbo effect for designer toys, figures, blind boxes and plush — spin, unbox, dance, and cinematic scenes. Pick one and animate your photo.",
  alternates: { canonical: "/effects" },
};

export default function EffectsHub() {
  return (
    <div className="container-x py-14">
      <div className="max-w-2xl">
        <span className="chip">🧸 {PRESETS.length} effects</span>
        <h1 className="mt-4 text-4xl font-bold sm:text-5xl">
          Toy video effects
        </h1>
        <p className="mt-4 text-lg text-[var(--fg-muted)]">
          Every effect turns one photo of a toy you own into a shareable video.
          Grouped by what you need — sell it, reveal it, or bring it to life.
        </p>
        <Link href="/create" className="btn btn-primary mt-6">
          Open the studio →
        </Link>
      </div>

      {CATEGORIES.map((cat) => (
        <section key={cat.id} id={cat.id} className="mt-16 scroll-mt-24">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">{cat.label}</h2>
            <p className="mt-1 text-[var(--fg-muted)]">{cat.blurb}</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {presetsByCategory(cat.id).map((p) => (
              <PresetCard key={p.slug} preset={p} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
