import Link from "next/link";
import { APPS, MODELS } from "@/lib/catalog";
import { PRESETS } from "@/lib/presets";
import { PLANS } from "@/lib/pricing";
import { site } from "@/lib/site";
import { PresetsWall } from "@/components/PresetsWall";

/**
 * Structure = full AI suite. Style = Pikbo (toys, candy pink/violet).
 */
export default function Home() {
  const videoModels = MODELS.filter((m) => m.kind === "video");
  const liveApps = APPS.filter((a) => a.live).slice(0, 6);

  return (
    <div className="pb-16">
      {/* Hero — suite power + toy soul */}
      <section className="relative overflow-hidden border-b border-[var(--border)]">
        <div className="glow-bg absolute inset-0" />
        <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-8 sm:py-16">
          <div className="flex flex-wrap items-center gap-2">
            <span className="chip">🧸 Designer toys & collectibles</span>
            <span className="rounded-full border border-[var(--mint)]/30 px-2.5 py-0.5 text-[10px] font-bold text-[var(--mint)]">
              Seedance 2.0
            </span>
          </div>
          <h1 className="mt-5 max-w-3xl text-4xl font-bold leading-[1.05] sm:text-5xl md:text-6xl">
            Bring your{" "}
            <span className="text-grad">designer toys</span> to life
          </h1>
          <p className="mt-4 max-w-xl text-base text-[var(--fg-muted)] sm:text-lg">
            Pro AI video workspace — models, presets, cinema tools — tuned for
            figures, blind boxes, and product clips. Not another faceless
            meme factory.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/create" className="btn btn-primary px-7">
              Open Generate →
            </Link>
            <Link href="/effects" className="btn btn-ghost">
              Toy presets
            </Link>
            <Link href="/apps" className="btn btn-ghost text-[var(--fg-muted)]">
              All apps
            </Link>
          </div>
        </div>
      </section>

      {/* Apps strip */}
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
                className="card flex min-w-[132px] flex-col gap-2 p-4 transition-transform hover:-translate-y-0.5"
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
          <div className="mb-5 flex items-end justify-between gap-2">
            <div>
              <h2 className="text-xl font-bold">Models</h2>
              <p className="text-sm text-[var(--fg-dim)]">
                ByteDance Seedance live · more slots as we grow
              </p>
            </div>
            <Link
              href="/models"
              className="text-xs font-medium text-[var(--brand)] hover:underline"
            >
              Browse
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {videoModels.map((m) => (
              <Link
                key={m.id}
                href={m.href}
                className="card group overflow-hidden p-0 transition-transform hover:-translate-y-1"
              >
                <div className="h-24" style={{ background: m.gradient }} />
                <div className="p-3">
                  <div className="flex items-center justify-between gap-1">
                    <h3 className="text-sm font-semibold group-hover:text-[var(--brand)]">
                      {m.name}
                    </h3>
                    {m.live && (
                      <span className="text-[9px] font-bold text-[var(--mint)]">
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

      {/* Cinema + Supercomputer */}
      <section className="border-b border-[var(--border)] px-4 py-10 sm:px-8">
        <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-2">
          <Link href="/cinema" className="card group p-6 hover:-translate-y-0.5 transition-transform">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--brand)]">
              Cinema Studio
            </p>
            <h2 className="mt-2 text-2xl font-bold group-hover:text-grad">
              Direct the shot
            </h2>
            <p className="mt-2 text-sm text-[var(--fg-muted)]">
              Lens, move, grade — then render your figure on Seedance.
            </p>
          </Link>
          <Link
            href="/supercomputer"
            className="card group p-6 transition-transform hover:-translate-y-0.5"
          >
            <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--brand-2)]">
              Supercomputer
            </p>
            <h2 className="mt-2 text-2xl font-bold">Agents next</h2>
            <p className="mt-2 text-sm text-[var(--fg-muted)]">
              Batch shop videos & automations — shell ready.
            </p>
          </Link>
        </div>
      </section>

      <div className="border-b border-[var(--border)]">
        <PresetsWall
          heading="Toy video presets"
          subheading="Spin · unbox · come alive — tap to open Generate"
        />
      </div>

      {/* Explore */}
      <section className="border-b border-[var(--border)] px-4 py-10 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-5 flex justify-between">
            <h2 className="text-xl font-bold">From the shelf</h2>
            <Link
              href="/community"
              className="text-xs font-medium text-[var(--brand)] hover:underline"
            >
              Community
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {PRESETS.slice(0, 4).map((p, i) => (
              <Link
                key={p.slug}
                href={`/create?effect=${p.slug}`}
                className="card overflow-hidden p-0 transition-transform hover:-translate-y-0.5"
              >
                <div
                  className="grid aspect-[4/3] place-items-center text-4xl"
                  style={{ background: p.gradient }}
                >
                  {p.emoji}
                </div>
                <div className="p-2.5 text-[11px]">
                  <p className="font-semibold">{p.name}</p>
                  <p className="text-[var(--fg-dim)]">@collector{i + 1}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="px-4 py-12 sm:px-8">
        <div className="mx-auto max-w-6xl text-center">
          <h2 className="text-2xl font-bold">Simple credits</h2>
          <p className="mt-2 text-sm text-[var(--fg-muted)]">
            Free watermarked trials · paid HD Seedance for sellers
          </p>
          <div className="mt-8 grid gap-4 text-left md:grid-cols-3">
            {PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`card p-5 ${
                  plan.featured ? "ring-2 ring-[var(--brand)]" : ""
                }`}
              >
                <h3 className="font-semibold">{plan.name}</h3>
                <p className="mt-1 text-3xl font-bold">
                  ${plan.priceMonthly}
                  <span className="text-sm font-normal text-[var(--fg-dim)]">
                    /mo
                  </span>
                </p>
                <p className="mt-2 text-sm text-[var(--fg-muted)]">{plan.blurb}</p>
                <Link
                  href="/pricing"
                  className="mt-4 inline-block text-sm font-semibold text-[var(--brand)] hover:underline"
                >
                  {plan.cta} →
                </Link>
              </div>
            ))}
          </div>
          <p className="mt-8 text-[10px] text-[var(--fg-dim)]">
            {site.name} — suite structure, original toy-native brand
          </p>
        </div>
      </section>
    </div>
  );
}
