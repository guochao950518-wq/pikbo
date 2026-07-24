import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { GenerateSuiteChrome } from "@/components/GenerateSuiteChrome";
import { ModulesMobileCta } from "@/components/ModulesMobileCta";
import { DEMO_VIDEOS } from "@/lib/demoVideos";
import {
  listLiveWorkflows,
  listPreviewWorkflows,
  type Workflow,
} from "@/lib/workflows";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Modules · Toy workflow blocks",
  description:
    "Modular toy video workflows — listing spin, TikTok hook, blind-box drop, shelf glam, Seller Pack. Pick a block, upload one photo, generate. Designer-toy suite modules.",
  alternates: { canonical: "/modules" },
};

function posterForEffect(effect?: string): string | null {
  if (!effect) return null;
  return DEMO_VIDEOS.find((d) => d.preset === effect)?.poster ?? null;
}

function ModuleCard({
  w,
  poster,
  capability,
}: {
  w: Workflow;
  poster: string | null;
  capability: "live" | "preview";
}) {
  const isLive = capability === "live";
  return (
    <Link
      href={w.href}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.07] via-[#0c0c10] to-black shadow-[0_16px_40px_-28px_rgba(0,0,0,0.9)] transition duration-300 hover:-translate-y-1 hover:border-[var(--mint)]/45 hover:shadow-[0_24px_56px_-24px_rgba(200,255,61,0.15)]"
    >
      {poster ? (
        <div className="relative aspect-[16/10] overflow-hidden bg-black/50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={poster}
            alt=""
            className="h-full w-full object-cover opacity-90 transition duration-500 group-hover:scale-[1.05]"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent" />
          <span className="absolute left-3 top-3 text-2xl drop-shadow-lg">
            {w.emoji}
          </span>
          <div className="absolute right-3 top-3 flex flex-wrap justify-end gap-1">
            <span
              className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold ${
                isLive
                  ? "bg-[var(--mint)] text-black shadow-[0_0_16px_rgba(200,255,61,0.35)]"
                  : "bg-amber-400/90 text-black"
              }`}
            >
              {isLive ? "JOB" : "PREVIEW"}
            </span>
            {poster && isLive ? (
              <span className="rounded-full bg-black/65 px-1.5 py-0.5 text-[9px] font-bold text-white/80 backdrop-blur">
                Lab proof
              </span>
            ) : null}
            {w.badge && (
              <span className="rounded-full bg-black/65 px-1.5 py-0.5 text-[9px] font-bold text-white/80 backdrop-blur">
                {w.badge}
              </span>
            )}
          </div>
        </div>
      ) : (
        <div className="flex items-start justify-between gap-3 p-5 pb-0">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[var(--grad-soft)] text-2xl ring-1 ring-white/10">
            {w.emoji}
          </span>
          <div className="flex flex-wrap justify-end gap-1">
            <span
              className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold ${
                isLive
                  ? "bg-[var(--mint)]/15 text-[var(--mint)]"
                  : "bg-amber-400/15 text-amber-100"
              }`}
            >
              {isLive ? "JOB" : "PREVIEW"}
            </span>
            {w.badge && (
              <span className="rounded-full bg-white/10 px-1.5 py-0.5 text-[9px] font-bold text-white/50">
                {w.badge}
              </span>
            )}
          </div>
        </div>
      )}
      <div className="p-5 pt-4">
        <h3 className="text-lg font-bold tracking-tight transition group-hover:text-[var(--mint)]">
          {w.label}
        </h3>
        <p className="mt-1.5 text-xs leading-relaxed text-white/50">
          {w.blurb}
        </p>
        {w.effect && (
          <p className="mt-3 text-[10px] text-white/30">
            Recipe · {w.effect}
            {w.aspectRatio ? ` · ${w.aspectRatio}` : ""}
            {poster ? " · Lab still ≠ your upload" : ""}
          </p>
        )}
        <p className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold text-[var(--mint)]">
          {isLive ? "Launch module" : "Open preview"}
          <span className="transition group-hover:translate-x-0.5" aria-hidden>
            →
          </span>
        </p>
      </div>
    </Link>
  );
}

/**
 * Yiha /lego pattern for the toy vertical:
 * dense modular workflow wall with Lab proof posters → deep link Generate.
 * Preview shelves (Image / Batch) are tagged honestly — not LIVE Seedance jobs.
 */
export default function ModulesPage() {
  const live = listLiveWorkflows();
  const preview = listPreviewWorkflows();

  // Live job blocks only — Preview shelves stay off structured data.
  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Pikbo toy workflow modules",
    description:
      "Modular toy video jobs that open Generate with a registered recipe — listing, social, unbox, Seller Pack.",
    numberOfItems: live.length,
    itemListElement: live.map((w, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: w.label,
      url: w.href.startsWith("http")
        ? w.href
        : `${site.url}${w.href.startsWith("/") ? w.href : `/${w.href}`}`,
      description: w.blurb,
    })),
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] pb-28 lg:pb-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }}
      />
      <Suspense
        fallback={
          <div className="border-b border-white/10 px-4 py-3 text-sm text-white/40">
            Generate · Toy studio
          </div>
        }
      >
        <GenerateSuiteChrome />
      </Suspense>
      <div className="px-4 py-10 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <span className="chip">Modular · toy jobs</span>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Toy Modules
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--fg-muted)]">
            The modular side of {site.name}: each block is a fixed seller or
            collector job that opens Generate with recipe and aspect ready —
            same Seedance engine. Structure of suite mini-apps; all media is
            Pikbo Lab.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link
              href="/create?try=1&sample=scout"
              className="btn btn-primary text-sm"
            >
              Try free · Lab sample
            </Link>
            <Link href="/create" className="btn btn-ghost text-sm">
              Open Generate
            </Link>
            <Link
              href="/create?mode=seller-pack"
              className="btn btn-ghost text-sm"
            >
              Seller Pack · 3 clips
            </Link>
            <Link href="/effects" className="btn btn-ghost text-sm">
              Full recipe wall
            </Link>
          </div>

          <section className="mt-12">
            <div className="mb-4 flex items-end justify-between gap-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--mint)]">
                Job blocks · {live.length}
              </h2>
              <p className="text-[11px] text-[var(--fg-dim)]">
                One photo in · Seedance path · Lab poster ≠ your upload
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {live.map((w) => (
                <ModuleCard
                  key={w.id}
                  w={w}
                  poster={posterForEffect(w.effect)}
                  capability="live"
                />
              ))}
            </div>
          </section>

          {preview.length > 0 ? (
            <section className="mt-12">
              <div className="mb-4 flex items-end justify-between gap-3">
                <h2 className="text-xs font-bold uppercase tracking-wider text-amber-100/80">
                  Preview shelves · {preview.length}
                </h2>
                <p className="text-[11px] text-[var(--fg-dim)]">
                  Reachable · not soft-launch primary jobs
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {preview.map((w) => (
                  <ModuleCard
                    key={w.id}
                    w={w}
                    poster={posterForEffect(w.effect)}
                    capability="preview"
                  />
                ))}
              </div>
            </section>
          ) : null}

          <section className="mt-14 rounded-2xl border border-white/10 bg-black/30 p-6 sm:p-8">
            <h2 className="text-sm font-bold text-white">How modules work</h2>
            <ol className="mt-4 grid gap-4 sm:grid-cols-3">
              {[
                {
                  n: "1",
                  t: "Pick a block",
                  d: "Listing, hook, unbox, shelf, or full pack — job first, not model name.",
                },
                {
                  n: "2",
                  t: "Drop your toy photo",
                  d: "A figure you own. Optional SKU name locks identity across clips.",
                },
                {
                  n: "3",
                  t: "Generate & deliver",
                  d: "Review on-player; Free Mini live raw download stays blocked until T6 file bake. Paid/clean file or Library on this device.",
                },
              ].map((s) => (
                <li
                  key={s.n}
                  className="rounded-xl border border-white/8 bg-white/[0.03] p-4"
                >
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[var(--mint)] text-[11px] font-black text-black">
                    {s.n}
                  </span>
                  <p className="mt-2 text-sm font-bold text-white">{s.t}</p>
                  <p className="mt-1 text-xs text-[var(--fg-muted)]">{s.d}</p>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </div>
      <ModulesMobileCta />
    </div>
  );
}
