import Link from "next/link";
import { PRESETS } from "@/lib/presets";
import { PLANS } from "@/lib/pricing";
import { site } from "@/lib/site";

/** Higgsfield-class home: model shelf + preset wall + CTA into Generate */
export default function Home() {
  return (
    <div className="pb-16">
      {/* Hero strip */}
      <section className="border-b border-[var(--border)] px-4 py-10 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--mint)]">
            AI video studio
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl font-bold leading-tight sm:text-5xl">
            Create videos with{" "}
            <span className="text-grad">Seedance</span> & pro presets
          </h1>
          <p className="mt-4 max-w-xl text-[var(--fg-muted)]">
            Image-to-video workspace in the style of modern AI film tools —
            pick a model, drop a reference, hit generate. Niche focus:
            designer toys & product clips.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/create" className="btn btn-primary">
              Open Generate →
            </Link>
            <Link href="/effects" className="btn btn-ghost">
              Browse presets
            </Link>
          </div>
        </div>
      </section>

      {/* Model cards — HF "explore models" */}
      <section className="px-4 py-10 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-5 flex items-end justify-between">
            <h2 className="text-xl font-bold">Models</h2>
            <span className="text-xs text-[var(--fg-dim)]">via fal · ByteDance</span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: "Seedance 2.0",
                tag: "Default · Paid",
                desc: "ByteDance flagship image-to-video. Cinematic motion for product & figure shots.",
                href: "/create",
                accent: "from-[#6ee7c7] to-[#a855f7]",
              },
              {
                name: "Seedance Fast",
                tag: "Free tier",
                desc: "Lower latency / cost path for free credits. Same family, lighter settings.",
                href: "/create",
                accent: "from-[#ff4d8d] to-[#a855f7]",
              },
              {
                name: "More models",
                tag: "Roadmap",
                desc: "Kling / others can plug in later — architecture is multi-model ready.",
                href: "/pricing",
                accent: "from-[#2a2340] to-[#1f1930]",
              },
            ].map((m) => (
              <Link
                key={m.name}
                href={m.href}
                className="card group overflow-hidden p-0 transition-transform hover:-translate-y-1"
              >
                <div
                  className={`h-28 bg-gradient-to-br ${m.accent} opacity-90`}
                />
                <div className="p-4">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-semibold group-hover:text-[var(--mint)]">
                      {m.name}
                    </h3>
                    <span className="text-[10px] text-[var(--fg-dim)]">
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

      {/* Viral presets wall */}
      <section className="border-t border-[var(--border)] px-4 py-10 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-5 flex items-end justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold">Viral presets</h2>
              <p className="text-sm text-[var(--fg-dim)]">
                One tap → Generate with motion prompt filled
              </p>
            </div>
            <Link
              href="/effects"
              className="text-sm font-medium text-[var(--mint)] hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {PRESETS.map((p) => (
              <Link
                key={p.slug}
                href={`/create?effect=${p.slug}`}
                className="group overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] transition-transform hover:-translate-y-0.5"
              >
                <div
                  className="grid aspect-[3/4] place-items-center text-4xl"
                  style={{ background: p.gradient }}
                >
                  <span className="drop-shadow-lg transition-transform group-hover:scale-110">
                    {p.emoji}
                  </span>
                </div>
                <div className="p-2.5">
                  <p className="truncate text-xs font-semibold">{p.name}</p>
                  <p className="truncate text-[10px] text-[var(--fg-dim)]">
                    {p.tagline}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Community teaser */}
      <section className="border-t border-[var(--border)] px-4 py-10 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-5 flex items-end justify-between">
            <h2 className="text-xl font-bold">From the community</h2>
            <Link
              href="/community"
              className="text-sm text-[var(--mint)] hover:underline"
            >
              Explore
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {PRESETS.slice(0, 4).map((p, i) => (
              <div
                key={p.slug}
                className="card overflow-hidden p-0"
              >
                <div
                  className="aspect-video"
                  style={{ background: p.gradient }}
                />
                <div className="p-3 text-sm">
                  <p className="font-medium">{p.name} study</p>
                  <p className="text-xs text-[var(--fg-dim)]">
                    @{["studio", "seller", "collector", "lab"][i]} · public
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing strip */}
      <section className="border-t border-[var(--border)] px-4 py-10 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-xl font-bold">Simple credits</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`card p-5 ${plan.featured ? "ring-2 ring-[var(--brand)]" : ""}`}
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
                  href={plan.id === "free" ? "/create" : "/pricing"}
                  className={`btn mt-4 w-full text-sm ${
                    plan.featured ? "btn-primary" : "btn-ghost"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-xs text-[var(--fg-dim)]">
            {site.name} — structure inspired by leading AI video apps; original
            brand & toy niche product.
          </p>
        </div>
      </section>
    </div>
  );
}
