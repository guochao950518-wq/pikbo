"use client";

import { useEffect, useRef, type CSSProperties } from "react";

/** Eager autoplay when near viewport — HF home density depends on this */
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
  /** Start loading immediately (above-the-fold rails) */
  eager?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const play = () => {
      v.muted = true;
      void v.play().catch(() => undefined);
    };

    if (eager) {
      play();
    }

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && e.intersectionRatio >= 0.12) play();
        else v.pause();
      },
      { threshold: [0, 0.12, 0.35], rootMargin: "120px 0px" }
    );
    io.observe(v);
    return () => io.disconnect();
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
      autoPlay={eager}
      preload={eager ? "auto" : "metadata"}
    >
      <source src={webm} type="video/webm" />
      <source src={mp4} type="video/mp4" />
    </video>
  );
}
