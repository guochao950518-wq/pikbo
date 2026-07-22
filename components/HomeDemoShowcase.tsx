"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { DEMO_VIDEOS, type DemoVideo } from "@/lib/demoVideos";

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  return reduced;
}

export function HeroDemoStage() {
  const reducedMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(true);
  const [failed, setFailed] = useState(false);
  const active = DEMO_VIDEOS[activeIndex];

  useEffect(() => {
    const video = videoRef.current;
    if (!video || reducedMotion || failed) return;
    video.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
  }, [activeIndex, failed, reducedMotion]);

  function selectDemo(index: number) {
    setActiveIndex(index);
    setFailed(false);
    setPlaying(!reducedMotion);
  }

  function togglePlayback() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    } else {
      video.pause();
      setPlaying(false);
    }
  }

  return (
    <div className="relative mx-auto w-full max-w-[640px]">
      <div className="absolute -inset-8 -z-10 rounded-[3rem] bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,.28),transparent_68%)] blur-2xl" />
      <div className="overflow-hidden rounded-[1.8rem] border border-white/12 bg-black shadow-[0_35px_90px_-35px_rgba(0,0,0,.95)]">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/55">
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[var(--mint)] shadow-[0_0_14px_var(--mint)]" />
            Photo → motion
          </span>
          <span>Cached demo · no credits used</span>
        </div>

        <div className="grid min-h-[420px] grid-cols-[31%_69%] sm:min-h-[520px]">
          <div className="relative overflow-hidden border-r border-white/10 bg-[#15111c]">
            <Image
              src={active.poster}
              alt={`${active.character} original toy photo`}
              fill
              priority={activeIndex === 0}
              sizes="(max-width: 640px) 31vw, 190px"
              className="object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/15" />
            <span className="absolute left-3 top-3 rounded-full border border-white/15 bg-black/45 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white/80 backdrop-blur">
              Input
            </span>
            <div className="absolute inset-x-3 bottom-3">
              <p className="text-xs font-semibold text-white">{active.character}</p>
              <p className="mt-0.5 text-[10px] text-white/55">One owned-toy photo</p>
            </div>
          </div>

          <div className="relative overflow-hidden bg-[#08070b]">
            {!failed ? (
              // eslint-disable-next-line jsx-a11y/media-has-caption
              <video
                key={active.id}
                ref={videoRef}
                poster={active.poster}
                muted={muted}
                loop
                playsInline
                autoPlay={!reducedMotion}
                preload="metadata"
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
                onError={() => setFailed(true)}
                className="h-full w-full object-cover"
              >
                <source src={active.webm} type="video/webm" />
                <source src={active.mp4} type="video/mp4" />
              </video>
            ) : (
              <div className="relative h-full min-h-[420px] sm:min-h-[520px]">
                <Image
                  src={active.poster}
                  alt={`${active.title} preview`}
                  fill
                  sizes="(max-width: 640px) 69vw, 430px"
                  className="object-cover opacity-60"
                />
                <div className="absolute inset-0 grid place-items-center bg-black/45 p-6 text-center">
                  <p className="text-sm font-medium text-white/80">
                    Video preview unavailable. The preset is still ready in Studio.
                  </p>
                </div>
              </div>
            )}

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/10" />
            <span className="absolute right-3 top-3 rounded-full bg-[var(--mint)] px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-[#07100d]">
              Result
            </span>

            <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/55">
                {active.eyebrow} · {active.ratio}
              </p>
              <div className="mt-1 flex items-end justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-white sm:text-xl">{active.title}</h2>
                  <p className="mt-1 max-w-sm text-xs leading-5 text-white/65">
                    {active.result}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    onClick={togglePlayback}
                    className="grid h-9 w-9 place-items-center rounded-full border border-white/15 bg-black/45 text-sm text-white backdrop-blur transition hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mint)]"
                    aria-label={playing ? "Pause demo" : "Play demo"}
                  >
                    {playing ? "Ⅱ" : "▶"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setMuted((value) => !value)}
                    className="grid h-9 w-9 place-items-center rounded-full border border-white/15 bg-black/45 text-sm text-white backdrop-blur transition hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mint)]"
                    aria-label={muted ? "Unmute demo" : "Mute demo"}
                  >
                    {muted ? "⌁" : "♪"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-4 gap-2" aria-label="Choose a demo">
        {DEMO_VIDEOS.slice(0, 4).map((demo, index) => (
          <button
            key={demo.id}
            type="button"
            onClick={() => selectDemo(index)}
            aria-pressed={index === activeIndex}
            className={`rounded-xl border px-2 py-2 text-left transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mint)] ${
              index === activeIndex
                ? "border-white/35 bg-white/10 text-white"
                : "border-white/8 bg-white/[.035] text-white/45 hover:bg-white/[.07] hover:text-white/75"
            }`}
          >
            <span
              className="mb-1 block h-1 w-6 rounded-full"
              style={{ background: demo.accent }}
            />
            <span className="block truncate text-[10px] font-bold uppercase tracking-wider">
              {demo.eyebrow}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function ShowcaseCard({ demo, index }: { demo: DemoVideo; index: number }) {
  const reducedMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || reducedMotion) return;
    const canHover = window.matchMedia("(hover: hover)").matches;
    if (canHover) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.7) {
          video.play().catch(() => undefined);
        } else {
          video.pause();
        }
      },
      { threshold: [0, 0.7, 1] }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [reducedMotion]);

  function playPreview() {
    if (!reducedMotion) videoRef.current?.play().catch(() => undefined);
  }

  function pausePreview() {
    videoRef.current?.pause();
  }

  return (
    <article
      className={`group overflow-hidden rounded-[1.4rem] border border-white/10 bg-white/[.035] ${
        index === 0 || index === 3 ? "sm:row-span-2" : ""
      }`}
      onMouseEnter={playPreview}
      onMouseLeave={pausePreview}
      onFocus={playPreview}
      onBlur={pausePreview}
    >
      <div
        className={`relative overflow-hidden bg-black ${
          index === 0 || index === 3 ? "aspect-[4/5]" : "aspect-[4/3]"
        }`}
      >
        {!failed ? (
          // eslint-disable-next-line jsx-a11y/media-has-caption
          <video
            ref={videoRef}
            poster={demo.poster}
            muted
            loop
            playsInline
            preload="none"
            onError={() => setFailed(true)}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
          >
            <source src={demo.webm} type="video/webm" />
            <source src={demo.mp4} type="video/mp4" />
          </video>
        ) : (
          <Image
            src={demo.poster}
            alt={`${demo.character} concept still`}
            fill
            sizes="(max-width: 640px) 100vw, 33vw"
            className="object-cover opacity-75"
          />
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/55">
            {demo.eyebrow} · {demo.ratio}
          </p>
          <h3 className="mt-1 text-lg font-bold text-white">{demo.title}</h3>
        </div>
      </div>
      <div className="flex items-center justify-between gap-3 p-4">
        <p className="text-xs leading-5 text-[var(--fg-muted)]">{demo.result}</p>
        <Link
          href={`/create?effect=${demo.preset}`}
          className="shrink-0 rounded-full border border-white/12 bg-white/[.06] px-3 py-2 text-xs font-semibold text-white transition hover:border-[var(--mint)]/55 hover:text-[var(--mint)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mint)]"
        >
          Use look →
        </Link>
      </div>
    </article>
  );
}

export function HomeDemoShowcase() {
  return (
    <section id="examples" className="border-y border-white/8 bg-[#08070b] py-20 sm:py-28">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--mint)]">
              Real encoded previews
            </p>
            <h2 className="mt-3 max-w-2xl text-3xl font-bold leading-tight sm:text-5xl">
              One shelf. More content than you thought.
            </h2>
          </div>
          <div className="max-w-sm">
            <p className="text-sm leading-6 text-[var(--fg-muted)]">
              Hover a clip on desktop or scroll it into view on mobile. Every look opens with the matching Studio preset.
            </p>
            <Link href="/pricing" className="mt-4 inline-flex text-sm font-semibold text-[var(--mint)] hover:text-white">
              Compare plans for more clips →
            </Link>
          </div>
        </div>

        <div className="mt-10 grid auto-rows-min gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {DEMO_VIDEOS.map((demo, index) => (
            <ShowcaseCard key={demo.id} demo={demo} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
