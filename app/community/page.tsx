import type { Metadata } from "next";
import Link from "next/link";
import { buildVideoFeed, featuredStrip, suiteRail } from "@/lib/videoFeed";
import { VideoTile } from "@/components/VideoTile";
import { VideoRail } from "@/components/VideoRail";

export const metadata: Metadata = {
  title: "Community",
  description:
    "Pikbo community video wall — official toy clips and live looks you can remake with your figure.",
  alternates: { canonical: "/community" },
};

/** Dense HF-style community: rails + autoplay masonry, not text chips */
export default function CommunityPage() {
  const featured = featuredStrip();
  const suite = suiteRail();
  const wall = buildVideoFeed();

  return (
    <div className="pb-24">
      <div className="sticky top-0 z-20 border-b border-[var(--border)] bg-[var(--bg)]/90 px-4 py-3 backdrop-blur sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="section-label">Community</p>
            <h1 className="text-lg font-bold tracking-tight sm:text-xl">
              Shelf clips · remake any look
            </h1>
          </div>
          <div className="flex gap-2">
            <Link href="/create" className="btn btn-primary !px-4 !py-2 text-xs">
              Make yours
            </Link>
            <Link
              href="/effects"
              className="btn btn-ghost !px-3 !py-2 text-xs"
            >
              All presets
            </Link>
          </div>
        </div>
        <p className="mt-1 text-[11px] text-[var(--fg-dim)]">
          Official demos free to watch · user UGC after accounts · tap any
          video to recreate
        </p>
      </div>

      <VideoRail
        label="Trending demos"
        title="Official shelf cuts"
        href="/effects"
        items={featured}
      />

      <VideoRail
        label="Live suite"
        title="Tools running now"
        href="/apps"
        items={suite}
        wide
      />

      <section className="px-3 py-6 sm:px-5">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-2 px-1">
          <div>
            <p className="section-label">Full wall</p>
            <h2 className="mt-1 text-xl font-bold tracking-tight">
              Every look plays on scroll
            </h2>
          </div>
          <Link
            href="/explore"
            className="text-xs font-semibold text-[var(--mint)] hover:underline"
          >
            Open explore →
          </Link>
        </div>
        <div className="columns-2 gap-2 sm:columns-3 sm:gap-3 lg:columns-4 xl:columns-5">
          {wall.map((item) => (
            <div key={item.id} className="mb-2 break-inside-avoid sm:mb-3">
              <VideoTile item={item} />
            </div>
          ))}
        </div>
      </section>

      <section className="mx-4 mb-8 overflow-hidden rounded-2xl border border-[var(--border)] sm:mx-6">
        <div className="grid sm:grid-cols-2">
          <div className="relative min-h-[160px] bg-black">
            <video
              className="absolute inset-0 h-full w-full object-cover opacity-75"
              autoPlay
              muted
              loop
              playsInline
              poster={featured[0]?.demo.poster}
            >
              {featured[0] && (
                <>
                  <source src={featured[0].demo.webm} type="video/webm" />
                  <source src={featured[0].demo.mp4} type="video/mp4" />
                </>
              )}
            </video>
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
          </div>
          <div className="flex flex-col justify-center bg-[var(--card)] p-6">
            <p className="section-label">Your figure next</p>
            <p className="mt-2 text-lg font-bold tracking-tight">
              Drop a photo. Ship the clip.
            </p>
            <p className="mt-2 text-sm text-[var(--fg-muted)]">
              Free tier · watermark · Seedance Fast
            </p>
            <Link href="/create" className="btn btn-primary mt-5 w-fit text-sm">
              Generate free
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
