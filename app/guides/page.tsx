import type { Metadata } from "next";
import Link from "next/link";
import { GUIDES } from "@/lib/guides";

export const metadata: Metadata = {
  title: "Guides",
  description:
    "How-to guides for making great AI videos of designer toys, figures, and blind boxes — spin videos, photo tips, and content ideas.",
  alternates: { canonical: "/guides" },
};

export default function GuidesHub() {
  return (
    <div className="container-x py-14">
      <div className="max-w-2xl">
        <span className="chip">📚 Guides</span>
        <h1 className="mt-4 text-4xl font-bold sm:text-5xl">
          Make better toy videos
        </h1>
        <p className="mt-4 text-lg text-[var(--fg-muted)]">
          Short, practical guides for turning photos of the toys you own into
          videos that sell and get shared.
        </p>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link href="/create" className="btn btn-primary text-sm">
          Open Generate
        </Link>
        <Link href="/modules" className="btn btn-ghost text-sm">
          Toy Modules
        </Link>
        <Link href="/create?mode=seller-pack" className="btn btn-ghost text-sm">
          Seller Pack
        </Link>
        <Link href="/effects" className="btn btn-ghost text-sm">
          Presets
        </Link>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {GUIDES.map((g) => (
          <Link
            key={g.slug}
            href={`/guides/${g.slug}`}
            className="card group flex flex-col p-6 transition-transform hover:-translate-y-1"
          >
            <span className="text-3xl">{g.emoji}</span>
            <h2 className="mt-3 font-semibold group-hover:text-[var(--mint)]">
              {g.title}
            </h2>
            <p className="mt-2 flex-1 text-sm text-[var(--fg-muted)]">{g.dek}</p>
            <span className="mt-4 text-xs text-[var(--fg-dim)]">
              {g.readMins} min read →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
