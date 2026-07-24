import type { Metadata } from "next";
import Link from "next/link";
import { TOOLS } from "@/lib/tools";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Toy Video Tools",
  description:
    "Search-intent toy video tools: image-to-video, listing clips, unboxing hooks, and seller demos. Each page deep-links to a real Create recipe with honest Free Mini limits.",
  alternates: { canonical: "/tools" },
  openGraph: {
    title: `Toy Video Tools | ${site.name}`,
    description:
      "One search job per page — upload a toy photo, pick a recipe, generate a short clip.",
    url: `${site.url}/tools`,
  },
};

/**
 * Hub for the /tools/[slug] SEO cluster (GPT SEO_INTENT_50).
 * No fake capability list — every card opens a real registered tool page.
 */
export default function ToolsIndexPage() {
  // Phase H: ItemList of real tool URLs only (no thin fake catalog).
  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Pikbo toy video tools",
    description:
      "Search-intent toy video tools that deep-link to a registered Create recipe.",
    numberOfItems: TOOLS.length,
    itemListElement: TOOLS.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.label,
      url: `${site.url}/tools/${t.slug}`,
      description: t.h1,
    })),
  };

  return (
    <div className="px-4 py-10 sm:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }}
      />
      <div className="mx-auto max-w-5xl">
        <p className="section-label">Tools</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          Toy video tools from one photo
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--fg-muted)]">
          Each tool page completes one search job: searchable intent, a working
          Create deep-link, Free Mini limits (5s · 480p · on-player mark), and
          honest FAQ. No unlimited generation and no guaranteed sales.
        </p>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map((t) => (
            <Link
              key={t.slug}
              href={`/tools/${t.slug}`}
              className="card group flex flex-col gap-2 p-4 transition hover:border-[var(--mint)]/40"
            >
              <span className="text-lg" aria-hidden>
                {t.emoji}
              </span>
              <span className="text-sm font-bold text-[var(--fg)] group-hover:text-[var(--mint)]">
                {t.label}
              </span>
              <span className="text-xs leading-relaxed text-[var(--fg-muted)]">
                {t.h1}
              </span>
              <span className="mt-auto pt-2 text-[10px] font-bold uppercase tracking-wide text-[var(--fg-dim)]">
                → Open tool
              </span>
            </Link>
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-[var(--fg-dim)]">
          {TOOLS.length} tools · every page links to a registered Create recipe
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <Link href="/create" className="btn btn-primary text-sm">
            Open Generate
          </Link>
          <Link href="/modules" className="btn btn-ghost text-sm">
            Toy Modules
          </Link>
          <Link
            href="/create?mode=seller-pack"
            className="btn btn-ghost text-sm"
          >
            Seller Pack
          </Link>
          <Link href="/effects" className="btn btn-ghost text-sm">
            All presets
          </Link>
          <Link href="/community" className="btn btn-ghost text-sm">
            Lab examples
          </Link>
        </div>
      </div>
    </div>
  );
}
