import type { Metadata } from "next";
import Link from "next/link";
import {
  buildVideoFeed,
  communityProjects,
  suiteRail,
} from "@/lib/videoFeed";
import { VideoTile } from "@/components/VideoTile";
import { VideoRail } from "@/components/VideoRail";
import { ProjectCard } from "@/components/ProjectCard";

export const metadata: Metadata = {
  title: "Community",
  description:
    "Pikbo community projects — official toy clips you can remake with Seedance. Tap Remake to open Generate.",
  alternates: { canonical: "/community" },
};

/** HF community: project cards first, then dense remake wall */
export default function CommunityPage() {
  const projects = communityProjects();
  const suite = suiteRail();
  const wall = buildVideoFeed();

  return (
    <div className="pb-24">
      <div className="sticky top-0 z-20 border-b border-[var(--border)] bg-[var(--bg)]/90 px-4 py-3 backdrop-blur sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="section-label">Community</p>
            <h1 className="text-lg font-bold tracking-tight sm:text-xl">
              Projects · remake with your figure
            </h1>
          </div>
          <div className="flex gap-2">
            <Link href="/create" className="btn btn-primary !px-4 !py-2 text-xs">
              Generate
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
          Official Lab projects until user accounts ship · every Remake opens
          Generate with that look
        </p>
      </div>

      <section className="border-b border-[var(--border)] px-3 py-6 sm:px-5">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-2 px-1">
          <div>
            <p className="section-label">Featured projects</p>
            <h2 className="mt-1 text-xl font-bold tracking-tight">
              Explore the inside of every look
            </h2>
            <p className="mt-1 text-xs text-[var(--fg-muted)]">
              Prompts live on effect pages · Remake jumps straight to workspace
            </p>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      </section>

      <VideoRail
        label="Live suite"
        title="Models & apps"
        href="/apps"
        items={suite}
        wide
      />

      <section className="px-3 py-6 sm:px-5">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-2 px-1">
          <div>
            <p className="section-label">Remake wall</p>
            <h2 className="mt-1 text-xl font-bold tracking-tight">
              Viral looks · tap to generate
            </h2>
          </div>
          <Link
            href="/explore"
            className="text-xs font-semibold text-[var(--mint)] hover:underline"
          >
            Full explore →
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
    </div>
  );
}
