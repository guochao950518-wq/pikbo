import Link from "next/link";
import { buildVideoFeed, communityProjects } from "@/lib/videoFeed";
import { HomeFeatureCarousel } from "@/components/HomeFeatureCarousel";
import { HomeToolShelf } from "@/components/HomeToolShelf";
import { HomeProjectsExplore } from "@/components/HomeProjectsExplore";
import { HomeViralWall } from "@/components/HomeViralWall";
import { SeedanceCampaign } from "@/components/SeedanceCampaign";
import { DEMO_VIDEOS } from "@/lib/demoVideos";
import { AutoPlayVideo } from "@/components/AutoPlayVideo";

/**
 * Higgsfield Explore home — video first, chrome second.
 * Order mirrors higgsfield.ai: promo rail → tools → projects → campaign → viral grid.
 */
export default function Home() {
  const projects = communityProjects();
  const feed = buildVideoFeed();
  const hero = DEMO_VIDEOS[1] ?? DEMO_VIDEOS[0];

  return (
    <div className="bg-black pb-24 text-white">
      {/* 1 — Giant promo video cards */}
      <HomeFeatureCarousel />

      {/* 2 — Model / tool shelf */}
      <HomeToolShelf />

      {/* 3 — Project explore rail */}
      <HomeProjectsExplore projects={projects} />

      {/* 4 — Seedance campaign */}
      <SeedanceCampaign />

      {/* 5 — Dense viral preset grid */}
      <HomeViralWall items={feed} />

      {/* 6 — Supercomputer / Batch banner */}
      <section className="mx-3 mb-6 overflow-hidden rounded-3xl border border-white/[0.08] sm:mx-4">
        <Link href="/supercomputer" className="relative block min-h-[180px]">
          <AutoPlayVideo
            poster={hero.poster}
            webm={hero.webm}
            mp4={hero.mp4}
            className="absolute inset-0 h-full w-full object-cover opacity-45"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/75 to-transparent" />
          <div className="relative z-10 flex flex-col justify-center px-6 py-10 sm:px-10">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--mint)]">
              Batch agent
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
              One superagent
              <span className="block text-white/70">for seller packs</span>
            </h2>
            <span className="mt-5 inline-flex w-fit rounded-full bg-[var(--mint)] px-5 py-2.5 text-xs font-black text-black">
              Try Batch
            </span>
          </div>
        </Link>
      </section>
    </div>
  );
}
