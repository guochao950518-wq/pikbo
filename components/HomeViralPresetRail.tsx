"use client";

import Link from "next/link";
import { DEMO_VIDEOS } from "@/lib/demoVideos";
import { track } from "@/lib/analytics";
import { createRemixHref } from "@/lib/remixIntent";
import { AutoPlayVideo } from "@/components/AutoPlayVideo";

/**
 * HF Viral Presets pattern — dense horizontal rail of unique Lab clips.
 * One card = one recipe deep link. No shared-loop masquerade.
 */
export function HomeViralPresetRail() {
  // Prefer unique presets; keep order of DEMO_VIDEOS as Lab batch order
  const seen = new Set<string>();
  const clips = DEMO_VIDEOS.filter((d) => {
    if (seen.has(d.preset)) return false;
    seen.add(d.preset);
    return true;
  }).slice(0, 12);

  return (
    <section className="border-b border-white/10 px-3 py-10 sm:px-5">
      <div className="mx-auto max-w-6xl">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#c8ff3d]/90">
              Toy viral presets
            </p>
            <h2 className="mt-1 font-display text-xl font-bold uppercase tracking-tight sm:text-2xl">
              One tap · recipe ready
            </h2>
            <p className="mt-1 max-w-xl text-sm text-white/45">
              Higgsfield-style preset wall, toy-native: each clip is an official
              Lab sample for one registered recipe — remake with your photo.
            </p>
          </div>
          <Link
            href="/effects"
            className="text-[12px] font-semibold text-[#c8ff3d] hover:underline"
          >
            View all recipes →
          </Link>
        </div>
        <div className="flex gap-2.5 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {clips.map((d) => (
            <Link
              key={d.id}
              href={createRemixHref(d.preset, d.id)}
              onClick={() =>
                track({
                  event: "recipe_use",
                  path: "/",
                  recipe: d.preset,
                  meta: { surface: "home_viral_rail" },
                })
              }
              className="group relative w-[9.5rem] shrink-0 overflow-hidden rounded-2xl bg-neutral-900 ring-1 ring-white/10 transition hover:-translate-y-0.5 hover:ring-[#c8ff3d]/45 sm:w-[11rem]"
            >
              <div className="relative aspect-[3/4]">
                <AutoPlayVideo
                  poster={d.poster}
                  webm={d.webm}
                  mp4={d.mp4}
                  focusable={false}
                  className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent" />
                <span className="absolute left-2 top-2 rounded-full bg-black/55 px-1.5 py-0.5 text-[8px] font-bold uppercase text-[#c8ff3d]">
                  {d.eyebrow}
                </span>
                <div className="absolute inset-x-0 bottom-0 p-2.5">
                  <p className="text-[12px] font-bold leading-tight text-white">
                    {d.title}
                  </p>
                  <p className="mt-0.5 text-[10px] text-white/50">{d.character}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
