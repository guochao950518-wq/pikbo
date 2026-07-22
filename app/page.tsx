import Link from "next/link";
import { APPS } from "@/lib/catalog";
import { PRESETS } from "@/lib/presets";
import { PLANS } from "@/lib/pricing";
import { PresetsWall } from "@/components/PresetsWall";
import {
  HeroDemoStage,
  HomeDemoShowcase,
} from "@/components/HomeDemoShowcase";
import { HomeModelShelf } from "@/components/HomeModelShelf";
import { HowItWorks } from "@/components/HowItWorks";
import { TrustStrip } from "@/components/TrustStrip";
import { DEMO_VIDEOS } from "@/lib/demoVideos";

/**
 * Home feed patterned on full AI creative suites:
 * featured model → apps row → viral presets → community → pricing.
 */
export default function Home() {
  const liveApps = APPS.filter((a) => a.live).slice(0, 6);

  return (
    <div className="pb-16">
      {/* Toy-first conversion hero inside the shared AI-suite shell. */}
      <section className="glow-bg overflow-hidden border-b border-[var(--border)]">
        <div className="container-x relative z-10 grid items-center gap-12 py-14 sm:py-18 lg:min-h-[760px] lg:grid-cols-[.86fr_1.14fr] lg:py-20">
          <div>
            <span className="chip">✦ AI video for toys you already own</span>
            <h1 className="mt-6 max-w-2xl text-5xl font-bold leading-[.98] tracking-[-0.045em] sm:text-6xl xl:text-7xl">
              One toy photo.
              <br />
              A whole <span className="text-grad">content drop.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-[var(--fg-muted)]">
              Turn a figure, blind box, plush, or custom toy you own into listing videos, launch hooks, and collector reels—without a camera rig.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/create" className="btn btn-primary px-6 py-3.5 text-sm">
                Animate my toy free →
              </Link>
              <Link href="#examples" className="btn btn-ghost px-6 py-3.5 text-sm">
                Watch real examples
              </Link>
            </div>
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs text-[var(--fg-dim)]">
              <span>✓ 3 free clips</span>
              <span>✓ No card to try</span>
              <span>✓ Free exports show a Pikbo watermark</span>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              <Link href="/effects/360-spin-showcase" className="chip hover:border-[var(--brand)]">
                🌀 360° spin
              </Link>
              <Link href="/effects/blind-box-unboxing" className="chip hover:border-[var(--brand)]">
                📦 Blind box
              </Link>
              <Link href="/for/etsy-listing-videos" className="chip hover:border-[var(--brand)]">
                🛍️ Etsy listings
              </Link>
              <Link href="/for/tiktok-shop-product-videos" className="chip hover:border-[var(--brand)]">
                🎵 TikTok Shop
              </Link>
              <Link href="/guides" className="chip hover:border-[var(--brand)]">
                📖 Guides
              </Link>
            </div>
            <div className="mt-10 grid max-w-lg grid-cols-3 border-y border-white/10 py-4">
              <div>
                <p className="text-xl font-bold text-white">1 photo</p>
                <p className="mt-1 text-[11px] text-[var(--fg-dim)]">Your owned toy</p>
              </div>
              <div className="border-x border-white/10 px-4">
                <p className="text-xl font-bold text-white">{PRESETS.length} looks</p>
                <p className="mt-1 text-[11px] text-[var(--fg-dim)]">Toy-first presets</p>
              </div>
              <div className="pl-4">
                <p className="text-xl font-bold text-white">3 formats</p>
                <p className="mt-1 text-[11px] text-[var(--fg-dim)]">Post, list, launch</p>
              </div>
            </div>
          </div>
          <HeroDemoStage />
        </div>
      </section>

      <TrustStrip />
      <HomeDemoShowcase />
      <HowItWorks />

      {/* Quick apps strip */}
      <section className="border-b border-[var(--border)] px-4 py-8 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold">Apps</h2>
            <Link
              href="/apps"
              className="text-xs font-medium text-[var(--brand)] hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {liveApps.map((a) => (
              <Link
                key={a.id}
                href={a.href}
                className="card flex min-w-[140px] flex-col gap-2 p-4 transition-transform hover:-translate-y-0.5"
              >
                <span className="text-2xl">{a.emoji}</span>
                <span className="text-xs font-semibold">{a.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <HomeModelShelf />

      {/* Cinema + Supercomputer promos */}
      <section className="border-b border-[var(--border)] px-4 py-10 sm:px-8">
        <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-2">
          <Link
            href="/cinema"
            className="card group relative overflow-hidden p-6"
          >
            <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--lime)]">
              Cinema Studio
            </p>
            <h2 className="mt-2 text-2xl font-bold group-hover:text-[var(--lime)]">
              Direct the shot
            </h2>
            <p className="mt-2 text-sm text-[var(--fg-muted)]">
              Lens, camera move, grade → render with Seedance.
            </p>
          </Link>
          <Link
            href="/supercomputer"
            className="card group relative overflow-hidden p-6"
          >
            <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--lime)]">
              Supercomputer
            </p>
            <h2 className="mt-2 text-2xl font-bold group-hover:text-[var(--lime)]">
              Batch generate
            </h2>
            <p className="mt-2 text-sm text-[var(--fg-muted)]">
              Queue multiple toy references into trackable channel-ready jobs.
            </p>
          </Link>
        </div>
      </section>

      <div className="border-b border-[var(--border)]">
        <PresetsWall
          heading="Viral presets"
          subheading="One tap → Generate with motion recipe loaded"
        />
      </div>

      {/* Lab examples: owned cached prototypes, never presented as user posts. */}
      <section className="border-b border-[var(--border)] px-4 py-10 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-5 flex justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--mint)]">
                Pikbo Lab
              </p>
              <h2 className="mt-1 text-xl font-bold">Prototype recipes</h2>
            </div>
            <Link href="/community" className="text-xs text-[var(--lime)]">
              View every lab example
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {DEMO_VIDEOS.slice(0, 4).map((demo) => (
              <Link
                key={demo.id}
                href={`/create?effect=${demo.preset}`}
                className="group overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)]"
              >
                <div className="aspect-[4/3] overflow-hidden bg-black">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={demo.poster}
                    alt={`${demo.character} ${demo.title} prototype poster`}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="p-3 text-[11px]">
                  <p className="font-semibold">{demo.title}</p>
                  <p className="mt-1 text-[var(--fg-dim)]">
                    Cached lab preview · use recipe →
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing teaser */}
      <section className="px-4 py-12 sm:px-8">
        <div className="mx-auto max-w-6xl text-center">
          <h2 className="text-2xl font-bold">Upgrade your plan</h2>
          <p className="mt-2 text-sm text-[var(--fg-muted)]">
            Credits for Seedance · free watermarked trials
          </p>
          <div className="mt-8 grid gap-4 text-left md:grid-cols-3">
            {PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`card p-5 ${plan.featured ? "ring-2 ring-[var(--lime)]" : ""}`}
              >
                <h3 className="font-semibold">{plan.name}</h3>
                <p className="mt-1 text-3xl font-bold">${plan.priceMonthly}</p>
                <Link
                  href="/pricing"
                  className="mt-4 inline-block text-sm font-semibold text-[var(--lime)]"
                >
                  {plan.cta} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
