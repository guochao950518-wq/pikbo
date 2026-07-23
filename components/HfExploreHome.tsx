"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { DemoVideo } from "@/lib/demoVideos";
import type { CommunityProject, FeedItem } from "@/lib/videoFeed";
import { CATEGORIES } from "@/lib/presets";
import { useI18n } from "@/components/LanguageProvider";

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
  const { t } = useI18n();
  const cards = [
    {
      titleKey: "home.hero1.title",
      blurbKey: "home.hero1.blurb",
      href: "/create",
      badgeKey: "badge.cachedDemo",
    },
    {
      titleKey: "home.hero2.title",
      blurbKey: "home.hero2.blurb",
      href: "/create?effect=blind-box-unboxing",
    },
    {
      titleKey: "home.hero3.title",
      blurbKey: "home.hero3.blurb",
      href: "/create?effect=360-spin-showcase",
    },
  ];
  return (
    <section className="grid grid-cols-2 gap-2 px-3 pt-3 sm:gap-3 sm:px-5 md:grid-cols-3 md:gap-4">
      {cards.map((c, i) => {
        const hero = i === 0;
        return (
          <Link
            key={c.titleKey}
            href={c.href}
            className={`group block ${hero ? "col-span-2 md:col-span-1" : ""}`}
          >
            <div
              className={`relative overflow-hidden rounded-[14px] bg-neutral-900 ring-1 ring-white/10 transition-all duration-300 group-hover:-translate-y-1 group-hover:ring-2 group-hover:ring-[#c8ff3d]/45 group-hover:shadow-[0_28px_70px_-30px_rgba(0,0,0,0.9)] sm:rounded-[18px] ${
                hero ? "aspect-[16/10]" : "aspect-[4/5] sm:aspect-[16/10]"
              }`}
            >
              <Clip
                demo={demos[i % demos.length]}
                eager
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              {c.badgeKey && (
                <span className="absolute left-2.5 top-2.5 rounded-full bg-[#c8ff3d] px-2 py-0.5 text-[9px] font-black uppercase tracking-wide text-black sm:left-3 sm:top-3 sm:px-2.5 sm:py-1 sm:text-[10px]">
                  {t(c.badgeKey)}
                </span>
              )}
              {/* mobile: title overlaid on the video so the first screen stays video-first */}
              <h3 className="font-display absolute inset-x-0 bottom-0 p-2.5 text-[12px] font-bold uppercase leading-tight tracking-tight text-white sm:hidden">
                {t(c.titleKey)}
              </h3>
            </div>
            <h3 className="font-display mt-3 hidden text-[17px] font-bold uppercase leading-tight tracking-tight text-white transition-colors group-hover:text-[#c8ff3d] sm:block sm:text-[19px]">
              {t(c.titleKey)}
            </h3>
            <p className="mt-1 hidden text-[13px] text-white/50 sm:block">
              {t(c.blurbKey)}
            </p>
          </Link>
        );
      })}
    </section>
  );
}

/* ---- 2. Compact media-rich promo CTA (refined, not a flat slab) ---- */
function LimePromo({ demo }: { demo: DemoVideo }) {
  const { t } = useI18n();
  return (
    <section className="px-3 py-3 sm:px-5 sm:py-4">
      <div className="relative overflow-hidden rounded-[22px] bg-[radial-gradient(120%_140%_at_0%_0%,#dcff72_0%,#c8ff3d_45%,#9fe23a_100%)] p-4 sm:p-5">
        <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:gap-6">
          {/* text side */}
          <div className="flex-1 sm:pl-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-black px-3 py-1 text-[11px] font-black uppercase tracking-wider text-[#c8ff3d]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#c8ff3d]" />
              {t("home.promo.chip")}
            </span>
            <h2 className="font-display mt-3 text-[28px] font-black uppercase leading-[0.95] tracking-tight text-black sm:text-[40px]">
              {t("home.promo.title")}
            </h2>
            <p className="mt-2 hidden max-w-md text-[13px] font-medium text-black/65 sm:block">
              {t("home.promo.sub")}
            </p>
            <Link
              href="/create"
              className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-black px-6 py-3 text-sm font-black text-[#c8ff3d] transition-transform hover:-translate-y-0.5"
            >
              {t("cta.tryMiniFree")}
            </Link>
          </div>
          {/* media side */}
          <div className="relative aspect-video w-full shrink-0 overflow-hidden rounded-[16px] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.5)] ring-1 ring-black/15 sm:aspect-[4/3] sm:w-[280px] lg:w-[340px]">
            <Clip
              demo={demo}
              eager
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
          </div>
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
  const { t } = useI18n();
  const features: {
    icon: string;
    titleKey: string;
    subKey: string;
    badgeKey: string;
    href: string;
  }[] = [
    { icon: "film", titleKey: "home.feat.mini.title", subKey: "home.feat.mini.sub", badgeKey: "badge.free", href: "/create" },
    { icon: "spark", titleKey: "home.feat.pro.title", subKey: "home.feat.pro.sub", badgeKey: "badge.paid", href: "/pricing" },
    { icon: "box", titleKey: "home.feat.blindbox.title", subKey: "home.feat.blindbox.sub", badgeKey: "badge.viral", href: "/create?effect=blind-box-unboxing" },
    { icon: "spin", titleKey: "home.feat.spin.title", subKey: "home.feat.spin.sub", badgeKey: "badge.seller", href: "/create?effect=360-spin-showcase" },
    { icon: "wand", titleKey: "home.feat.dance.title", subKey: "home.feat.dance.sub", badgeKey: "badge.viral", href: "/create?effect=make-figure-dance" },
    { icon: "clap", titleKey: "home.feat.cinema.title", subKey: "home.feat.cinema.sub", badgeKey: "badge.scene", href: "/cinema" },
  ];
  return (
    <section className="grid grid-cols-1 gap-3 px-3 py-4 sm:px-5 lg:grid-cols-[minmax(0,340px)_1fr] lg:gap-4">
      {/* pitch card */}
      <div className="flex flex-col justify-between rounded-[20px] border border-white/10 bg-gradient-to-br from-[#12242a] to-[#0e1417] p-6">
        <div>
          <h3 className="font-display text-2xl font-black uppercase leading-tight tracking-tight text-white">
            {t("home.pitch.title")}
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            <li>✓ {t("home.pitch.b1")}</li>
            <li>✓ {t("home.pitch.b2")}</li>
            <li>✓ {t("home.pitch.b3")}</li>
            <li>✓ {t("home.pitch.b4")}</li>
          </ul>
        </div>
        <Link
          href="/pricing"
          className="mt-6 inline-flex w-fit rounded-full bg-[#c8ff3d] px-5 py-2.5 text-sm font-black text-black"
        >
          {t("cta.seePricing")}
        </Link>
      </div>

      {/* feature card grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {features.map((f) => (
          <Link
            key={f.titleKey}
            href={f.href}
            className="card-i group relative flex flex-col justify-between overflow-hidden rounded-[18px] border border-white/10 bg-gradient-to-b from-white/[0.07] to-white/[0.02] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
          >
            {/* lime glow that blooms on hover */}
            <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#c8ff3d]/0 blur-2xl transition-all duration-300 group-hover:bg-[#c8ff3d]/20" />
            <div className="relative flex items-start justify-between">
              <span className="grid h-11 w-11 place-items-center rounded-xl border border-[#c8ff3d]/25 bg-[#c8ff3d]/[0.08] text-[#c8ff3d] shadow-[0_0_20px_-6px_rgba(200,255,61,0.4)]">
                <LineIcon name={f.icon} />
              </span>
              <span className="rounded-full border border-[#c8ff3d]/30 bg-[#c8ff3d]/10 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wide text-[#c8ff3d]">
                {t(f.badgeKey)}
              </span>
            </div>
            <div className="relative mt-6">
              <h4 className="font-display text-[17px] font-bold text-white transition-colors group-hover:text-[#c8ff3d]">
                {t(f.titleKey)}
              </h4>
              <p className="mt-1 text-[12.5px] leading-relaxed text-white/50">
                {t(f.subKey)}
              </p>
              <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wide text-white/30 transition-colors group-hover:text-[#c8ff3d]">
                Open <span aria-hidden>→</span>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

/* ---- 4. Dense autoplaying viral video wall ---- */
function ViralGrid({ items }: { items: FeedItem[] }) {
  const { t } = useI18n();
  const [filter, setFilter] = useState("all");
  const chips = useMemo(
    () => [
      { id: "all", label: t("home.viral.all") },
      ...CATEGORIES.map((c) => ({ id: c.id, label: c.label.toUpperCase() })),
    ],
    [t]
  );
  const wall = useMemo(
    () => (filter === "all" ? items : items.filter((i) => i.category === filter)),
    [filter, items]
  );

  return (
    <section className="px-2 py-6 sm:px-3">
      <div className="mb-3 flex items-end justify-between px-2">
        <h2 className="font-display text-[22px] font-bold uppercase tracking-tight text-white sm:text-[26px]">
          {t("home.viral.title")}
        </h2>
        <Link href="/effects" className="text-[12px] font-semibold text-[#c8ff3d]">
          {t("cta.viewAll")}
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
      <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7">
        {wall.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="group relative aspect-[3/4] overflow-hidden rounded-xl bg-neutral-900 ring-1 ring-white/5 transition-all duration-300 hover:z-10 hover:-translate-y-1 hover:ring-2 hover:ring-[#c8ff3d]/40 sm:aspect-[9/14]"
          >
            <Clip
              demo={item.demo}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent" />
            <p className="absolute inset-x-0 bottom-0 p-2 text-[11px] font-bold uppercase leading-tight tracking-wide text-white transition-colors group-hover:text-[#c8ff3d] sm:text-xs">
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
      <LimePromo demo={demos[3 % demos.length]} />
      <ModelGrid />
      <ViralGrid items={feed} />
    </div>
  );
}
