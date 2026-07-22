import type { Metadata } from "next";
import Link from "next/link";
import { PRESETS } from "@/lib/presets";
import { PresetsWall } from "@/components/PresetsWall";

export const metadata: Metadata = {
  title: "Toy video presets",
  description:
    "Every Pikbo effect for designer toys, figures, blind boxes and plush — spin, unbox, dance, cinematic scenes.",
  alternates: { canonical: "/effects" },
};

export default function EffectsHub() {
  return (
    <div className="px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <span className="chip">🧸 {PRESETS.length} presets</span>
          <h1 className="mt-4 text-4xl font-bold sm:text-5xl">
            Toy video presets
          </h1>
          <p className="mt-4 text-lg text-[var(--fg-muted)]">
            One photo of a toy you own → a clip that sells or goes viral. Each
            card is a full tool page: generate on the spot, then dig into how-to
            and FAQ.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/create" className="btn btn-primary">
              Open full studio →
            </Link>
            <Link href="/for/etsy-listing-videos" className="btn btn-ghost">
              For sellers
            </Link>
          </div>
        </div>
      </div>

      <PresetsWall
        heading="All effects"
        subheading="Sell it · reveal it · bring it alive"
      />
    </div>
  );
}
