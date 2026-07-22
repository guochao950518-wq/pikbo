import type { Metadata } from "next";
import Link from "next/link";
import { featuredStrip } from "@/lib/videoFeed";
import { VideoTile } from "@/components/VideoTile";
import { PRESETS } from "@/lib/presets";

export const metadata: Metadata = {
  title: "Community",
  description:
    "Pikbo demo wall — official toy clips you can remake with your figure.",
};

export default function CommunityPage() {
  const demos = featuredStrip();

  return (
    <div className="px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="section-label">Community</p>
          <h1 className="mt-1 text-2xl font-bold">From the shelf</h1>
          <p className="mt-1 max-w-lg text-sm text-[var(--fg-muted)]">
            Official demos (no credits). User UGC after accounts — for now
            remake any look with your own toy.
          </p>
        </div>
        <Link href="/create" className="btn btn-primary text-sm">
          Make yours
        </Link>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {demos.map((item) => (
          <VideoTile key={item.id} item={item} />
        ))}
      </div>

      <h2 className="mt-12 text-lg font-bold">All presets</h2>
      <div className="mt-4 flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <Link
            key={p.slug}
            href={`/effects/${p.slug}`}
            className="rounded-full border border-[var(--border)] px-3 py-1.5 text-xs text-[var(--fg-muted)] hover:border-[var(--mint)] hover:text-[var(--mint)]"
          >
            {p.emoji} {p.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
