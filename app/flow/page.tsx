import type { Metadata } from "next";
import Link from "next/link";
import { DEMO_VIDEOS } from "@/lib/demoVideos";

export const metadata: Metadata = {
  title: "Create flow · Preview",
  description:
    "Pick how you want to create: image-to-video, listing packs, image stills, batch, or browse recipes — Pikbo creation hub.",
  alternates: { canonical: "/flow" },
  robots: { index: false, follow: false },
};

/**
 * HF Flow–class creation hub: every card is a job entry, not a blog link.
 * Original Pikbo copy + Lab media only.
 */
const FLOWS: {
  title: string;
  blurb: string;
  href: string;
  badge: string;
  demoIndex: number;
}[] = [
  {
    title: "Image → Video",
    blurb: "One toy photo → short clip. Main free path.",
    href: "/create?try=1&sample=scout",
    badge: "Core",
    demoIndex: 2,
  },
  {
    title: "Toy Modules",
    blurb: "Job blocks — listing, hook, unbox, shelf. Suite mini-apps.",
    href: "/modules",
    badge: "Modules",
    demoIndex: 1,
  },
  {
    title: "Viral recipes",
    blurb: "Spin, unbox, dance, shelf — pick a recipe and remake.",
    href: "/effects",
    badge: "Presets",
    demoIndex: 0,
  },
  {
    title: "Seller Pack",
    blurb: "Listing spin + reveal + social hook from one photo.",
    href: "/create?mode=seller-pack",
    badge: "Shop",
    demoIndex: 1,
  },
  {
    title: "Still image",
    blurb: "Flux stills for packshots and mood boards · Preview.",
    href: "/image",
    badge: "Preview",
    demoIndex: 3,
  },
  {
    title: "Batch agent",
    blurb: "Custom multi-recipe queue · Preview. Prefer Seller Pack for shops.",
    href: "/supercomputer",
    badge: "Preview",
    demoIndex: 0,
  },
  {
    title: "Official examples",
    blurb: "Watch Lab demos, then remix with your toy.",
    href: "/community",
    badge: "Lab",
    demoIndex: 1,
  },
  {
    title: "Cinema brief",
    blurb: "Scene-style recipes → opens Generate (preview workspace).",
    href: "/cinema",
    badge: "Preview",
    demoIndex: 2,
  },
  {
    title: "Models shelf",
    blurb: "What's wired (Seedance / Flux) vs roadmap — no fake live keys.",
    href: "/models",
    badge: "Engines",
    demoIndex: 3,
  },
  {
    title: "SEO tools",
    blurb: "Search-intent pages that open Create with a job.",
    href: "/tools",
    badge: "Growth",
    demoIndex: 0,
  },
];

export default function FlowPage() {
  return (
    <div className="min-h-screen bg-black pb-24 text-white">
      <div className="border-b border-white/10 px-4 py-8 sm:px-8">
        <p className="text-[10px] font-bold uppercase tracking-wider text-[#c8ff3d]">
          Creation hub · Flow
        </p>
        <h1 className="mt-2 font-display text-3xl font-black uppercase tracking-tight sm:text-4xl">
          How do you want to create?
        </h1>
        <p className="mt-2 max-w-xl text-sm text-white/55">
          Same idea as suite apps: pick a job, land in a workspace. All media
          below is Pikbo Lab — not third-party brand assets.
        </p>
        <Link
          href="/create?try=1"
          className="mt-5 inline-flex rounded-full bg-[#c8ff3d] px-6 py-3 text-sm font-black text-black"
        >
          Skip · try free now
        </Link>
      </div>

      <div className="grid gap-3 p-3 sm:grid-cols-2 sm:p-5 lg:grid-cols-3">
        {FLOWS.map((f) => {
          const demo = DEMO_VIDEOS[f.demoIndex % DEMO_VIDEOS.length];
          return (
            <Link
              key={f.href + f.title}
              href={f.href}
              className="group relative overflow-hidden rounded-2xl bg-neutral-900 ring-1 ring-white/10 transition hover:-translate-y-1 hover:ring-[#c8ff3d]/45"
            >
              <div className="relative aspect-video">
                <video
                  className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                  poster={demo.poster}
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  autoPlay
                >
                  <source src={demo.webm} type="video/webm" />
                  <source src={demo.mp4} type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                <span className="absolute left-2.5 top-2.5 rounded-full bg-black/60 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[#c8ff3d]">
                  {f.badge}
                </span>
              </div>
              <div className="p-4">
                <h2 className="text-lg font-bold group-hover:text-[#c8ff3d]">
                  {f.title}
                </h2>
                <p className="mt-1 text-sm text-white/50">{f.blurb}</p>
                <p className="mt-3 text-[11px] font-bold uppercase tracking-wide text-[#c8ff3d]">
                  Open →
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
