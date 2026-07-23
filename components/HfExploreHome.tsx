"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import type { DemoVideo } from "@/lib/demoVideos";
import type { CommunityProject, FeedItem } from "@/lib/videoFeed";

/** Soft concurrent autoplay budget — pause extras when many tiles enter view. */
const playingVideos = new Set<HTMLVideoElement>();
const MAX_PLAYING = 2;

function claimPlay(v: HTMLVideoElement) {
  if (playingVideos.has(v)) return;
  if (playingVideos.size >= MAX_PLAYING) {
    const oldest = playingVideos.values().next().value;
    if (oldest && oldest !== v) {
      oldest.pause();
      playingVideos.delete(oldest);
    }
  }
  playingVideos.add(v);
  v.muted = true;
  v.playsInline = true;
  void v.play().catch(() => undefined);
}

function releasePlay(v: HTMLVideoElement) {
  playingVideos.delete(v);
  v.pause();
}

function useAutoPlay(eager = false) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const kick = () => claimPlay(v);
    if (eager) kick();
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) kick();
        else releasePlay(v);
      },
      { rootMargin: "80px 0px", threshold: 0.2 }
    );
    io.observe(v);
    const onGesture = () => kick();
    window.addEventListener("touchstart", onGesture, { once: true, passive: true });
    window.addEventListener("click", onGesture, { once: true });
    return () => {
      io.disconnect();
      releasePlay(v);
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
      preload="metadata"
    >
      <source src={demo.webm} type="video/webm" />
      <source src={demo.mp4} type="video/mp4" />
    </video>
  );
}

/**
 * Flagship home: one job, one CTA, real proof wall.
 * No multi-model theater, no empty product shelves.
 */
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
  const heroDemo = demos[0] ?? feed[0]?.demo;
  const showcase = feed.slice(0, 8);

  return (
    <div className="min-h-screen bg-black pb-28 text-white sm:pb-16">
      {/* ── Hero: ICP + single primary CTA ── */}
      <section className="relative overflow-hidden border-b border-white/10">
        {heroDemo && (
          <div className="pointer-events-none absolute inset-0 opacity-35">
            <Clip
              demo={heroDemo}
              eager
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/80 to-black" />
          </div>
        )}
        <div className="relative mx-auto max-w-3xl px-4 pb-10 pt-10 text-center sm:px-6 sm:pb-14 sm:pt-16">
          <p className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#c8ff3d]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#c8ff3d]" />
            Official examples · one free Mini trial
          </p>
          <h1 className="font-display mt-4 text-[1.85rem] font-black uppercase leading-[1.05] tracking-tight text-white sm:text-5xl">
            One toy photo. A clip ready to list or post.
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-[13px] leading-relaxed text-white/60 sm:text-[15px]">
            Built for collectors, toy sellers, and small shops. Choose a
            toy-specific recipe, review the generated details, then prepare it
            for Etsy, Whatnot, TikTok, or your next drop.
          </p>
          <div className="mt-6 flex flex-col items-center gap-3">
            <Link
              href="/create"
              className="inline-flex w-full max-w-xs items-center justify-center rounded-full bg-[#c8ff3d] px-8 py-3.5 text-sm font-black text-black shadow-[0_0_40px_-8px_rgba(200,255,61,0.55)] transition hover:-translate-y-0.5 sm:w-auto"
            >
              Animate my toy
            </Link>
            <p className="text-[11px] text-white/40">
              Upload one owned-toy photo → choose a recipe → review the result.
            </p>
          </div>
        </div>
      </section>

      {/* ── Proof wall: ≤8 unique Lab demos ── */}
      <section className="px-3 py-8 sm:px-5 sm:py-10">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="font-display text-[20px] font-bold uppercase tracking-tight text-white sm:text-[26px]">
              Official Pikbo examples
            </h2>
            <p className="mt-1 text-[12px] text-white/45">
              Cached Pikbo product demonstrations—not customer posts. One
              unique clip per card.
            </p>
          </div>
          <Link
            href="/effects"
            className="text-[12px] font-semibold text-[#c8ff3d] hover:underline"
          >
            All effects →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:gap-3">
          {showcase.map((item, i) => (
            <Link
              key={item.id}
              href={item.href}
              className="group relative aspect-[3/4] overflow-hidden rounded-xl bg-neutral-900 ring-1 ring-white/5 transition-all duration-300 hover:z-10 hover:-translate-y-1 hover:ring-2 hover:ring-[#c8ff3d]/40 sm:aspect-[9/14]"
            >
              <Clip
                demo={item.demo}
                eager={i < 2}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/15 to-transparent" />
              <span className="absolute left-2 top-2 rounded-full bg-black/70 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[#c8ff3d] ring-1 ring-white/10">
                {item.badge ?? "Official example · cached"}
              </span>
              <p className="absolute inset-x-0 bottom-0 p-2 text-[11px] font-bold uppercase leading-tight tracking-wide text-white transition-colors group-hover:text-[#c8ff3d] sm:text-xs">
                {item.title}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Thin Seller Pack entry (MVP path, not full OS) ── */}
      <section className="px-3 pb-6 sm:px-5">
        <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-transparent p-5 sm:flex-row sm:items-center sm:p-6">
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-[#c8ff3d]">
              Seller Pack · MVP
            </p>
            <h3 className="mt-1 font-display text-lg font-bold uppercase tracking-tight text-white sm:text-xl">
              One photo → listing spin + reveal + social hook
            </h3>
            <p className="mt-1 max-w-md text-[12px] text-white/50">
              Three fixed formats for marketplace sellers. Official cached
              examples are free to view; live jobs use credits per clip.
            </p>
          </div>
          <Link
            href="/supercomputer?pack=seller"
            className="inline-flex shrink-0 items-center rounded-full border border-[#c8ff3d]/40 px-5 py-2.5 text-sm font-bold text-[#c8ff3d] transition hover:bg-[#c8ff3d]/10"
          >
            Open Seller Pack →
          </Link>
        </div>
      </section>

      {/* Secondary CTA strip — same primary action, no competing CTAs */}
      <section className="px-3 pb-10 text-center sm:px-5">
        <Link
          href="/create"
          className="inline-flex items-center justify-center rounded-full bg-[#c8ff3d] px-8 py-3 text-sm font-black text-black"
        >
          Animate one SKU
        </Link>
        <p className="mt-2 text-[11px] text-white/35">
          One Mini trial when live generation is available · no card required
        </p>
      </section>
    </div>
  );
}
