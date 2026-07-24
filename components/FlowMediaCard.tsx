"use client";

import Link from "next/link";
import { AutoPlayVideo } from "@/components/AutoPlayVideo";

/**
 * Flow matrix card — Lab media with shared AutoPlay budget
 * (mobile ≤1 concurrent · preload none · Link owns focus).
 * Never autoPlay all cards at once.
 */
export function FlowMediaCard({
  href,
  title,
  blurb,
  badge,
  isPreview,
  poster,
  webm,
  mp4,
}: {
  href: string;
  title: string;
  blurb: string;
  badge: string;
  isPreview?: boolean;
  poster: string;
  webm?: string;
  mp4: string;
}) {
  return (
    <Link
      href={href}
      className="group relative overflow-hidden rounded-2xl bg-neutral-900 ring-1 ring-white/10 transition hover:-translate-y-1 hover:ring-[#c8ff3d]/45"
      aria-label={`Open ${title}`}
    >
      <div className="relative aspect-video">
        <AutoPlayVideo
          poster={poster}
          webm={webm}
          mp4={mp4}
          focusable={false}
          className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />
        <span
          className={`absolute left-2.5 top-2.5 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide ${
            isPreview
              ? "bg-amber-400/90 text-black"
              : "bg-black/60 text-[#c8ff3d]"
          }`}
        >
          {badge}
        </span>
        <span className="absolute bottom-2 right-2 rounded bg-black/55 px-1.5 py-0.5 text-[9px] text-white/50">
          Lab media
        </span>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold group-hover:text-[#c8ff3d]">{title}</h3>
        <p className="mt-1 text-sm leading-snug text-white/50">{blurb}</p>
        <p className="mt-3 text-[11px] font-bold uppercase tracking-wide text-[#c8ff3d]">
          Open →
        </p>
      </div>
    </Link>
  );
}
