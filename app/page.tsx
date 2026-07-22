import Link from "next/link";
import { buildVideoFeed, featuredStrip } from "@/lib/videoFeed";
import { VideoTile } from "@/components/VideoTile";
import { PRESETS } from "@/lib/presets";
import { HeroUpload } from "@/components/HeroUpload";

/**
 * Higgsfield-style home: enter = video everywhere.
 * Dense autoplay feed drives dwell + convert to Generate.
 */
export default function Home() {
  const featured = featuredStrip();
  const feed = buildVideoFeed();

  return (
    <div className="pb-24">
      {/* Compact sticky convert bar over the video world */}
      <section className="sticky top-0 z-30 border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--bg)_90%,transparent)] backdrop-blur-xl lg:top-0">
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold tracking-tight">
              Designer toy video · Seedance
            </p>
            <p className="truncate text-[11px] text-[var(--fg-dim)]">
              Scroll the feed · tap any clip to recreate
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Link href="/create" className="btn btn-primary !px-4 !py-2 text-xs">
              Generate free
            </Link>
            <Link
              href="/supercomputer"
              className="btn btn-ghost !px-3 !py-2 text-xs"
            >
              Batch
            </Link>
          </div>
        </div>
      </section>

      {/* Feature strip — horizontal video rail (HF hero cards) */}
      <section className="border-b border-[var(--border)] px-4 py-4 sm:px-6">
        <div className="mb-3 flex items-end justify-between">
          <p className="section-label">Featured</p>
          <Link
            href="/community"
            className="text-[11px] font-semibold text-[var(--mint)] hover:underline"
          >
            Community →
          </Link>
        </div>
        <div className="-mx-1 flex gap-3 overflow-x-auto pb-2 pt-1 snap-x snap-mandatory">
          {featured.map((item) => (
            <div
              key={item.id}
              className="w-[42vw] max-w-[220px] shrink-0 snap-start sm:w-[180px]"
            >
              <VideoTile item={item} />
            </div>
          ))}
          <Link
            href="/create"
            className="video-tile flex w-[42vw] max-w-[220px] shrink-0 snap-start flex-col items-center justify-center gap-2 border-dashed border-[var(--mint)]/30 bg-[var(--card)] p-4 sm:w-[180px] aspect-[9/14]"
          >
            <span className="text-2xl text-[var(--mint)]">+</span>
            <span className="text-center text-xs font-semibold text-[var(--mint)]">
              Your toy next
            </span>
            <span className="text-center text-[10px] text-[var(--fg-dim)]">
              Upload & generate
            </span>
          </Link>
        </div>
      </section>

      {/* Drop zone — conversion without leaving video context */}
      <section className="border-b border-[var(--border)] px-4 py-5 sm:px-6">
        <div className="mx-auto max-w-xl">
          <HeroUpload />
        </div>
      </section>

      {/* Dense viral wall */}
      <section className="px-3 py-6 sm:px-5">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-2 px-1">
          <div>
            <p className="section-label">Viral presets</p>
            <h1 className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">
              {PRESETS.length}+ looks · all play on enter
            </h1>
          </div>
          <Link
            href="/effects"
            className="text-xs font-semibold text-[var(--mint)] hover:underline"
          >
            All presets →
          </Link>
        </div>

        <div className="columns-2 gap-2 sm:columns-3 sm:gap-3 lg:columns-4 xl:columns-5">
          {feed.map((item) => (
            <div key={item.id} className="mb-2 break-inside-avoid sm:mb-3">
              <VideoTile item={item} />
            </div>
          ))}
        </div>
      </section>

      {/* Bottom convert strip */}
      <section className="mx-4 mb-8 rounded-2xl border border-[var(--mint)]/25 bg-gradient-to-br from-[var(--mint)]/10 to-transparent p-6 text-center sm:mx-6">
        <p className="text-sm font-semibold">Ready to animate your shelf?</p>
        <p className="mt-1 text-xs text-[var(--fg-dim)]">
          Free tier · ~3 clips · Seedance Fast
        </p>
        <Link href="/create" className="btn btn-primary mt-4 px-8">
          Open Generate
        </Link>
      </section>
    </div>
  );
}
