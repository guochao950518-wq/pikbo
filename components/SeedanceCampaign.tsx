import Link from "next/link";
import { DEMO_VIDEOS } from "@/lib/demoVideos";
import { AutoPlayVideo } from "@/components/AutoPlayVideo";

/** Full-bleed flagship banner — HF Seedance battle pattern */
export function SeedanceCampaign() {
  const hero = DEMO_VIDEOS[0];
  const strip = DEMO_VIDEOS;

  return (
    <section className="relative my-2 overflow-hidden border-y border-white/[0.06]">
      <div className="absolute inset-0">
        <AutoPlayVideo
          poster={hero.poster}
          webm={hero.webm}
          mp4={hero.mp4}
          eager
          className="h-full w-full object-cover opacity-55"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />
      </div>

      <div className="relative grid gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:py-16">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--mint)]">
            Now on Pikbo
          </p>
          <h2 className="mt-2 text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
            Seedance
            <span className="block text-[var(--mint)]">for toys</span>
          </h2>
          <p className="mt-2 text-sm font-semibold uppercase tracking-[0.18em] text-white/50">
            Cached showcase · Mini live trial when configured
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/create"
              className="rounded-full bg-[var(--mint)] px-7 py-3 text-sm font-black text-black"
            >
              Try Mini
            </Link>
            <Link
              href="/community"
              className="rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur"
            >
              Open PIKBO Lab
            </Link>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 lg:justify-end [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {strip.map((d) => (
            <Link
              key={d.id}
              href={`/create?effect=${encodeURIComponent(d.preset)}`}
              className="relative h-40 w-24 shrink-0 overflow-hidden rounded-xl border border-white/10 sm:h-48 sm:w-28"
            >
              <AutoPlayVideo
                poster={d.poster}
                webm={d.webm}
                mp4={d.mp4}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <span className="absolute inset-x-0 bottom-0 bg-black/70 px-1 py-1 text-center text-[9px] font-bold uppercase text-white">
                Try recipe
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
