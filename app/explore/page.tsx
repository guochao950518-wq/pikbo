import type { Metadata } from "next";
import Link from "next/link";
import { DEMO_VIDEOS } from "@/lib/demoVideos";
import { APPS } from "@/lib/catalog";
import { PRESETS } from "@/lib/presets";

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
          Demos, live apps, and presets in one feed — same “explore” surface as
          big AI video suites, toy-native.
        </p>

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
                href={`/create?effect=${d.preset}`}
                className="card overflow-hidden p-0 transition-transform hover:-translate-y-1"
              >
                <div className="aspect-video bg-black/40">
                  { }
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
                </div>
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
                className="card flex gap-3 p-4 hover:-translate-y-0.5 transition-transform"
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
            <h2 className="text-xl font-bold">Presets</h2>
            <Link
              href="/effects"
              className="text-xs text-[var(--brand)] hover:underline"
            >
              All {PRESETS.length}
            </Link>
          </div>
          <div className="flex flex-wrap gap-2">
            {PRESETS.slice(0, 12).map((p) => (
              <Link
                key={p.slug}
                href={`/create?effect=${p.slug}`}
                className="rounded-full border border-[var(--border)] px-3 py-1.5 text-xs hover:border-[var(--brand)]"
              >
                {p.emoji} {p.name}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
