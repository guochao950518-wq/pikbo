import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { DEMO_VIDEOS } from "@/lib/demoVideos";
import { listLiveWorkflows, listPreviewWorkflows } from "@/lib/workflows";
import { GenerateSuiteChrome } from "@/components/GenerateSuiteChrome";
import { FlowMediaCard } from "@/components/FlowMediaCard";
import { site } from "@/lib/site";
import { PREVIEW_ROBOTS } from "@/lib/seoIndex";

export const metadata: Metadata = {
  title: "Flow · Creation matrix",
  description:
    "Higgsfield Flow–style creation hub for designer toys: pick a job, open Generate or Modules with media-first cards. Lab demos only.",
  alternates: { canonical: "/flow" },
  // Phase H: suite matrix is useful but not primary SEO — robots already disallows /flow
  robots: PREVIEW_ROBOTS,
};

type FlowCard = {
  id: string;
  title: string;
  blurb: string;
  href: string;
  badge: string;
  tier: "core" | "job" | "preview";
  /** DEMO_VIDEOS id or index fallback */
  demoId?: string;
  demoIndex?: number;
};

function resolveDemo(card: FlowCard) {
  if (card.demoId) {
    const byId = DEMO_VIDEOS.find((d) => d.id === card.demoId);
    if (byId) return byId;
  }
  const i = card.demoIndex ?? 0;
  return DEMO_VIDEOS[i % DEMO_VIDEOS.length];
}

/**
 * HF Flow pattern: dense media matrix of creation surfaces.
 * Toy-vertical only — every live card deep-links a real Pikbo path.
 */
export default function FlowPage() {
  const jobCards: FlowCard[] = listLiveWorkflows()
    .filter((w) => w.id !== "toy-presets" && w.id !== "photo-to-clip")
    .map((w, i) => ({
      id: `job-${w.id}`,
      title: w.label,
      blurb: w.blurb,
      href: w.href,
      badge: w.badge || "Job",
      tier: "job" as const,
      demoIndex: i + 1,
    }));

  const core: FlowCard[] = [
    {
      id: "core-i2v",
      title: "Photo → Clip",
      blurb: "Main Generate workbench — one owned toy photo to short video.",
      href: "/create?try=1&sample=scout",
      badge: "Core",
      tier: "core",
      demoId: "scout-spin",
    },
    {
      id: "core-modules",
      title: "Toy Modules",
      blurb: "Yiha/lego-style job blocks — listing, hook, unbox, shelf.",
      href: "/modules",
      badge: "Modules",
      tier: "core",
      demoId: "moon-reveal",
    },
    {
      id: "core-presets",
      title: "Viral recipes",
      blurb: "Full recipe wall with Lab proof clips — remake in Generate.",
      href: "/effects",
      badge: "Presets",
      tier: "core",
      demoId: "orbit-cgi",
    },
    {
      id: "core-pack",
      title: "Seller Pack",
      blurb: "HF Product-studio subset: listing + reveal + social from one photo.",
      href: "/create?mode=seller-pack",
      badge: "Shop",
      tier: "core",
      demoId: "beatbot-unboxed",
    },
    {
      id: "core-lab",
      title: "PIKBO Lab",
      blurb: "Official examples — open project, then replace the toy.",
      href: "/community",
      badge: "Lab",
      tier: "core",
      demoId: "orbit-dance",
    },
    {
      id: "core-explore",
      title: "Inside projects",
      blurb: "Input · output · recipe · provenance — then Use recipe.",
      href: "/explore",
      badge: "Explore",
      tier: "core",
      demoId: "moon-glow",
    },
  ];

  const preview: FlowCard[] = [
    ...listPreviewWorkflows().map((w, i) => ({
      id: `prev-${w.id}`,
      title: w.label,
      blurb: w.blurb,
      href: w.href,
      badge: "Preview",
      tier: "preview" as const,
      demoIndex: i,
    })),
    {
      id: "prev-cinema",
      title: "Cinema brief",
      blurb: "Lens language → opens Generate. Not a full HF Cinema rebuild.",
      href: "/cinema",
      badge: "Preview",
      tier: "preview",
      demoId: "scout-story",
    },
    {
      id: "prev-models",
      title: "Models shelf",
      blurb: "Seedance live · Flux stills · others Soon — no fake keys.",
      href: "/models",
      badge: "Engines",
      tier: "preview",
      demoId: "beatbot-hook",
    },
  ];

  const sections: { id: string; label: string; items: FlowCard[] }[] = [
    { id: "core", label: "Core · open these first", items: core },
    { id: "jobs", label: "Job modules · seller & collector", items: jobCards },
    { id: "preview", label: "Preview · honest capability tags", items: preview },
  ];

  return (
    <div className="min-h-screen bg-black pb-28 text-white">
      <Suspense
        fallback={
          <div className="border-b border-white/10 px-4 py-3 text-sm text-white/40">
            Flow · Creation matrix
          </div>
        }
      >
        <GenerateSuiteChrome />
      </Suspense>

      <div className="relative border-b border-white/10 px-4 py-8 sm:px-8">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_60%_at_10%_0%,rgba(200,255,61,0.08),transparent_55%)]"
          aria-hidden
        />
        <div className="relative mx-auto max-w-6xl">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#c8ff3d]">
            Flow · creation matrix
          </p>
          <h1 className="mt-2 font-display text-3xl font-black uppercase tracking-tight sm:text-5xl">
            How do you want to create?
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/55">
            Media-first workspace matrix for designer toys — same structure as
            suite Flow hubs, rebuilt vertical. Every card opens a real{" "}
            {site.name} path. No fake multi-model zoo.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link
              href="/create?try=1&sample=scout"
              className="btn btn-primary inline-flex rounded-full px-6 py-3 text-sm font-black"
            >
              Try free · 10s
            </Link>
            <Link
              href="/modules"
              className="inline-flex rounded-full border border-white/20 bg-white/[0.03] px-5 py-3 text-sm font-bold text-white/80 transition hover:border-[#c8ff3d]/40 hover:text-white"
            >
              All modules
            </Link>
            <Link
              href="/create"
              className="inline-flex rounded-full border border-white/20 bg-white/[0.03] px-5 py-3 text-sm font-bold text-white/80 transition hover:border-[#c8ff3d]/40 hover:text-white"
            >
              Open Generate
            </Link>
            <Link
              href="/effects"
              className="inline-flex rounded-full border border-white/15 px-5 py-3 text-sm font-bold text-white/55 transition hover:border-white/30 hover:text-white/80"
            >
              Recipe wall
            </Link>
          </div>
          <nav
            aria-label="Flow sections"
            className="mt-6 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]"
          >
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#flow-${s.id}`}
                className="shrink-0 rounded-full border border-white/15 px-3 py-1 text-[11px] font-semibold text-white/60 hover:border-[#c8ff3d]/40 hover:text-[#c8ff3d]"
              >
                {s.label.split("·")[0].trim()}
              </a>
            ))}
          </nav>
        </div>
      </div>

      {sections.map((sec) => (
        <section
          key={sec.id}
          id={`flow-${sec.id}`}
          className="scroll-mt-24 border-b border-white/10 px-3 py-8 sm:px-5"
        >
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-4 text-xs font-bold uppercase tracking-wider text-white/45">
              {sec.label} · {sec.items.length}
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {sec.items.map((f) => {
                const demo = resolveDemo(f);
                return (
                  <FlowMediaCard
                    key={f.id}
                    href={f.href}
                    title={f.title}
                    blurb={f.blurb}
                    badge={f.badge}
                    isPreview={f.tier === "preview"}
                    poster={demo.poster}
                    webm={demo.webm}
                    mp4={demo.mp4}
                  />
                );
              })}
            </div>
          </div>
        </section>
      ))}

      <div className="mx-auto max-w-6xl px-4 py-10 text-center sm:px-8">
        <p className="text-sm text-white/45">
          Pattern parity with suite Flow hubs — all footage and copy are{" "}
          {site.name}-owned Lab samples.
        </p>
        <Link
          href="/create"
          className="mt-4 inline-flex rounded-full bg-[#c8ff3d] px-6 py-3 text-sm font-black text-black"
        >
          Start in Generate
        </Link>
      </div>
    </div>
  );
}
