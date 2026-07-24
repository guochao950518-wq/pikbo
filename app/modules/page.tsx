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
      {/* Yiha /lego density: sticky header + media-first job grid */}
      <div className="sticky top-0 z-20 border-b border-white/10 bg-black/90 px-3 py-3 backdrop-blur-xl sm:px-5">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#c8ff3d]">
              Modules · video jobs
            </p>
            <h1 className="font-display text-lg font-black uppercase tracking-tight sm:text-xl">
              Pick a job · get a video
            </h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/create?try=1&sample=scout"
              className="rounded-full bg-[#c8ff3d] px-4 py-2 text-xs font-black text-black"
            >
              Generate free
            </Link>
            <Link
              href="/create"
              className="rounded-full border border-white/20 px-4 py-2 text-xs font-bold text-white/80"
            >
              Video
            </Link>
            <Link
              href="/flow"
              className="rounded-full border border-white/15 px-4 py-2 text-xs font-bold text-white/55"
            >
              Flow
            </Link>
            <Link
              href="/create?mode=seller-pack"
              className="rounded-full border border-white/15 px-4 py-2 text-xs font-bold text-white/55"
            >
              Seller Pack
            </Link>
            <Link
              href="/effects"
              className="rounded-full border border-white/15 px-4 py-2 text-xs font-bold text-white/55"
            >
              Viral presets
            </Link>
          </div>
        </div>
      </div>

      <div className="relative px-3 py-6 sm:px-5">
        <div className="relative mx-auto max-w-[1400px]">
          <p className="mb-4 max-w-2xl text-sm leading-relaxed text-white/50">
            Yiha-style mini-app shelf: each block is a fixed{" "}
            <b className="text-white/75">video</b> job — photo in, recipe +
            aspect ready, Seedance out. Lab posters are style only.
          </p>

          <section>
            <div className="mb-3 flex items-end justify-between gap-3">
              <h2 className="text-[10px] font-black uppercase tracking-[0.16em] text-[#c8ff3d]">
                Live jobs · {live.length}
              </h2>
              <p className="text-[11px] text-white/40">
                One photo · Seedance video · not a stills shop
              </p>
            </div>
            <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
            <section className="mt-10">
              <div className="mb-3 flex items-end justify-between gap-3">
                <h2 className="text-[10px] font-black uppercase tracking-[0.16em] text-amber-100/80">
                  Preview · {preview.length}
                </h2>
                <p className="text-[11px] text-white/35">
                  Reachable · not primary video jobs
                </p>
              </div>
              <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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

          <section className="mt-12 rounded-2xl border border-white/10 bg-black/40 p-5 sm:p-7">
            <h2 className="text-sm font-bold text-white">
              How modules make video
            </h2>
            <ol className="mt-4 grid gap-3 sm:grid-cols-3">
              {[
                {
                  n: "1",
                  t: "Pick a video job",
                  d: "Hook, unbox, listing spin, pack — job first, not model name.",
                },
                {
                  n: "2",
                  t: "Drop your toy photo",
                  d: "A figure you own. Photo is input; the product is the clip.",
                },
                {
                  n: "3",
                  t: "Generate & deliver",
                  d: "Seedance video out. Free Mini raw download gated until T6 bake.",
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
