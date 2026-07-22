import Link from "next/link";
import {
  buildVideoFeed,
  communityProjects,
  featuredStrip,
  suiteRail,
} from "@/lib/videoFeed";
import { VideoTile } from "@/components/VideoTile";
import { VideoRail } from "@/components/VideoRail";
import { HeroVideoBanner } from "@/components/HeroVideoBanner";
import { HeroUpload } from "@/components/HeroUpload";
import { SeedanceCampaign } from "@/components/SeedanceCampaign";
import { ProjectCard } from "@/components/ProjectCard";
import { PRESETS } from "@/lib/presets";

/**
 * Higgsfield-class home:
 * 1) Immersive full-bleed hero video
 * 2) Horizontal feature / suite rails (all video)
 * 3) Dense autoplay masonry wall
 * 4) Always-visible convert paths
 */
export default function Home() {
  const featured = featuredStrip();
  const suite = suiteRail();
  const feed = buildVideoFeed();
  const projects = communityProjects().slice(0, 3);

  return (
    <div className="pb-28">
      <HeroVideoBanner />

      {/* Sticky convert under hero */}
      <section className="sticky top-0 z-30 border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--bg)_92%,transparent)] backdrop-blur-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 sm:px-6">
          <p className="text-[12px] text-[var(--fg-dim)]">
            <span className="font-semibold text-[var(--fg)]">
              Scroll · cached Lab loops
            </span>{" "}
            · tap to open that recipe with your toy
          </p>
          <div className="flex gap-2">
            <Link
              href="/create"
              className="btn btn-primary !px-4 !py-1.5 text-xs"
            >
              Generate free
            </Link>
            <Link
              href="/pricing"
              className="btn btn-ghost !px-3 !py-1.5 text-xs"
            >
              Pricing
            </Link>
            <Link
              href="/supercomputer"
              className="btn btn-ghost !px-3 !py-1.5 text-xs"
            >
              Batch
            </Link>
          </div>
        </div>
      </section>

      <VideoRail
        label="PIKBO Lab examples"
        title="Cached motion studies"
        href="/community"
        items={featured}
      />

      <VideoRail
        label="Workflow previews"
        title="Configured engines & tools"
        href="/apps"
        items={suite}
        wide
      />

      <SeedanceCampaign />

      <section className="border-b border-[var(--border)] px-3 py-6 sm:px-5">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-2 px-1">
          <div>
            <p className="section-label">PIKBO Lab projects</p>
            <h2 className="mt-1 text-xl font-bold tracking-tight">
              Lab recipes · remake yours
            </h2>
          </div>
          <Link
            href="/community"
            className="text-xs font-semibold text-[var(--mint)] hover:underline"
          >
            All projects →
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      </section>

      {/* Quick category hops — keep scroll velocity high */}
      <section className="border-b border-[var(--border)] px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-0.5">
          <span className="shrink-0 text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--fg-dim)]">
            Jump
          </span>
          {[
            { href: "/effects", label: "All presets" },
            { href: "/explore", label: "Explore wall" },
            { href: "/community", label: "Community" },
            { href: "/cinema", label: "Cinema" },
            { href: "/supercomputer", label: "Batch" },
            { href: "/create", label: "Upload photo" },
          ].map((chip) => (
            <Link
              key={chip.href}
              href={chip.href}
              className="shrink-0 rounded-full border border-[var(--border)] bg-white/[0.03] px-3 py-1.5 text-[11px] font-semibold text-[var(--fg-muted)] transition hover:border-[var(--mint)] hover:text-[var(--mint)]"
            >
              {chip.label}
            </Link>
          ))}
        </div>
      </section>

      <section className="border-b border-[var(--border)] px-4 py-5 sm:px-6">
        <p className="section-label mb-2">Start with your photo</p>
        <div className="mx-auto max-w-lg">
          <HeroUpload />
        </div>
      </section>

      <section className="px-3 py-6 sm:px-5">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-2 px-1">
          <div>
            <p className="section-label">Viral presets</p>
            <h2 className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">
              {PRESETS.length}+ recipes · Lab motion previews
            </h2>
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

      <section className="mx-4 mb-6 overflow-hidden rounded-2xl border border-[var(--border)] sm:mx-6">
        <div className="grid sm:grid-cols-2">
          <div className="relative min-h-[180px] bg-black">
            {/* decorative loop using first demo */}
            <video
              className="absolute inset-0 h-full w-full object-cover opacity-70"
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
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent sm:bg-gradient-to-r" />
          </div>
          <div className="flex flex-col justify-center bg-[var(--card)] p-6 sm:p-8">
            <p className="section-label">Convert</p>
            <p className="mt-2 text-lg font-bold tracking-tight">
              Stop scrolling. Animate your figure.
            </p>
            <p className="mt-2 text-sm text-[var(--fg-muted)]">
              Free · ~3 clips · Seedance Fast · watermark on free
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link href="/create" className="btn btn-primary text-sm">
                Open Generate
              </Link>
              <Link href="/pricing" className="btn btn-ghost text-sm">
                Pricing
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
