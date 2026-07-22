"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { DEMO_VIDEOS } from "@/lib/demoVideos";
import { HeroUpload } from "@/components/HeroUpload";
import { CAPABILITIES } from "@/lib/capabilities";

export function HeroVideoBanner() {
  const [index, setIndex] = useState(0);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const demo = DEMO_VIDEOS[index];

  useEffect(() => {
    const video = videoRef.current;
    if (!video || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPlaying(false);
      return;
    }
    video.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
  }, [index]);

  function choose(next: number) {
    setIndex(next);
    setProgress(0);
  }

  function togglePlay() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) video.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    else {
      video.pause();
      setPlaying(false);
    }
  }

  return (
    <section className="relative min-h-[calc(100vh-4rem)] overflow-hidden border-b border-[var(--border)] bg-black">
      <video
        key={demo.id}
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        poster={demo.poster}
        muted={muted}
        loop={false}
        playsInline
        autoPlay
        preload="auto"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => choose((index + 1) % DEMO_VIDEOS.length)}
        onTimeUpdate={(event) => {
          const video = event.currentTarget;
          setProgress(video.duration ? video.currentTime / video.duration : 0);
        }}
      >
        <source src={demo.webm} type="video/webm" />
        <source src={demo.mp4} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-black/30 to-black/45" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/25 to-black/35" />

      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-4rem)] max-w-[1500px] items-end gap-4 px-4 pb-5 pt-8 sm:gap-8 sm:px-7 sm:pb-12 sm:pt-20 lg:grid-cols-[minmax(0,1fr)_minmax(320px,430px)] lg:px-10">
        <div className="max-w-3xl pb-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="chip !border-white/15 !bg-black/35 !text-white/75">Designer toy video</span>
            <span className="chip !border-amber-200/20 !bg-black/35 !text-amber-100/70">PIKBO Lab prototype</span>
          </div>
          <h1 className="mt-4 max-w-3xl font-[family-name:var(--font-display)] text-[2.85rem] font-black uppercase leading-[0.9] tracking-[-0.055em] text-white sm:mt-5 sm:text-7xl lg:text-[5.6rem]">
            One toy photo.
            <br />
            <span className="text-[var(--mint)]">A whole campaign.</span>
          </h1>
          <p className="mt-5 hidden max-w-xl text-sm leading-6 text-white/68 sm:block sm:text-base sm:leading-7">
            Turn figures, blind boxes, plush, and sofubi you own into product CGI, unboxings, story clips, and shop hooks.
          </p>

          <div className="mt-7 hidden max-w-2xl items-center gap-3 sm:flex">
            <button type="button" onClick={togglePlay} className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/20 bg-black/35 text-xs text-white backdrop-blur" aria-label={playing ? "Pause hero video" : "Play hero video"}>
              {playing ? "Ⅱ" : "▶"}
            </button>
            <button type="button" onClick={() => setMuted((value) => !value)} className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/20 bg-black/35 text-xs text-white backdrop-blur" aria-label={muted ? "Unmute hero video" : "Mute hero video"}>
              {muted ? "⌁" : "♪"}
            </button>
            <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/15"><div className="h-full bg-[var(--mint)] transition-[width]" style={{ width: `${progress * 100}%` }} /></div>
            <span className="hidden text-[10px] font-bold uppercase tracking-wider text-white/55 sm:block">{demo.title}</span>
          </div>

          <div className="mt-5 hidden gap-2 overflow-x-auto pb-1 sm:flex" aria-label="Choose a lab clip">
            {DEMO_VIDEOS.map((item, itemIndex) => (
              <button
                key={item.id}
                type="button"
                onClick={() => choose(itemIndex)}
                className={`relative h-16 w-12 shrink-0 overflow-hidden rounded-xl border transition sm:h-20 sm:w-16 ${itemIndex === index ? "border-[var(--mint)] ring-1 ring-[var(--mint)]" : "border-white/15 opacity-65 hover:opacity-100"}`}
                aria-label={`Play ${item.title}`}
                aria-pressed={itemIndex === index}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.poster} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <aside className="rounded-3xl border border-white/15 bg-black/60 p-3 shadow-2xl backdrop-blur-2xl sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="section-label">Start here</p>
              <h2 className="mt-1 text-lg font-bold text-white">Animate your own toy</h2>
            </div>
            <span className="rounded-full bg-white/8 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-white/50">Private validation</span>
          </div>
          <p className="mt-2 hidden text-xs leading-5 text-white/55 sm:block">Choose a look, add one owned-toy photo, and open Studio with the recipe loaded.</p>
          <div className="mt-4"><HeroUpload /></div>
          <div className="mt-3 flex items-center justify-between text-[10px] text-white/45">
            <span>{CAPABILITIES.toyImageToVideo.publicNote}</span>
            <Link href="/explore" className="font-semibold text-[var(--mint)]">Watch lab projects →</Link>
          </div>
        </aside>
      </div>
    </section>
  );
}
