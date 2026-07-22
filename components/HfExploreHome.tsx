"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { DemoVideo } from "@/lib/demoVideos";
import type { CommunityProject, FeedItem } from "@/lib/videoFeed";
import { CATEGORIES } from "@/lib/presets";

function useAutoPlay(eager = false) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const kick = () => {
      v.muted = true;
      v.playsInline = true;
      void v.play().catch(() => undefined);
    };
    if (eager) kick();
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) kick();
        else v.pause();
      },
      { rootMargin: "200px 0px", threshold: 0.05 }
    );
    io.observe(v);
    const onGesture = () => kick();
    window.addEventListener("touchstart", onGesture, { once: true, passive: true });
    window.addEventListener("click", onGesture, { once: true });
    return () => {
      io.disconnect();
      window.removeEventListener("touchstart", onGesture);
      window.removeEventListener("click", onGesture);
    };
  }, [eager]);
  return ref;
}

function Clip({
  demo,
  className,
  eager,
}: {
  demo: DemoVideo;
  className?: string;
  eager?: boolean;
}) {
  const ref = useAutoPlay(eager);
  return (
    <video
      ref={ref}
      className={className}
      poster={demo.poster}
      muted
      loop
      playsInline
      autoPlay
      preload={eager ? "auto" : "metadata"}
    >
      <source src={demo.webm} type="video/webm" />
      <source src={demo.mp4} type="video/mp4" />
    </video>
  );
}

/* ---- 1. Top feature row — big landscape media cards, TITLE BELOW (HF pattern) ---- */
function FeatureRow({ demos }: { demos: DemoVideo[] }) {
  const cards = [
    {
      title: "Seedance free trial",
      blurb: "One figure photo → a shareable clip",
      href: "/create",
      badge: "Live",
    },
    {
      title: "Blind-box unboxing",
      blurb: "The reveal loop, built for Reels",
      href: "/create?effect=blind-box-unboxing",
    },
    {
      title: "360° listing spin",
      blurb: "Marketplace packshot from one photo",
      href: "/create?effect=360-spin-showcase",
    },
  ];
  return (
    <section className="grid grid-cols-1 gap-3 px-3 pt-3 sm:px-5 md:grid-cols-3 md:gap-4">
      {cards.map((c, i) => (
        <Link key={c.title} href={c.href} className="group block">
          <div className="relative aspect-[16/10] overflow-hidden rounded-[18px] bg-neutral-900 ring-1 ring-white/10 transition-all duration-300 group-hover:-translate-y-1 group-hover:ring-2 group-hover:ring-[#c8ff3d]/45 group-hover:shadow-[0_28px_70px_-30px_rgba(0,0,0,0.9)]">
            <Clip
              demo={demos[i % demos.length]}
              eager
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            {c.badge && (
              <span className="absolute left-3 top-3 rounded-full bg-[#c8ff3d] px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-black">
                {c.badge}
              </span>
            )}
          </div>
          <h3 className="font-display mt-3 text-[17px] font-bold uppercase leading-tight tracking-tight text-white transition-colors group-hover:text-[#c8ff3d] sm:text-[19px]">
            {c.title}
          </h3>
          <p className="mt-1 text-[13px] text-white/50">{c.blurb}</p>
        </Link>
      ))}
    </section>
  );
}

/* ---- 2. Big lime promo banner (HF signature) ---- */
function LimePromo() {
  return (
    <section className="px-3 py-4 sm:px-5">
      <div className="relative overflow-hidden rounded-[20px] bg-gradient-to-r from-[#a6e22e] via-[#c8ff3d] to-[#9be870] px-6 py-8 sm:px-10 sm:py-10">
        <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-display text-3xl font-black uppercase leading-[0.98] tracking-tight text-black sm:text-5xl">
              1 free trial
              <span className="block">animate a toy you own</span>
            </h2>
            <p className="mt-2 max-w-xl text-sm font-medium text-black/70">
              One figure photo → a Seedance clip. No card. Priced for real model
              cost, never fake &quot;unlimited&quot;.
            </p>
          </div>
          <Link
            href="/create"
            className="shrink-0 rounded-full bg-black px-7 py-3.5 text-sm font-black text-[#c8ff3d] transition-transform hover:-translate-y-0.5"
          >
            Start free →
          </Link>
        </div>
      </div>
    </section>
  );
}

/* Thin monochrome line icons (Higgsfield style) — stroke inherits currentColor */
function LineIcon({ name }: { name: string }) {
  const common = {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (name) {
    case "film":
      return (
        <svg {...common}>
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <path d="M7 4v16M17 4v16M3 9h4M3 15h4M17 9h4M17 15h4" />
        </svg>
      );
    case "spark":
      return (
        <svg {...common}>
          <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3Z" />
        </svg>
      );
    case "box":
      return (
        <svg {...common}>
          <path d="M21 8l-9-5-9 5 9 5 9-5Z" />
          <path d="M3 8v8l9 5 9-5V8M12 13v8" />
        </svg>
      );
    case "spin":
      return (
        <svg {...common}>
          <path d="M21 12a9 9 0 1 1-2.64-6.36" />
          <path d="M21 3v5h-5" />
        </svg>
      );
    case "wand":
      return (
        <svg {...common}>
          <path d="M15 4V2M15 10V8M11 6H9M21 6h-2M17.8 8.8l-1.4-1.4M12.6 3.6L11.2 2.2" />
          <path d="M3 21l11-11" />
        </svg>
      );
    case "clap":
      return (
        <svg {...common}>
          <path d="M3 9h18v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9Z" />
          <path d="M3 9l1.5-4 4 1L10 2l4 1 1.5-4 4 1L21 5" />
        </svg>
      );
    default:
      return null;
  }
}

/* ---- 3. Two-col: pitch card + model/feature grid (HF icon+badge+title cards) ---- */
function ModelGrid() {
  const features = [
    { icon: "film", title: "Seedance Mini", sub: "Free toy clips in seconds", badge: "Free", href: "/create" },
    { icon: "spark", title: "Seedance 2.0", sub: "Best quality for painted figures", badge: "Paid", href: "/pricing" },
    { icon: "box", title: "Blind-box unboxing", sub: "The reveal collectors share", badge: "Viral", href: "/create?effect=blind-box-unboxing" },
    { icon: "spin", title: "360° listing spin", sub: "Marketplace-ready packshot", badge: "Seller", href: "/create?effect=360-spin-showcase" },
    { icon: "wand", title: "Make it dance", sub: "Come-alive loop for Reels", badge: "Viral", href: "/create?effect=make-figure-dance" },
    { icon: "clap", title: "Cinema scene", sub: "Drop a figure into a world", badge: "Scene", href: "/cinema" },
  ];
  return (
    <section className="grid grid-cols-1 gap-3 px-3 py-4 sm:px-5 lg:grid-cols-[minmax(0,340px)_1fr] lg:gap-4">
      {/* pitch card */}
      <div className="flex flex-col justify-between rounded-[20px] border border-white/10 bg-gradient-to-br from-[#12242a] to-[#0e1417] p-6">
        <div>
          <h3 className="font-display text-2xl font-black uppercase leading-tight tracking-tight text-white">
            All Seedance models
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            <li>✓ Free trial — no card</li>
            <li>✓ Failed gens refund credits</li>
            <li>✓ Paid = commercial use</li>
            <li>✓ Priced for model cost, not fake volume</li>
          </ul>
        </div>
        <Link
          href="/pricing"
          className="mt-6 inline-flex w-fit rounded-full bg-[#c8ff3d] px-5 py-2.5 text-sm font-black text-black"
        >
          See pricing
        </Link>
      </div>

      {/* feature card grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {features.map((f) => (
          <Link
            key={f.title}
            href={f.href}
            className="card-i group flex flex-col justify-between rounded-[18px] border border-white/10 bg-white/[0.03] p-5"
          >
            <div className="flex items-start justify-between">
              <span className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-white/85 transition-colors group-hover:text-[#c8ff3d]">
                <LineIcon name={f.icon} />
              </span>
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wide text-[#c8ff3d]">
                {f.badge}
              </span>
            </div>
            <div className="mt-8">
              <h4 className="font-display text-[17px] font-bold text-white">{f.title}</h4>
              <p className="mt-1 text-[12.5px] text-white/45">{f.sub}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

/* ---- 4. Dense autoplaying viral video wall ---- */
function ViralGrid({ items }: { items: FeedItem[] }) {
  const [filter, setFilter] = useState("all");
  const chips = useMemo(
    () => [
      { id: "all", label: "ALL" },
      ...CATEGORIES.map((c) => ({ id: c.id, label: c.label.toUpperCase() })),
    ],
    []
  );
  const wall = useMemo(
    () => (filter === "all" ? items : items.filter((i) => i.category === filter)),
    [filter, items]
  );

  return (
    <section className="px-2 py-6 sm:px-3">
      <div className="mb-3 flex items-end justify-between px-2">
        <h2 className="font-display text-[22px] font-bold uppercase tracking-tight text-white sm:text-[26px]">
          Viral toy presets
        </h2>
        <Link href="/effects" className="text-[12px] font-semibold text-[#c8ff3d]">
          View all →
        </Link>
      </div>
      <div className="mb-3 flex gap-2 overflow-x-auto px-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {chips.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setFilter(c.id)}
            className={`shrink-0 rounded-full border px-3 py-1.5 text-[10px] font-bold tracking-wide ${
              filter === c.id
                ? "border-[#c8ff3d] bg-[#c8ff3d] text-black"
                : "border-white/10 text-white/50"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {wall.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="relative aspect-[3/4] overflow-hidden rounded-xl bg-neutral-900 sm:aspect-[9/14]"
          >
            <Clip
              demo={item.demo}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
            <p className="absolute inset-x-0 bottom-0 p-2 text-[11px] font-bold uppercase leading-tight tracking-wide text-white sm:text-xs">
              {item.title}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function HfExploreHome({
  demos,
  projects,
  feed,
}: {
  demos: DemoVideo[];
  projects: CommunityProject[];
  feed: FeedItem[];
}) {
  void projects;
  return (
    <div className="min-h-screen bg-black pb-24 text-white">
      <FeatureRow demos={demos} />
      <LimePromo />
      <ModelGrid />
      <ViralGrid items={feed} />
    </div>
  );
}
