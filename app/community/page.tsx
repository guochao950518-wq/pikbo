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
  title: "PIKBO Lab",
  description:
    "PIKBO Lab examples and toy-video recipes. These cached examples are not presented as user community uploads.",
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
            <p className="section-label">PIKBO Lab</p>
            <h1 className="text-lg font-bold tracking-tight sm:text-xl">
              Cached examples · remake with your figure
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
          No fabricated users or engagement · every Remake opens Generate with
          that recipe
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
        label="Workflow previews"
        title="Configured models & apps"
        href="/apps"
        items={suite}
        wide
      />

      <section className="px-2 py-6 sm:px-4">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-2 px-1">
          <div>
            <p className="section-label">Remake wall</p>
            <h2 className="mt-1 text-xl font-bold tracking-tight">
              Recipes · tap to configure
            </h2>
          </div>
          <Link
            href="/explore"
            className="text-xs font-semibold text-[var(--mint)] hover:underline"
          >
            Full explore →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 sm:gap-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {wall.map((item) => (
            <VideoTile key={item.id} item={item} compact />
          ))}
        </div>
      </section>
    </div>
  );
}
