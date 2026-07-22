import type { Metadata } from "next";
import Link from "next/link";
import { buildVideoFeed } from "@/lib/videoFeed";
import { VideoTile } from "@/components/VideoTile";

export const metadata: Metadata = {
  title: "Explore",
  description:
    "Explore Pikbo video feed — demos, presets, and live toy tools. Tap any clip to recreate.",
};

export default function ExplorePage() {
  const feed = buildVideoFeed();

  return (
    <div className="pb-20">
      <div className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border)] bg-[var(--bg)]/90 px-4 py-3 backdrop-blur sm:px-6">
        <div>
          <p className="section-label">Explore</p>
          <h1 className="text-lg font-bold">Video feed</h1>
        </div>
        <Link href="/create" className="btn btn-primary !px-4 !py-2 text-xs">
          Generate
        </Link>
      </div>
      <div className="columns-2 gap-2 p-3 sm:columns-3 sm:gap-3 lg:columns-4 xl:columns-5">
        {feed.map((item) => (
          <div key={item.id} className="mb-2 break-inside-avoid sm:mb-3">
            <VideoTile item={item} />
          </div>
        ))}
      </div>
    </div>
  );
}
