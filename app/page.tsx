import Link from "next/link";
import { APPS, MODELS } from "@/lib/catalog";
import { PRESETS } from "@/lib/presets";
import { PLANS } from "@/lib/pricing";
import { site } from "@/lib/site";
import { PresetsWall } from "@/components/PresetsWall";

/**
 * Home feed patterned on full AI creative suites:
 * featured model → apps row → viral presets → community → pricing.
 */
export default function Home() {
  const videoModels = MODELS.filter((m) => m.kind === "video");
  const liveApps = APPS.filter((a) => a.live).slice(0, 6);

  return (
    <div className="pb-16">
      {/* Featured banner — Seedance like HF hero */}
      <section className="relative overflow-hidden border-b border-[var(--border)]">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 80% at 50% -20%, rgba(214,255,77,.18), transparent), #050506",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-8 sm:py-16">
          <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[var(--lime)]">
            Now in studio
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl font-black leading-[0.95] tracking-tight sm:text-6xl">
            SEEDANCE 2.0
          </h1>
          <p className="mt-3 text-lg text-white/70">
            ByteDance image-to-video · already available on {site.name}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/create"
              className="rounded-full bg-[var(--lime)] px-6 py-3 text-sm font-bold text-black"
            >
              Try now
            </Link>
            <Link
              href="/models"
              className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white/80 hover:bg-white/5"
            >
              All models
            </Link>
          </div>
        </div>
      </section>

      {/* Quick apps strip */}
      <section className="border-b border-[var(--border)] px-4 py-8 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold">Apps</h2>
            <Link href="/apps" className="text-xs text-[var(--lime)]">
              View all
            </Link>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {liveApps.map((a) => (
              <Link
                key={a.id}
                href={a.href}
                className="flex min-w-[140px] flex-col gap-2 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 hover:border-[var(--lime)]/40"
              >
                <span className="text-2xl">{a.emoji}</span>
                <span className="text-xs font-semibold">{a.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Models */}
      <section className="border-b border-[var(--border)] px-4 py-10 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-5 flex items-end justify-between">
            <h2 className="text-xl font-bold">Video models</h2>
            <Link href="/models" className="text-xs text-[var(--lime)]">
              Browse
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {videoModels.map((m) => (
              <Link
                key={m.id}
                href={m.href}
                className="card overflow-hidden p-0 transition-transform hover:-translate-y-0.5"
              >
                <div className="h-24" style={{ background: m.gradient }} />
                <div className="p-3">
                  <div className="flex items-center justify-between gap-1">
                    <h3 className="text-sm font-semibold">{m.name}</h3>
                    {m.live && (
                      <span className="text-[9px] font-bold text-[var(--lime)]">
                        LIVE
                      </span>
                    )}
                  </div>
                  <p className="mt-1 line-clamp-2 text-[11px] text-[var(--fg-dim)]">
                    {m.blurb}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

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
              Agents & automation
            </h2>
            <p className="mt-2 text-sm text-[var(--fg-muted)]">
              Multi-step creative jobs surface (roadmap live as shell).
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

      {/* Community */}
      <section className="border-b border-[var(--border)] px-4 py-10 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-5 flex justify-between">
            <h2 className="text-xl font-bold">Community</h2>
            <Link href="/community" className="text-xs text-[var(--lime)]">
              Explore
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {PRESETS.slice(0, 4).map((p, i) => (
              <Link
                key={p.slug}
                href={`/create?effect=${p.slug}`}
                className="overflow-hidden rounded-xl border border-[var(--border)]"
              >
                <div
                  className="aspect-[4/3]"
                  style={{ background: p.gradient }}
                />
                <div className="p-2 text-[11px]">
                  <p className="font-semibold">{p.name}</p>
                  <p className="text-[var(--fg-dim)]">@user{i + 1}</p>
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
