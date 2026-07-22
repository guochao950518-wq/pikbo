"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { DEMO_VIDEOS } from "@/lib/demoVideos";

type Promo = {
  id: string;
  title: string;
  blurb: string;
  href: string;
  cta: string;
  badge?: string;
  demoIndex: number;
};

/** Top of HF home: large horizontal video promo cards */
const PROMOS: Promo[] = [
  {
    id: "seedance",
    title: "Seedance Mini · free trial",
    blurb: "One figure photo → listing-ready clip",
    href: "/create",
    cta: "Try free",
    badge: "Live",
    demoIndex: 0,
  },
  {
    id: "unbox",
    title: "Blind-box unboxing",
    blurb: "Reveal loop for TikTok & Reels",
    href: "/create?effect=blind-box-unboxing",
    cta: "Remake",
    demoIndex: 1,
  },
  {
    id: "spin",
    title: "360° listing spin",
    blurb: "Marketplace-ready packshot motion",
    href: "/create?effect=360-spin-showcase",
    cta: "Remake",
    demoIndex: 4,
  },
  {
    id: "viral",
    title: "Drop-day viral hook",
    blurb: "First-second motion that stops the scroll",
    href: "/create?effect=paparazzi-flash",
    cta: "Remake",
    demoIndex: 3,
  },
  {
    id: "batch",
    title: "Batch for sellers",
    blurb: "Spin · unbox · listing pack in one flow",
    href: "/supercomputer",
    cta: "Open Batch",
    badge: "Shop",
    demoIndex: 5,
  },
  {
    id: "story",
    title: "Miniature story world",
    blurb: "Shelf figure → tiny cinematic scene",
    href: "/create?effect=miniature-scene",
    cta: "Remake",
    demoIndex: 2,
  },
];

function PromoCard({ promo }: { promo: Promo }) {
  const demo = DEMO_VIDEOS[promo.demoIndex % DEMO_VIDEOS.length];
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) v.play().catch(() => undefined);
        else v.pause();
      },
      { threshold: 0.4 }
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <Link
      href={promo.href}
      className="group relative h-[280px] w-[min(78vw,300px)] shrink-0 snap-start overflow-hidden rounded-2xl border border-white/10 bg-black sm:h-[320px] sm:w-[280px]"
    >
      <video
        ref={ref}
        className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
        poster={demo.poster}
        muted
        loop
        playsInline
        preload="metadata"
      >
        <source src={demo.webm} type="video/webm" />
        <source src={demo.mp4} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-black/10" />
      {promo.badge && (
        <span className="absolute left-3 top-3 rounded-full bg-[var(--mint)] px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-black">
          {promo.badge}
        </span>
      )}
      <div className="absolute inset-x-0 bottom-0 p-4">
        <h3 className="text-base font-bold leading-snug text-white sm:text-lg">
          {promo.title}
        </h3>
        <p className="mt-1 line-clamp-2 text-xs text-white/70">{promo.blurb}</p>
        <span className="mt-3 inline-flex rounded-full bg-white/15 px-3 py-1.5 text-[11px] font-bold text-white backdrop-blur transition group-hover:bg-[var(--mint)] group-hover:text-black">
          {promo.cta} →
        </span>
      </div>
    </Link>
  );
}

export function HomeFeatureCarousel() {
  return (
    <section className="border-b border-[var(--border)] pt-3 pb-4">
      <div className="flex gap-3 overflow-x-auto px-3 pb-2 pt-1 snap-x snap-mandatory sm:px-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {PROMOS.map((p) => (
          <PromoCard key={p.id} promo={p} />
        ))}
      </div>
    </section>
  );
}
