import type { Metadata } from "next";
import Link from "next/link";
import { PRESETS } from "@/lib/presets";
import { PresetsWall } from "@/components/PresetsWall";

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
          Tap any preset to open the studio with it loaded.
        </p>
        <Link href="/create" className="btn btn-primary mt-6">
          Open the studio →
        </Link>
      </div>

      <PresetsWall heading="All effects" subheading="Grouped by what you need — sell it, reveal it, or bring it to life." />
    </div>
  );
}
