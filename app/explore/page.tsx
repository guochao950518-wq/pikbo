import type { Metadata } from "next";
import Link from "next/link";
import { DEMO_VIDEOS } from "@/lib/demoVideos";
import { APPS } from "@/lib/catalog";
import { PRESETS, CATEGORIES } from "@/lib/presets";
import { USE_CASES } from "@/lib/usecases";

export const metadata: Metadata = {
  title: "Explore",
  description:
    "Explore Pikbo demos, apps, and toy video presets — image to video for designer toys.",
};

export default function ExplorePage() {
  return (
    <div className="px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <span className="chip">Explore</span>
        <h1 className="mt-3 text-3xl font-bold">Discover</h1>
        <p className="mt-2 max-w-2xl text-sm text-[var(--fg-muted)]">
          Demos, live tools, seller paths, and presets — toy-native explore
          surface. Everything links to a page you can generate on.
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          <Link href="/create" className="btn btn-primary text-sm">
            Generate
          </Link>
          <Link href="/supercomputer" className="btn btn-ghost text-sm">
            Batch
          </Link>
          <Link href="/guides" className="btn btn-ghost text-sm">
            Guides
          </Link>
        </div>

        <section className="mt-10">
          <div className="mb-4 flex items-end justify-between">
            <h2 className="text-xl font-bold">Demos</h2>
            <Link
              href="/community"
              className="text-xs text-[var(--brand)] hover:underline"
            >
              Community
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {DEMO_VIDEOS.map((d) => (
              <Link
                key={d.id}
                href={`/effects/${d.preset}`}
                className="card overflow-hidden p-0 transition-transform hover:-translate-y-1"
              >
                <div className="aspect-video bg-black/40">
                  <video
                    className="h-full w-full object-cover"
                    poster={d.poster}
                    muted
                    loop
                    playsInline
                    autoPlay
                    preload="metadata"
                  >
                    <source src={d.webm} type="video/webm" />
                    <source src={d.mp4} type="video/mp4" />
                  </video>
                </div>
                <div className="p-3">
                  <p className="text-[10px] font-bold uppercase text-[var(--brand)]">
                    {d.eyebrow}
                  </p>
                  <p className="font-semibold">{d.title}</p>
                  <p className="mt-0.5 text-[10px] text-[var(--mint)]">
                    Open tool page →
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="mb-4 text-xl font-bold">For sellers</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {USE_CASES.map((u) => (
              <Link
                key={u.slug}
                href={`/for/${u.slug}`}
                className="card flex gap-3 p-4 transition-transform hover:-translate-y-0.5"
              >
                <span className="text-2xl">{u.emoji}</span>
                <span>
                  <span className="block font-semibold">{u.label}</span>
                  <span className="line-clamp-2 text-xs text-[var(--fg-muted)]">
                    {u.intro}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="mb-4 text-xl font-bold">Live apps</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {APPS.filter((a) => a.live).map((a) => (
              <Link
                key={a.id}
                href={a.href}
                className="card flex gap-3 p-4 transition-transform hover:-translate-y-0.5"
              >
                <span className="text-2xl">{a.emoji}</span>
                <span>
                  <span className="block font-semibold">{a.name}</span>
                  <span className="text-xs text-[var(--fg-muted)]">
                    {a.blurb}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <div className="mb-4 flex justify-between">
            <h2 className="text-xl font-bold">Presets by category</h2>
            <Link
              href="/effects"
              className="text-xs text-[var(--brand)] hover:underline"
            >
              All {PRESETS.length}
            </Link>
          </div>
          {CATEGORIES.map((cat) => {
            const list = PRESETS.filter((p) => p.category === cat.id);
            if (list.length === 0) return null;
            return (
              <div key={cat.id} className="mb-6">
                <p className="text-xs font-bold uppercase tracking-wider text-[var(--fg-dim)]">
                  {cat.label}
                </p>
                <p className="mt-0.5 text-[11px] text-[var(--fg-muted)]">
                  {cat.blurb}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {list.map((p) => (
                    <Link
                      key={p.slug}
                      href={`/effects/${p.slug}`}
                      className="rounded-full border border-[var(--border)] px-3 py-1.5 text-xs hover:border-[var(--brand)]"
                    >
                      {p.emoji} {p.name}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </section>
      </div>
    </div>
  );
}
