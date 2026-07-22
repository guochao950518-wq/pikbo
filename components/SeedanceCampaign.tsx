import Link from "next/link";
import { DEMO_VIDEOS } from "@/lib/demoVideos";

/**
 * Flagship model campaign strip — HF Seedance-battle pattern.
 * Honest: only Seedance live on Pikbo free path.
 */
export function SeedanceCampaign() {
  const hero = DEMO_VIDEOS[0];
  const strip = DEMO_VIDEOS.slice(0, 5);

  return (
    <section className="relative overflow-hidden border-b border-[var(--border)]">
      <div className="absolute inset-0">
        <video
          className="h-full w-full object-cover opacity-50"
          autoPlay
          muted
          loop
          playsInline
          poster={hero.poster}
        >
          <source src={hero.webm} type="video/webm" />
          <source src={hero.mp4} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg)] via-[var(--bg)]/85 to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-transparent to-black/30" />
      </div>

      <div className="relative grid gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:py-14">
        <div>
          <p className="section-label text-[var(--mint)]">Flagship · live now</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Seedance
            <span className="text-[var(--mint)]"> on Pikbo</span>
          </h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-white/70 sm:text-base">
            ByteDance motion for designer toys — figure-safe i2v, free
            watermarked tries, paid for clean exports. Same engine class the
            big suites push; niche for your shelf.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <Link href="/create" className="btn btn-primary px-6 py-3 text-sm">
              Try Seedance free
            </Link>
            <Link
              href="/models"
              className="btn btn-ghost border-white/15 px-5 py-3 text-sm"
            >
              Model details
            </Link>
            <Link
              href="/community"
              className="btn btn-ghost border-white/15 px-5 py-3 text-sm"
            >
              Seedance clips
            </Link>
          </div>
          <p className="mt-3 text-[11px] text-[var(--fg-dim)]">
            Live · fal Seedance Fast / 2.0 · no fake multi-model on free tier
          </p>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 lg:justify-end">
          {strip.map((d) => (
            <Link
              key={d.id}
              href={`/create?effect=${encodeURIComponent(d.preset)}`}
              className="relative h-36 w-24 shrink-0 overflow-hidden rounded-xl border border-white/15 sm:h-44 sm:w-28"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={d.poster}
                alt=""
                className="h-full w-full object-cover"
              />
              <span className="absolute inset-x-0 bottom-0 bg-black/70 px-1.5 py-1 text-center text-[9px] font-bold uppercase tracking-wide text-white/90">
                Remake
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
