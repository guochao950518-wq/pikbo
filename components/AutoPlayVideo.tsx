"use client";

import { useEffect, useRef, type CSSProperties } from "react";

const playing = new Set<HTMLVideoElement>();
const MAX_PLAYING = 2;

function claim(v: HTMLVideoElement) {
  if (playing.has(v)) return;
  if (playing.size >= MAX_PLAYING) {
    const oldest = playing.values().next().value;
    if (oldest && oldest !== v) {
      oldest.pause();
      playing.delete(oldest);
    }
  }
  playing.add(v);
  v.muted = true;
  void v.play().catch(() => undefined);
}

function release(v: HTMLVideoElement) {
  playing.delete(v);
  v.pause();
}

/** Viewport autoplay with metadata preload and ≤2 concurrent plays (G2 soft perf). */
export function AutoPlayVideo({
  poster,
  webm,
  mp4,
  className,
  style,
  eager,
}: {
  poster: string;
  webm: string;
  mp4: string;
  className?: string;
  style?: CSSProperties;
  /** Kick play sooner when near the fold (still preload=metadata) */
  eager?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    if (eager) claim(v);

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && e.intersectionRatio >= 0.12) claim(v);
        else release(v);
      },
      { threshold: [0, 0.12, 0.35], rootMargin: "80px 0px" }
    );
    io.observe(v);
    return () => {
      io.disconnect();
      release(v);
    };
  }, [eager, mp4]);

  return (
    <video
      ref={ref}
      className={className}
      style={style}
      poster={poster}
      muted
      loop
      playsInline
      preload="metadata"
    >
      <source src={webm} type="video/webm" />
      <source src={mp4} type="video/mp4" />
    </video>
  );
}
