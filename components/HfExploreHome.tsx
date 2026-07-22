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
    // also kick on first user gesture (browser autoplay policies)
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
  style,
}: {
  demo: DemoVideo;
  className?: string;
  eager?: boolean;
  style?: React.CSSProperties;
}) {
  const ref = useAutoPlay(eager);
  return (
    <video
      ref={ref}
      className={className}
      style={style}
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

/** Top HF promo cards — edge-to-edge, huge, pure video */
function PromoRail({ demos }: { demos: DemoVideo[] }) {
  const cards = useMemo(() => {
    const meta = [
      { title: "Seedance free trial", blurb: "Figure photo → clip", href: "/create", badge: "Live" },
      { title: "Blind-box unboxing", blurb: "Reveal for Reels", href: "/create?effect=blind-box-unboxing" },
      { title: "360° listing spin", blurb: "Marketplace packshot", href: "/create?effect=360-spin-showcase" },
      { title: "Drop-day viral hook", blurb: "First-second motion", href: "/create?effect=paparazzi-flash" },
      { title: "Seller batch pack", blurb: "Spin · unbox · list", href: "/supercomputer", badge: "Shop" },
      { title: "Miniature world", blurb: "Shelf → scene", href: "/create?effect=miniature-scene" },
      { title: "Toy dance", blurb: "Come-alive loop", href: "/create?effect=make-figure-dance" },
      { title: "Neon city night", blurb: "Scene look", href: "/create?effect=neon-city-night" },
      { title: "Power aura", blurb: "VFX hero", href: "/create?effect=power-aura" },
      { title: "Smoke entrance", blurb: "Trailer energy", href: "/create?effect=smoke-burst-entrance" },
    ];
    return meta.map((m, i) => ({ ...m, demo: demos[i % demos.length] }));
  }, [demos]);

  return (
    <div className="flex gap-3 overflow-x-auto px-3 pt-3 pb-1 snap-x snap-mandatory sm:gap-3.5 sm:px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {cards.map((c, i) => (
        <Link
          key={c.title + i}
          href={c.href}
          className="relative h-[min(70vh,580px)] w-[min(82vw,360px)] shrink-0 snap-center overflow-hidden rounded-[22px] bg-neutral-900 sm:h-[min(74vh,620px)] sm:w-[310px] md:w-[330px]"
        >
          <Clip
            demo={c.demo}
            eager={i < 4}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/95 via-black/15 to-black/10" />
          {c.badge && (
            <span className="absolute left-3.5 top-3.5 rounded-full bg-[#c8ff3d] px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-black">
              {c.badge}
            </span>
          )}
          <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
            <h3 className="text-[19px] font-bold leading-tight text-white sm:text-[22px]">
              {c.title}
            </h3>
            <p className="mt-1 text-[13px] text-white/60">{c.blurb}</p>
            <span className="mt-4 inline-flex rounded-full bg-white/15 px-3.5 py-1.5 text-[12px] font-bold text-white backdrop-blur-md">
              Open →
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}

function ToolShelf() {
  const tools = [
    { href: "/create", label: "Seedance", sub: "Video", hot: true },
    { href: "/effects", label: "Presets", sub: "Viral" },
    { href: "/supercomputer", label: "Batch", sub: "Agent" },
    { href: "/image", label: "Image", sub: "Still" },
    { href: "/cinema", label: "Cinema", sub: "Scene" },
    { href: "/community", label: "Community", sub: "Watch" },
    { href: "/models", label: "Models", sub: "Live" },
    { href: "/create", label: "Generate", sub: "Start" },
  ];
  return (
    <div className="flex gap-2 overflow-x-auto px-3 py-4 sm:px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {tools.map((t) => (
        <Link
          key={t.label}
          href={t.href}
          className={`flex min-w-[150px] shrink-0 items-center gap-3 rounded-2xl border px-3 py-3 ${
            t.hot
              ? "border-[#c8ff3d]/40 bg-[#c8ff3d]/10"
              : "border-white/10 bg-white/[0.03]"
          }`}
        >
          <span
            className={`grid h-11 w-11 place-items-center rounded-xl text-sm font-black ${
              t.hot ? "bg-[#c8ff3d] text-black" : "bg-white/10 text-white"
            }`}
          >
            {t.label.slice(0, 1)}
          </span>
          <span>
            <span className="block text-[13px] font-bold text-white">{t.label}</span>
            <span className="block text-[11px] text-white/45">{t.sub}</span>
          </span>
        </Link>
      ))}
    </div>
  );
}

function ProjectRail({ projects }: { projects: CommunityProject[] }) {
  return (
    <section className="py-5">
      <div className="mb-3 flex items-end justify-between px-4 sm:px-5">
        <div>
          <h2 className="text-[22px] font-bold tracking-tight text-white sm:text-[26px]">
            Explore the inside of every project
          </h2>
          <p className="mt-1 text-[13px] text-white/45">
            See the clip first — remake with a toy you own
          </p>
        </div>
        <Link href="/community" className="text-[12px] font-semibold text-[#c8ff3d]">
          Explore community
        </Link>
      </div>
      <div className="flex gap-3 overflow-x-auto px-4 pb-2 snap-x snap-mandatory sm:px-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {projects.map((p, i) => (
          <Link
            key={p.id}
            href={p.remakeHref}
            className="relative h-[400px] w-[200px] shrink-0 snap-start overflow-hidden rounded-2xl bg-neutral-900 sm:h-[440px] sm:w-[210px]"
          >
            <Clip
              demo={p.demo}
              eager={i < 5}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
            <span className="absolute left-2.5 top-2.5 rounded-full border border-white/15 bg-black/50 px-2 py-0.5 text-[9px] font-bold uppercase text-white/90">
              {p.visibility}
            </span>
            <div className="absolute inset-x-0 bottom-0 p-3">
              <div className="mb-1.5 flex items-center gap-2">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-[#c8ff3d] text-[9px] font-black text-black">
                  {p.author.initials}
                </span>
                <span className="truncate text-[10px] text-white/55">{p.author.name}</span>
              </div>
              <h3 className="line-clamp-2 text-[13px] font-semibold text-white">{p.title}</h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function Campaign({ demos }: { demos: DemoVideo[] }) {
  const hero = demos[0];
  return (
    <section className="relative my-2 min-h-[320px] overflow-hidden border-y border-white/10 sm:min-h-[380px]">
      <Clip demo={hero} eager className="absolute inset-0 h-full w-full object-cover opacity-60" />
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/75 to-black/20" />
      <div className="relative z-10 flex h-full min-h-[320px] flex-col justify-end px-5 py-10 sm:min-h-[380px] sm:px-8 sm:py-14">
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#c8ff3d]">
          Already available
        </p>
        <h2 className="mt-2 text-4xl font-black tracking-tight text-white sm:text-6xl">
          Seedance
          <span className="block text-[#c8ff3d]">for toys</span>
        </h2>
        <p className="mt-2 max-w-md text-sm text-white/55">
          Image → video for designer figures. Watch the wall, then remake.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <Link
            href="/create"
            className="rounded-full bg-[#c8ff3d] px-7 py-3 text-sm font-black text-black"
          >
            Try now
          </Link>
          <Link
            href="/community"
            className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white"
          >
            Watch more
          </Link>
        </div>
        <div className="mt-6 flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {demos.slice(0, 8).map((d) => (
            <Link
              key={d.id}
              href={`/create?effect=${encodeURIComponent(d.preset)}`}
              className="relative h-36 w-24 shrink-0 overflow-hidden rounded-xl border border-white/10"
            >
              <Clip demo={d} className="absolute inset-0 h-full w-full object-cover" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function ViralGrid({ items }: { items: FeedItem[] }) {
  const [filter, setFilter] = useState("all");
  const chips = useMemo(
    () => [
      { id: "all", label: "ALL" },
      ...CATEGORIES.map((c) => ({ id: c.id, label: c.label.toUpperCase() })),
    ],
    []
  );
  const wall = useMemo(() => {
    if (filter === "all") return items;
    return items.filter((i) => i.category === filter);
  }, [filter, items]);

  return (
    <section className="px-2 py-8 sm:px-3">
      <div className="mb-3 flex items-end justify-between px-2">
        <div>
          <h2 className="text-[22px] font-bold text-white sm:text-[26px]">Viral toy presets</h2>
          <p className="mt-1 text-[13px] text-white/40">
            Scroll · every card autoplays · tap to remake
          </p>
        </div>
        <Link href="/effects" className="text-[12px] font-semibold text-[#c8ff3d]">
          View all presets
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
        {wall.map((item, i) => (
          <Link
            key={item.id}
            href={item.href}
            className="relative aspect-[3/4] overflow-hidden rounded-xl bg-neutral-900 sm:aspect-[9/14]"
          >
            <Clip
              demo={item.demo}
              className="absolute inset-0 h-full w-full object-cover"
              style={{
                objectPosition: i % 2 === 0 ? "center top" : "center",
              }}
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
  return (
    <div className="min-h-screen bg-black pb-24 text-white">
      <PromoRail demos={demos} />
      <ToolShelf />
      <ProjectRail projects={projects} />
      <Campaign demos={demos} />
      <ViralGrid items={feed} />
      <section className="mx-3 mb-8 overflow-hidden rounded-3xl border border-white/10 sm:mx-4">
        <Link href="/supercomputer" className="relative block min-h-[170px]">
          <Clip
            demo={demos[1] ?? demos[0]}
            className="absolute inset-0 h-full w-full object-cover opacity-45"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
          <div className="relative z-10 px-6 py-10 sm:px-10">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#c8ff3d]">
              Supercomputer
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight">
              One superagent
              <span className="block text-white/60">for your seller stack</span>
            </h2>
            <span className="mt-5 inline-flex rounded-full bg-[#c8ff3d] px-5 py-2.5 text-xs font-black text-black">
              Try Batch
            </span>
          </div>
        </Link>
      </section>
    </div>
  );
}
