import type { Metadata } from "next";
import Link from "next/link";
import { PRESETS } from "@/lib/presets";

export const metadata: Metadata = {
  title: "Community",
  description: "Explore public generations and presets.",
};

export default function CommunityPage() {
  return (
    <div className="px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-2xl font-bold">Community</h1>
        <p className="mt-1 text-sm text-[var(--fg-muted)]">
          Explore wall (mock projects — same pattern as big AI video apps).
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PRESETS.map((p, i) => (
            <Link
              key={p.slug}
              href={`/create?effect=${p.slug}`}
              className="card group overflow-hidden p-0 transition-transform hover:-translate-y-1"
            >
              <div
                className="relative aspect-[16/10]"
                style={{ background: p.gradient }}
              >
                <span className="absolute bottom-2 left-2 text-3xl">
                  {p.emoji}
                </span>
              </div>
              <div className="p-4">
                <p className="font-semibold group-hover:text-[var(--mint)]">
                  {p.name}
                </p>
                <p className="mt-1 text-xs text-[var(--fg-dim)]">
                  @creator{(i % 7) + 1} · used preset · public
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
