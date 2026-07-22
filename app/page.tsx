import Link from "next/link";
import { PRESETS, CATEGORIES, presetsByCategory } from "@/lib/presets";
import { USE_CASES } from "@/lib/usecases";
import { PLANS } from "@/lib/pricing";
import { site } from "@/lib/site";

export default function Home() {
  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="glow-bg">
        <div className="container-x relative z-10 pt-20 pb-16 text-center">
          <span className="chip mx-auto">🧸 Built for designer toys & blind boxes</span>
          <h1 className="mx-auto mt-6 max-w-3xl text-5xl font-bold leading-[1.05] sm:text-6xl">
            Bring your <span className="text-grad">designer toys</span> to life
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-[var(--fg-muted)]">
            One photo of your figure, blind box, or art toy becomes a
            scroll-stopping video. Pick an effect, upload, done in seconds.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/create" className="btn btn-primary">
              Create a clip free →
            </Link>
            <Link href="#effects" className="btn btn-ghost">
              See the effects
            </Link>
          </div>
          <p className="mt-4 text-xs text-[var(--fg-dim)]">
            No filming. No rig. Free clips include a small watermark.
          </p>

          {/* Photo → Clip pipeline demo */}
          <div className="mx-auto mt-14 max-w-3xl">
            <div className="grid items-center gap-3 sm:grid-cols-[1fr_auto_1fr_auto_1fr]">
              <div className="card overflow-hidden p-0">
                <div
                  className="grid aspect-[3/4] place-items-center text-5xl"
                  style={{ background: PRESETS[0]?.gradient }}
                >
                  {PRESETS[0]?.emoji ?? "🧸"}
                </div>
                <p className="px-3 py-2 text-xs font-semibold text-[var(--fg-muted)]">
                  1. Your photo
                </p>
              </div>
              <span className="hidden text-2xl text-[var(--fg-dim)] sm:block">
                →
              </span>
              <div className="card overflow-hidden p-0">
                <div
                  className="grid aspect-[3/4] place-items-center text-5xl"
                  style={{ background: PRESETS[1]?.gradient }}
                >
                  {PRESETS[1]?.emoji ?? "✨"}
                </div>
                <p className="px-3 py-2 text-xs font-semibold text-[var(--fg-muted)]">
                  2. Pick effect
                </p>
              </div>
              <span className="hidden text-2xl text-[var(--fg-dim)] sm:block">
                →
              </span>
              <div className="card overflow-hidden p-0 ring-2 ring-[var(--mint)]/40">
                <div
                  className="relative grid aspect-[3/4] place-items-center text-5xl"
                  style={{ background: PRESETS[2]?.gradient }}
                >
                  {PRESETS[2]?.emoji ?? "🎬"}
                  <span className="absolute bottom-2 left-2 rounded bg-black/50 px-2 py-0.5 text-[10px] font-bold text-white">
                    ▶ clip
                  </span>
                </div>
                <p className="px-3 py-2 text-xs font-semibold text-[var(--mint)]">
                  3. Share / list
                </p>
              </div>
            </div>
            <p className="mt-4 text-center text-sm text-[var(--fg-dim)]">
              Built for toys you already own — not generic AI video playgrounds.
            </p>
          </div>

          {/* effect chips */}
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {PRESETS.slice(0, 4).map((p) => (
              <Link
                key={p.slug}
                href={`/create?effect=${p.slug}`}
                className="card group overflow-hidden p-0 transition-transform hover:-translate-y-1"
              >
                <div
                  className="grid aspect-[4/3] place-items-center text-4xl"
                  style={{ background: p.gradient }}
                >
                  <span className="drop-shadow-lg">{p.emoji}</span>
                </div>
                <div className="px-3 py-2 text-left">
                  <p className="text-sm font-semibold group-hover:text-[var(--mint)]">
                    {p.name}
                  </p>
                  <p className="truncate text-xs text-[var(--fg-dim)]">
                    {p.tagline}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Effects ---------- */}
      <section id="effects" className="container-x py-16">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-3xl font-bold">{PRESETS.length} effects, 4 ways to use them</h2>
            <p className="mt-2 text-[var(--fg-muted)]">
              Each effect is one tap. Some sell, some go viral — use both.
            </p>
          </div>
          <Link href="/effects" className="btn btn-ghost text-sm">
            Browse all effects
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          {CATEGORIES.map((cat) => {
            const items = presetsByCategory(cat.id);
            return (
              <Link
                key={cat.id}
                href={`/effects#${cat.id}`}
                className="card group p-6 transition-transform hover:-translate-y-1"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{cat.label}</h3>
                  <span className="text-2xl">
                    {items.map((p) => p.emoji).join(" ")}
                  </span>
                </div>
                <p className="mt-2 text-sm text-[var(--fg-muted)]">{cat.blurb}</p>
                <span className="mt-4 inline-flex text-sm font-medium text-[var(--mint)]">
                  {items.length} effects →
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ---------- Made for ---------- */}
      <section className="container-x py-8">
        <h2 className="text-2xl font-bold">Made for</h2>
        <div className="mt-5 flex flex-wrap gap-3">
          {USE_CASES.map((u) => (
            <Link
              key={u.slug}
              href={`/for/${u.slug}`}
              className="card px-4 py-3 text-sm font-medium transition-transform hover:-translate-y-0.5"
            >
              {u.emoji} {u.label}
            </Link>
          ))}
        </div>
      </section>

      {/* ---------- How it works ---------- */}
      <section id="how" className="container-x py-16">
        <h2 className="text-3xl font-bold text-center">Three steps</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            {
              n: "1",
              t: "Upload one photo",
              d: "A clean shot of a toy you own — figure, plush, blind box, custom.",
            },
            {
              n: "2",
              t: "Pick an effect",
              d: "Spin, unbox, dance, glam lighting, stop-motion, or a mini world.",
            },
            {
              n: "3",
              t: "Get your clip",
              d: "A shareable video in seconds. Post it, list it, or send it out.",
            },
          ].map((s) => (
            <div key={s.n} className="card p-6">
              <span
                className="grid h-10 w-10 place-items-center rounded-full font-bold text-[var(--bg)]"
                style={{ background: "var(--grad)" }}
              >
                {s.n}
              </span>
              <h3 className="mt-4 text-lg font-semibold">{s.t}</h3>
              <p className="mt-1.5 text-sm text-[var(--fg-muted)]">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Pricing ---------- */}
      <section id="pricing" className="container-x py-16">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Simple credits</h2>
          <p className="mt-2 text-[var(--fg-muted)]">
            1 clip ≈ 10 credits. Start free, upgrade when you post more.
          </p>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`card relative flex flex-col p-6 ${
                plan.featured ? "ring-2 ring-[var(--brand)]" : ""
              }`}
            >
              {plan.featured && (
                <span
                  className="absolute -top-3 left-6 rounded-full px-3 py-1 text-xs font-semibold text-white"
                  style={{ background: "var(--grad)" }}
                >
                  Most popular
                </span>
              )}
              <h3 className="text-lg font-semibold">{plan.name}</h3>
              <div className="mt-2 flex items-end gap-1">
                <span className="text-4xl font-bold">${plan.priceMonthly}</span>
                <span className="mb-1 text-sm text-[var(--fg-dim)]">/mo</span>
              </div>
              <p className="mt-2 text-sm text-[var(--fg-muted)]">{plan.blurb}</p>
              <ul className="mt-5 flex-1 space-y-2 text-sm">
                {plan.perks.map((perk) => (
                  <li key={perk} className="flex items-start gap-2">
                    <span className="text-[var(--mint)]">✓</span>
                    <span className="text-[var(--fg-muted)]">{perk}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={plan.id === "free" ? "/create" : "/pricing"}
                className={`btn mt-6 w-full ${
                  plan.featured ? "btn-primary" : "btn-ghost"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center text-xs text-[var(--fg-dim)]">
          Animate toys you own by uploading your own photos. {site.name} is not
          affiliated with any toy brand.
        </p>
      </section>

      {/* ---------- Final CTA ---------- */}
      <section className="container-x py-16">
        <div
          className="rounded-3xl p-10 text-center sm:p-16"
          style={{ background: "var(--grad)" }}
        >
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Your shelf is full of content
          </h2>
          <p className="mx-auto mt-3 max-w-md text-white/90">
            Turn the toys you already own into videos people stop to watch.
          </p>
          <Link
            href="/create"
            className="btn mt-7 bg-white px-7 py-3 font-semibold text-[var(--bg)] hover:opacity-90"
          >
            Create your first clip →
          </Link>
        </div>
      </section>
    </>
  );
}
