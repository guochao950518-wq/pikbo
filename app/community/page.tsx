import type { Metadata } from "next";
import Link from "next/link";
import { DEMO_VIDEOS } from "@/lib/demoVideos";
import { PRESETS } from "@/lib/presets";

export const metadata: Metadata = {
  title: "Community",
  description:
    "Explore toy video demos and presets on Pikbo — spin, unbox, float from one photo.",
};

export default function CommunityPage() {
  return (
    <div className="px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <span className="chip">Community</span>
        <h1 className="mt-3 text-2xl font-bold">From the shelf</h1>
        <p className="mt-1 max-w-2xl text-sm text-[var(--fg-muted)]">
          Real Pikbo demos (no credit cost) plus every preset tool page. User
          UGC lands here after accounts — for now these are official demos you
          can remake.
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          <Link href="/create" className="btn btn-primary text-sm">
            Make your own →
          </Link>
          <Link href="/explore" className="btn btn-ghost text-sm">
            Explore feed
          </Link>
          <Link href="/effects" className="btn btn-ghost text-sm">
            All presets
          </Link>
        </div>

        <h2 className="mt-10 text-lg font-bold">Featured demos</h2>
        <p className="mt-1 text-xs text-[var(--fg-dim)]">
          Tap a card → open the matching tool page and generate with your toy.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {DEMO_VIDEOS.map((d) => (
            <Link
              key={d.id}
              href={`/effects/${d.preset}`}
              className="card group overflow-hidden p-0 transition-transform hover:-translate-y-1"
            >
              <div className="aspect-[9/14] bg-black/50 sm:aspect-video">
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
              <div className="p-4">
                <p className="text-[10px] font-bold uppercase tracking-wide text-[var(--brand)]">
                  {d.eyebrow}
                </p>
                <p className="font-semibold group-hover:text-[var(--brand)]">
                  {d.title}
                </p>
                <p className="mt-1 text-xs text-[var(--fg-muted)]">{d.result}</p>
                <p className="mt-2 text-[10px] text-[var(--mint)]">
                  Remake this look →
                </p>
              </div>
            </Link>
          ))}
        </div>

        <h2 className="mt-12 text-lg font-bold">All presets</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {PRESETS.map((p) => (
            <Link
              key={p.slug}
              href={`/effects/${p.slug}`}
              className="card flex items-center gap-3 p-3 transition-transform hover:-translate-y-0.5"
            >
              <span
                className="grid h-12 w-12 place-items-center rounded-xl text-xl"
                style={{ background: p.gradient }}
              >
                {p.emoji}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold">
                  {p.name}
                </span>
                <span className="block truncate text-[11px] text-[var(--fg-dim)]">
                  {p.tagline}
                </span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
