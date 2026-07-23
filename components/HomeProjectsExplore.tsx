"use client";

import Link from "next/link";
import type { CommunityProject } from "@/lib/videoFeed";
import { AutoPlayVideo } from "@/components/AutoPlayVideo";

/** HF “Explore the inside of every project” — tall portrait video cards */
export function HomeProjectsExplore({
  projects,
}: {
  projects: CommunityProject[];
}) {
  return (
    <section className="py-6">
      <div className="mb-4 flex items-end justify-between gap-3 px-4 sm:px-5">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
            Explore the inside of every project
          </h2>
          <p className="mt-1 text-sm text-white/45">
            Watch official cached Pikbo examples — tap to try the recipe with your figure
          </p>
        </div>
        <Link
          href="/community"
          className="shrink-0 text-xs font-semibold text-[var(--mint)] hover:underline"
        >
          See official examples
        </Link>
      </div>

      <div className="flex gap-3 overflow-x-auto px-4 pb-2 snap-x snap-mandatory sm:gap-3.5 sm:px-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {projects.map((p, i) => (
          <Link
            key={p.id}
            href={p.remakeHref}
            className="group relative h-[380px] w-[min(62vw,210px)] shrink-0 snap-start overflow-hidden rounded-2xl bg-zinc-900 sm:h-[420px] sm:w-[200px]"
          >
            <AutoPlayVideo
              poster={p.demo.poster}
              webm={p.demo.webm}
              mp4={p.demo.mp4}
              eager={i < 4}
              className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.05]"
              style={{
                // slight variety so reused demos don't look identical
                filter:
                  i % 4 === 1
                    ? "saturate(1.15) contrast(1.05)"
                    : i % 4 === 2
                      ? "saturate(0.95) brightness(1.05)"
                      : i % 4 === 3
                        ? "contrast(1.08)"
                        : undefined,
                objectPosition: i % 2 === 0 ? "center top" : "center center",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent" />
            <span className="absolute left-2.5 top-2.5 rounded-full border border-white/15 bg-black/45 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white/90 backdrop-blur">
              {p.visibility}
            </span>
            <div className="absolute inset-x-0 bottom-0 p-3">
              <div className="mb-2 flex items-center gap-2">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-[var(--mint)] text-[9px] font-black text-black">
                  {p.author.initials}
                </span>
                <span className="truncate text-[10px] text-white/60">
                  {p.author.name}
                </span>
              </div>
              <h3 className="line-clamp-2 text-[13px] font-semibold leading-snug text-white">
                {p.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
