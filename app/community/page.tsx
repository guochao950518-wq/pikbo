import type { Metadata } from "next";
import Link from "next/link";
import { PRESETS } from "@/lib/presets";

export const metadata: Metadata = {
  title: "Community",
  description: "Explore toy video presets and public-style generations on Pikbo.",
};

export default function CommunityPage() {
  return (
    <div className="px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <span className="chip">Community</span>
        <h1 className="mt-3 text-2xl font-bold">From the shelf</h1>
        <p className="mt-1 text-sm text-[var(--fg-muted)]">
          Explore wall for collectors & sellers. Mock posts for now — each card
          jumps into Generate with that toy preset.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PRESETS.map((p, i) => (
            <Link
              key={p.slug}
              href={`/create?effect=${p.slug}`}
              className="card group overflow-hidden p-0 transition-transform hover:-translate-y-1"
            >
              <div
                className="relative grid aspect-[16/10] place-items-center text-5xl"
                style={{ background: p.gradient }}
              >
                <span className="drop-shadow-lg">{p.emoji}</span>
              </div>
              <div className="p-4">
                <p className="font-semibold group-hover:text-[var(--brand)]">
                  {p.name}
                </p>
                <p className="mt-1 text-xs text-[var(--fg-dim)]">
                  @collector{(i % 9) + 1} · {p.audience} · public
                </p>
                <p className="mt-2 line-clamp-2 text-xs text-[var(--fg-muted)]">
                  {p.tagline}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
