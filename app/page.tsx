import Link from "next/link";
import { APPS } from "@/lib/catalog";
import { PLANS } from "@/lib/pricing";
import { PresetsWall } from "@/components/PresetsWall";
import {
  HeroDemoStage,
  HomeDemoShowcase,
} from "@/components/HomeDemoShowcase";
import { HomeModelShelf } from "@/components/HomeModelShelf";
import { HowItWorks } from "@/components/HowItWorks";
import { TrustStrip } from "@/components/TrustStrip";
import { HeroUpload } from "@/components/HeroUpload";
import { DEMO_VIDEOS } from "@/lib/demoVideos";

/**
 * POP MART–inspired home: product theatre first, clean retail hierarchy.
 */
export default function Home() {
  const liveApps = APPS.filter((a) => a.live).slice(0, 6);
  const creator = PLANS.find((p) => p.id === "creator");

  return (
    <div className="pb-20">
      <section className="glow-bg overflow-hidden">
        <div className="container-x relative z-10 grid items-center gap-12 py-16 lg:min-h-[720px] lg:grid-cols-[1fr_1.05fr] lg:gap-16 lg:py-20">
          <div>
            <p className="section-label">Designer toy video</p>
            <h1 className="mt-5 max-w-xl font-[family-name:var(--font-display)] text-5xl font-semibold leading-[1.02] tracking-[-0.03em] text-[var(--fg)] sm:text-6xl lg:text-[3.75rem]">
              One photo.
              <br />
              A shelf that{" "}
              <span className="text-grad">moves.</span>
            </h1>
            <p className="mt-6 max-w-md text-base leading-7 text-[var(--fg-muted)] sm:text-lg sm:leading-8">
              Turn figures, blind boxes, and plush you own into listing clips and
              drop-day reels — no camera rig, no studio day.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/create" className="btn btn-primary px-7 py-3.5 text-sm">
                Start free
              </Link>
              <Link
                href="#examples"
                className="btn btn-ghost px-7 py-3.5 text-sm"
              >
                Watch demos
              </Link>
            </div>
            <p className="mt-4 text-xs text-[var(--fg-dim)]">
              ~3 free clips / month · No card · 480p with on-player mark
            </p>
            <HeroUpload />
            <div className="mt-8 flex flex-wrap gap-2">
              {[
                { href: "/effects/360-spin-showcase", t: "360° Spin" },
                { href: "/effects/blind-box-unboxing", t: "Blind box" },
                { href: "/for/etsy-listing-videos", t: "Etsy" },
                { href: "/for/tiktok-shop-product-videos", t: "TikTok Shop" },
              ].map((x) => (
                <Link
                  key={x.href}
                  href={x.href}
                  className="rounded-full border border-[var(--border)] bg-white px-3.5 py-1.5 text-xs font-medium text-[var(--fg-muted)] transition hover:border-[var(--fg)]/20 hover:text-[var(--fg)]"
                >
                  {x.t}
                </Link>
              ))}
            </div>
          </div>
          <HeroDemoStage />
        </div>
      </section>

      <TrustStrip />
      <HomeDemoShowcase />
      <HowItWorks />

      <section className="border-b border-[var(--border)] bg-white px-4 py-12 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <p className="section-label">Studio</p>
              <h2 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight">
                Tools
              </h2>
            </div>
            <Link
              href="/apps"
              className="text-xs font-semibold text-[var(--brand)] hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {liveApps.map((a) => (
              <Link
                key={a.id}
                href={a.href}
                className="card flex flex-col items-start gap-3 p-4 transition-transform hover:-translate-y-0.5"
              >
                <span className="text-2xl">{a.emoji}</span>
                <span className="text-sm font-semibold tracking-tight">
                  {a.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <HomeModelShelf />

      <section className="border-b border-[var(--border)] px-4 py-14 sm:px-8">
        <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-2">
          <Link href="/cinema" className="card group p-8 transition-transform hover:-translate-y-0.5">
            <p className="section-label">Cinema</p>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight group-hover:text-[var(--brand)]">
              Direct the shot
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--fg-muted)]">
              Lens, camera move, grade — then render with Seedance.
            </p>
          </Link>
          <Link
            href="/supercomputer"
            className="card group p-8 transition-transform hover:-translate-y-0.5"
          >
            <p className="section-label">Batch</p>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight group-hover:text-[var(--brand)]">
              Shop packs
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--fg-muted)]">
              One figure photo → spin, float, unbox in one queue.
            </p>
          </Link>
        </div>
      </section>

      <div className="border-b border-[var(--border)] bg-white">
        <PresetsWall
          heading="Looks"
          subheading="Gallery of motion recipes — open any card to generate on-page"
        />
      </div>

      <section className="border-b border-[var(--border)] px-4 py-14 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <p className="section-label">Pikbo Lab</p>
              <h2 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-semibold">
                Prototype recipes
              </h2>
            </div>
            <Link
              href="/community"
              className="text-xs font-semibold text-[var(--brand)] hover:underline"
            >
              Explore
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {DEMO_VIDEOS.slice(0, 4).map((demo) => (
              <Link
                key={demo.id}
                href={`/create?effect=${demo.preset}`}
                className="card overflow-hidden p-0"
              >
                <div className="aspect-[4/5] overflow-hidden bg-black">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={demo.poster}
                    alt={`${demo.character} ${demo.title} prototype poster`}
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.03]"
                  />
                </div>
                <div className="p-3">
                  <p className="text-sm font-semibold tracking-tight">{demo.title}</p>
                  <p className="mt-0.5 text-[11px] text-[var(--fg-dim)]">
                    Cached lab preview · use recipe
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-8">
        <div className="mx-auto max-w-xl text-center">
          <p className="section-label mx-auto">Membership</p>
          <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight">
            Simple credits
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[var(--fg-muted)]">
            Free to try. Creator from ${creator?.priceMonthly ?? 19}/mo for HD
            Seedance 2.0 and commercial listings.
          </p>
          <Link href="/pricing" className="btn btn-primary mt-8 px-8">
            View pricing
          </Link>
        </div>
      </section>
    </div>
  );
}
