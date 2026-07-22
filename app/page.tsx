import Link from "next/link";
import {
  buildVideoFeed,
  communityProjects,
  featuredStrip,
} from "@/lib/videoFeed";
import { HomeFeatureCarousel } from "@/components/HomeFeatureCarousel";
import { HomeToolShelf } from "@/components/HomeToolShelf";
import { HomeProjectsExplore } from "@/components/HomeProjectsExplore";
import { HomeViralWall } from "@/components/HomeViralWall";
import { SeedanceCampaign } from "@/components/SeedanceCampaign";
import { DEMO_VIDEOS } from "@/lib/demoVideos";

/**
 * Higgsfield-class Explore home (layout order mirrored):
 * 1) Horizontal promo video cards
 * 2) Tool / model chip shelf
 * 3) Projects rail — watch first
 * 4) Flagship Seedance campaign
 * 5) Dense viral presets masonry wall
 * 6) Batch / convert banners
 *
 * Content is designer-toy vertical; structure matches market-proven HF shell.
 */
export default function Home() {
  const projects = communityProjects();
  const feed = buildVideoFeed();
  const featured = featuredStrip();
  const hero = DEMO_VIDEOS[0];

  return (
    <div className="pb-28">
      {/* 1 — Promo video carousel (HF top rail) */}
      <HomeFeatureCarousel />

      {/* 2 — Tool shelf */}
      <HomeToolShelf />

      {/* 3 — Watch projects first */}
      <HomeProjectsExplore projects={projects} />

      {/* 4 — Flagship model campaign */}
      <SeedanceCampaign />

      {/* Mini horizontal lab strip (HF “view all of Seedance” density) */}
      <section className="border-b border-[var(--border)] py-4">
        <div className="mb-3 flex items-end justify-between px-4 sm:px-6">
          <div>
            <p className="section-label text-[var(--mint)]">Lab clips</p>
            <h2 className="mt-1 text-base font-bold tracking-tight sm:text-lg">
              Cached motion studies · free to watch
            </h2>
          </div>
          <Link
            href="/community"
            className="text-[11px] font-semibold text-[var(--mint)] hover:underline"
          >
            See all →
          </Link>
        </div>
        <div className="flex gap-2.5 overflow-x-auto px-4 pb-2 sm:px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {featured.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="relative h-44 w-28 shrink-0 overflow-hidden rounded-xl border border-white/10 sm:h-52 sm:w-32"
            >
              <video
                className="absolute inset-0 h-full w-full object-cover"
                poster={item.demo.poster}
                muted
                loop
                playsInline
                autoPlay
                preload="metadata"
              >
                <source src={item.demo.webm} type="video/webm" />
                <source src={item.demo.mp4} type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
              <span className="absolute inset-x-0 bottom-0 p-2 text-[10px] font-bold leading-tight text-white">
                {item.title}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 5 — Dense viral wall — main scroll retention */}
      <HomeViralWall items={feed} />

      {/* 6 — Batch / Supercomputer banner */}
      <section className="mx-3 mb-4 overflow-hidden rounded-2xl border border-[var(--border)] sm:mx-5">
        <Link
          href="/supercomputer"
          className="relative block min-h-[140px] overflow-hidden bg-[var(--card)]"
        >
          <video
            className="absolute inset-0 h-full w-full object-cover opacity-40"
            poster={hero.poster}
            muted
            loop
            playsInline
            autoPlay
          >
            <source src={hero.webm} type="video/webm" />
            <source src={hero.mp4} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
          <div className="relative z-10 flex flex-col justify-center px-5 py-8 sm:px-8">
            <p className="section-label text-[var(--mint)]">Batch agent</p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
              One photo → seller pack
            </h2>
            <p className="mt-2 max-w-md text-sm text-white/65">
              Spin · unbox · listing formats in one shop workflow
            </p>
            <span className="mt-4 inline-flex w-fit rounded-full bg-[var(--mint)] px-4 py-2 text-xs font-black text-black">
              Try Batch →
            </span>
          </div>
        </Link>
      </section>

      {/* Convert strip */}
      <section className="mx-3 mb-8 overflow-hidden rounded-2xl border border-[var(--border)] sm:mx-5">
        <div className="grid sm:grid-cols-2">
          <div className="relative min-h-[200px] bg-black">
            <video
              className="absolute inset-0 h-full w-full object-cover opacity-80"
              autoPlay
              muted
              loop
              playsInline
              poster={featured[1]?.demo.poster ?? hero.poster}
            >
              {featured[1] ? (
                <>
                  <source src={featured[1].demo.webm} type="video/webm" />
                  <source src={featured[1].demo.mp4} type="video/mp4" />
                </>
              ) : (
                <>
                  <source src={hero.webm} type="video/webm" />
                  <source src={hero.mp4} type="video/mp4" />
                </>
              )}
            </video>
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/30 to-transparent sm:bg-gradient-to-r" />
          </div>
          <div className="flex flex-col justify-center bg-[var(--card)] p-6 sm:p-8">
            <p className="section-label">Your turn</p>
            <p className="mt-2 text-xl font-bold tracking-tight sm:text-2xl">
              Done watching. Animate your figure.
            </p>
            <p className="mt-2 text-sm text-[var(--fg-muted)]">
              Free · ~1 Seedance Mini trial · watermark on free · demos unlimited
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link href="/create" className="btn btn-primary text-sm">
                Generate free
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
