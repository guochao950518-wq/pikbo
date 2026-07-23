import type { Metadata } from "next";
import Link from "next/link";
import {
  buildVideoFeed,
  communityProjects,
  conceptRecipeCount,
  suiteRail,
} from "@/lib/videoFeed";
import { VideoTile } from "@/components/VideoTile";
import { VideoRail } from "@/components/VideoRail";
import { ProjectCard } from "@/components/ProjectCard";

export const metadata: Metadata = {
  title: "Official AI Toy Video Examples",
  description:
    "Browse official cached Pikbo examples and toy-video recipes. These are product demonstrations, not customer posts or claimed community activity.",
  alternates: { canonical: "/community" },
};

/** PIKBO Lab: unique official demos only — no shared-loop density wall (G2/G3). */
export default function CommunityPage() {
  const projects = communityProjects();
  const suite = suiteRail();
  const wall = buildVideoFeed();
  const concepts = conceptRecipeCount();

  return (
    <div className="pb-24">
      <div className="sticky top-0 z-20 border-b border-[var(--border)] bg-[var(--bg)]/90 px-4 py-3 backdrop-blur sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="section-label">Official examples</p>
            <h1 className="text-lg font-bold tracking-tight sm:text-xl">
              See what each toy-video recipe is designed to make
            </h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/create" className="btn btn-primary !px-4 !py-2 text-xs">
              Generate
            </Link>
            <Link
              href="/modules"
              className="btn btn-ghost !px-3 !py-2 text-xs"
            >
              Modules
            </Link>
            <Link
              href="/create?mode=seller-pack"
              className="btn btn-ghost !px-3 !py-2 text-xs"
            >
              Seller Pack
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
          Official product demos only — not customer posts.{" "}
          <b className="font-semibold text-[var(--fg-muted)]">
            Remix = use recipe with your toy photo
          </b>
          ; Inside = input, settings, provenance.
        </p>
      </div>

      <section className="border-b border-[var(--border)] px-3 py-6 sm:px-5">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-2 px-1">
          <div>
            <p className="section-label">Pikbo Lab · official examples</p>
            <h2 className="mt-1 text-xl font-bold tracking-tight">
              Start from a demonstrated look
            </h2>
            <p className="mt-1 text-xs text-[var(--fg-muted)]">
              Each card opens Studio with that recipe. We do not invent a video
              wall of shared loops for recipes without unique footage.
            </p>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      </section>

      <VideoRail
        label="Product workflow references"
        title="Official cached examples · no claimed customer activity"
        href="/apps"
        items={suite}
        wide
      />

      <section className="px-2 py-6 sm:px-4">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-2 px-1">
          <div>
            <p className="section-label">Official Lab clips</p>
            <h2 className="mt-1 text-xl font-bold tracking-tight">
              Unique demos · tap to configure
            </h2>
            <p className="mt-1 max-w-xl text-xs text-[var(--fg-muted)]">
              {wall.length} unique Lab clips shown.
              {concepts > 0
                ? ` ${concepts} more concept recipes (no unique footage yet) live on the full preset list.`
                : null}
            </p>
          </div>
          <Link
            href="/effects"
            className="text-xs font-semibold text-[var(--mint)] hover:underline"
          >
            All presets →
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
