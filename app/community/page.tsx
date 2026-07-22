import type { Metadata } from "next";
import Link from "next/link";
import { featuredStrip } from "@/lib/videoFeed";
import { VideoTile } from "@/components/VideoTile";
import { PRESETS } from "@/lib/presets";

export const metadata: Metadata = {
  title: "PIKBO Lab",
  description:
    "Explore clearly labeled PIKBO-owned prototype clips and toy-video recipes.",
};

export default function CommunityPage() {
  const labClips = featuredStrip();

  return (
    <div className="min-h-screen bg-[#07070a] px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-wrap items-end justify-between gap-5 border-b border-white/10 pb-7">
          <div className="max-w-2xl">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--lime)]">
              PIKBO Lab · Explore
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              Our prototype shelf
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-white/55">
              These are PIKBO-owned cached prototypes used to validate the
              product experience. Each clip is not a public user post. These clips do not claim provider provenance and cost no credits to watch.
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/explore" className="btn btn-ghost !border-white/15 text-sm">
              Open Explore
            </Link>
            <Link href="/create" className="btn btn-primary text-sm">
              Create yours
            </Link>
          </div>
        </div>

        <section className="py-8" aria-labelledby="lab-clips-heading">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 id="lab-clips-heading" className="text-lg font-semibold">
              Cached Lab clips
            </h2>
            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/35">
              PIKBO material · no UGC claims
            </span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {labClips.map((item) => (
              <VideoTile key={item.id} item={item} />
            ))}
          </div>
        </section>

        <section className="border-t border-white/10 py-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">Explore recipes</h2>
              <p className="mt-1 text-xs text-white/40">
                Recipe availability does not imply a validated output clip.
              </p>
            </div>
            <Link href="/effects" className="text-xs font-semibold text-[var(--lime)]">
              View the effect wall →
            </Link>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {PRESETS.map((preset) => (
              <Link
                key={preset.slug}
                href={`/effects/${preset.slug}`}
                className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-white/55 transition hover:border-white/30 hover:text-white"
              >
                {preset.emoji} {preset.name}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
