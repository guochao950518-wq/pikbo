import Link from "next/link";
import { PRESETS } from "@/lib/presets";
import { PLANS } from "@/lib/pricing";
import { site } from "@/lib/site";
import { PresetsWall } from "@/components/PresetsWall";

/** Higgsfield-class home: hero → models → dense presets → community → pricing */
export default function Home() {
  return (
    <div className="pb-20">
      {/* Cinematic hero */}
      <section className="relative overflow-hidden border-b border-[var(--border)]">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(80% 60% at 20% 0%, rgba(255,77,141,.25), transparent), radial-gradient(60% 50% at 90% 20%, rgba(110,231,199,.15), transparent)",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-8 sm:py-20">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-[var(--mint)]/40 bg-[color-mix(in_srgb,var(--mint)_12%,transparent)] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--mint)]">
              Seedance 2.0 live
            </span>
            <span className="text-[10px] text-[var(--fg-dim)]">
              ByteDance · image-to-video
            </span>
          </div>
          <h1 className="mt-5 max-w-3xl text-4xl font-bold leading-[1.05] sm:text-6xl">
            The AI video app for{" "}
            <span className="text-grad">clips that sell</span>
          </h1>
          <p className="mt-5 max-w-xl text-base text-[var(--fg-muted)] sm:text-lg">
            Same workflow as the big generators: pick a model, drop a photo, hit
            Generate. Built for designer toys, figures, and product listings —
            not a generic playground dump.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/create" className="btn btn-primary px-8">
              Generate now
            </Link>
            <Link href="/effects" className="btn btn-ghost">
              Viral presets
            </Link>
            <Link
              href="/community"
              className="btn btn-ghost text-[var(--fg-muted)]"
            >
              Community
            </Link>
          </div>

          {/* Mini pipeline */}
          <div className="mt-12 grid max-w-2xl grid-cols-3 gap-2 text-center text-[10px] font-semibold uppercase tracking-wide text-[var(--fg-dim)] sm:gap-4 sm:text-xs">
            {["1 · Reference", "2 · Preset + model", "3 · Clip out"].map(
              (s) => (
                <div
                  key={s}
                  className="rounded-xl border border-[var(--border)] bg-[var(--card)]/80 py-3"
                >
                  {s}
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* Models */}
      <section className="border-b border-[var(--border)] px-4 py-12 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 flex items-end justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold">Models</h2>
              <p className="text-sm text-[var(--fg-dim)]">
                Featured engines — default is ByteDance Seedance
              </p>
            </div>
            <Link
              href="/create"
              className="text-sm font-medium text-[var(--mint)] hover:underline"
            >
              Open studio
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: "Seedance 2.0",
                tag: "Featured",
                desc: "Flagship image-to-video. Motion that holds product detail.",
                href: "/create",
                g: "linear-gradient(135deg,#6ee7c7,#a855f7)",
              },
              {
                name: "Seedance Fast",
                tag: "Free tier",
                desc: "Faster path for free credits. Same family, lower cost.",
                href: "/create",
                g: "linear-gradient(135deg,#ff4d8d,#a855f7)",
              },
              {
                name: "Preset stack",
                tag: `${PRESETS.length} effects`,
                desc: "One-tap motion recipes → studio prefilled.",
                href: "/effects",
                g: "linear-gradient(135deg,#2a2340,#6a5cff)",
              },
            ].map((m) => (
              <Link
                key={m.name}
                href={m.href}
                className="card group overflow-hidden p-0 transition-transform hover:-translate-y-1"
              >
                <div className="h-32" style={{ background: m.g }} />
                <div className="p-4">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-semibold group-hover:text-[var(--mint)]">
                      {m.name}
                    </h3>
                    <span className="text-[10px] font-bold uppercase tracking-wide text-[var(--fg-dim)]">
                      {m.tag}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-[var(--fg-muted)]">{m.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Dense presets — Claude PresetsWall */}
      <div className="border-b border-[var(--border)]">
        <PresetsWall
          heading="Viral presets"
          subheading="Tap any card → Generate opens with that effect loaded."
        />
      </div>

      {/* Community strip */}
      <section className="border-b border-[var(--border)] px-4 py-12 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold">Explore</h2>
              <p className="text-sm text-[var(--fg-dim)]">
                Community wall pattern (mock until public shares ship)
              </p>
            </div>
            <Link
              href="/community"
              className="text-sm font-medium text-[var(--mint)] hover:underline"
            >
              See all
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {PRESETS.slice(0, 4).map((p, i) => (
              <Link
                key={p.slug}
                href={`/create?effect=${p.slug}`}
                className="card overflow-hidden p-0 transition-transform hover:-translate-y-0.5"
              >
                <div
                  className="aspect-video"
                  style={{ background: p.gradient }}
                />
                <div className="p-3 text-sm">
                  <p className="font-medium">{p.name}</p>
                  <p className="text-xs text-[var(--fg-dim)]">
                    @{["nova", "shelf", "drop", "lab"][i]} · public
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="px-4 py-14 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-2xl font-bold">Pricing</h2>
          <p className="mx-auto mt-2 max-w-md text-center text-sm text-[var(--fg-muted)]">
            Credits SaaS — free watermarked trials, paid HD + commercial
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`card flex flex-col p-6 ${
                  plan.featured ? "ring-2 ring-[var(--brand)]" : ""
                }`}
              >
                <h3 className="font-semibold">{plan.name}</h3>
                <p className="mt-2 text-3xl font-bold">
                  ${plan.priceMonthly}
                  <span className="text-sm font-normal text-[var(--fg-dim)]">
                    /mo
                  </span>
                </p>
                <p className="mt-2 flex-1 text-sm text-[var(--fg-muted)]">
                  {plan.blurb}
                </p>
                <Link
                  href={plan.id === "free" ? "/create" : "/pricing"}
                  className={`btn mt-5 w-full text-sm ${
                    plan.featured ? "btn-primary" : "btn-ghost"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
          <p className="mt-8 text-center text-[10px] text-[var(--fg-dim)]">
            {site.name} · original product · structure inspired by leading AI
            video apps
          </p>
        </div>
      </section>
    </div>
  );
}
