"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import type { CommunityProject } from "@/lib/videoFeed";

function WideProjectCard({ project }: { project: CommunityProject }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && e.intersectionRatio >= 0.25) {
          v.play().catch(() => undefined);
        } else {
          v.pause();
        }
      },
      { threshold: [0, 0.25, 0.5] }
    );
    io.observe(v);
    return () => io.disconnect();
  }, [project.id]);

  return (
    <Link
      href={project.remakeHref}
      className="group relative h-[340px] w-[min(70vw,240px)] shrink-0 snap-start overflow-hidden rounded-2xl border border-white/10 bg-black sm:h-[380px] sm:w-[220px]"
    >
      <video
        ref={ref}
        className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
        poster={project.demo.poster}
        muted
        loop
        playsInline
        preload="metadata"
      >
        <source src={project.demo.webm} type="video/webm" />
        <source src={project.demo.mp4} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
      <span className="absolute left-2.5 top-2.5 rounded-full border border-white/15 bg-black/50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white/90 backdrop-blur">
        {project.visibility}
      </span>
      <div className="absolute inset-x-0 bottom-0 p-3">
        <div className="mb-2 flex items-center gap-2">
          <span
            className="grid h-6 w-6 place-items-center rounded-full text-[9px] font-black text-black"
            style={{ background: "var(--mint)" }}
          >
            {project.author.initials}
          </span>
          <span className="truncate text-[10px] text-white/70">
            {project.author.name}
            {project.author.badge ? (
              <span className="text-[var(--mint)]"> · {project.author.badge}</span>
            ) : null}
          </span>
        </div>
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-white">
          {project.title}
        </h3>
        <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-white/45">
          {project.look}
        </p>
      </div>
    </Link>
  );
}

/** HF “Explore the inside of every project” horizontal video rail */
export function HomeProjectsExplore({
  projects,
}: {
  projects: CommunityProject[];
}) {
  return (
    <section className="border-b border-[var(--border)] py-6">
      <div className="mb-4 flex items-end justify-between px-4 sm:px-6">
        <div>
          <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
            Explore every Lab project
          </h2>
          <p className="mt-1 text-sm text-[var(--fg-dim)]">
            Watch AI toy clips first — remake any look with your own figure
          </p>
        </div>
        <Link
          href="/community"
          className="shrink-0 text-xs font-semibold text-[var(--mint)] hover:underline"
        >
          Explore community →
        </Link>
      </div>
      <div className="flex gap-3 overflow-x-auto px-4 pb-2 snap-x snap-mandatory sm:px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {projects.map((p) => (
          <WideProjectCard key={p.id} project={p} />
        ))}
      </div>
    </section>
  );
}
