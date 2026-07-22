"use client";

import Link from "next/link";
import { DEMO_VIDEOS } from "@/lib/demoVideos";
import { AutoPlayVideo } from "@/components/AutoPlayVideo";

type Promo = {
  id: string;
  title: string;
  blurb: string;
  href: string;
  cta: string;
  badge?: string;
  demoIndex: number;
};

const PROMOS: Promo[] = [
  {
    id: "seedance",
    title: "Seedance free trial",
    blurb: "One figure photo → clip",
    href: "/create",
    cta: "Try free",
    badge: "Live",
    demoIndex: 0,
  },
  {
    id: "unbox",
    title: "Blind-box unboxing",
    blurb: "Reveal for Reels & Shop",
    href: "/create?effect=blind-box-unboxing",
    cta: "Remake",
    demoIndex: 1,
  },
  {
    id: "spin",
    title: "360° listing spin",
    blurb: "Marketplace packshot",
    href: "/create?effect=360-spin-showcase",
    cta: "Remake",
    demoIndex: 4,
  },
  {
    id: "viral",
    title: "Drop-day viral hook",
    blurb: "Stop-the-scroll first second",
    href: "/create?effect=paparazzi-flash",
    cta: "Remake",
    demoIndex: 3,
  },
  {
    id: "batch",
    title: "Seller batch pack",
    blurb: "Spin · unbox · listing",
    href: "/supercomputer",
    cta: "Open Batch",
    badge: "Shop",
    demoIndex: 5,
  },
  {
    id: "story",
    title: "Miniature story world",
    blurb: "Shelf figure → scene",
    href: "/create?effect=miniature-scene",
    cta: "Remake",
    demoIndex: 2,
  },
  {
    id: "unboxed",
    title: "Collector unbox cut",
    blurb: "Launch-day format",
    href: "/create?effect=mystery-box-reveal",
    cta: "Remake",
    demoIndex: 5,
  },
  {
    id: "float",
    title: "Zero-G product hero",
    blurb: "Premium float loop",
    href: "/create?effect=floating-hero",
    cta: "Remake",
    demoIndex: 0,
  },
];

/** HF top: large full-bleed video cards, almost no chrome */
export function HomeFeatureCarousel() {
  return (
    <section className="pt-2">
      <div className="flex gap-3 overflow-x-auto px-3 pb-1 snap-x snap-mandatory sm:gap-4 sm:px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {PROMOS.map((promo, i) => {
          const demo = DEMO_VIDEOS[promo.demoIndex % DEMO_VIDEOS.length];
          return (
            <Link
              key={promo.id}
              href={promo.href}
              className="group relative h-[min(62vh,520px)] w-[min(78vw,340px)] shrink-0 snap-start overflow-hidden rounded-3xl bg-zinc-900 sm:h-[min(68vh,560px)] sm:w-[300px] md:w-[320px]"
            >
              <AutoPlayVideo
                poster={demo.poster}
                webm={demo.webm}
                mp4={demo.mp4}
                eager={i < 3}
                className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
              {promo.badge && (
                <span className="absolute left-3 top-3 rounded-full bg-[var(--mint)] px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-black">
                  {promo.badge}
                </span>
              )}
              <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                <h3 className="text-lg font-bold leading-tight text-white sm:text-xl">
                  {promo.title}
                </h3>
                <p className="mt-1 text-sm text-white/65">{promo.blurb}</p>
                <span className="mt-4 inline-flex rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-bold text-white backdrop-blur-md transition group-hover:bg-[var(--mint)] group-hover:text-black">
                  {promo.cta}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
