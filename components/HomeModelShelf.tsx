"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { MODELS, type CatalogModel } from "@/lib/catalog";
import { DEMO_VIDEOS, type DemoVideo } from "@/lib/demoVideos";

const MODEL_DEMOS: Record<string, DemoVideo | undefined> = {
  "seedance-2": DEMO_VIDEOS[0],
  "seedance-fast": DEMO_VIDEOS[1],
};

function ModelCard({ model }: { model: CatalogModel }) {
  const demo = MODEL_DEMOS[model.id];
  const videoRef = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  const play = () => {
    if (!reducedMotion) videoRef.current?.play().catch(() => undefined);
  };
  const pause = () => videoRef.current?.pause();

  return (
    <article
      className="group min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-[#111016] transition duration-300 hover:-translate-y-1 hover:border-white/25"
      onMouseEnter={play}
      onMouseLeave={pause}
      onFocus={play}
      onBlur={pause}
    >
      <Link href={model.href} className="block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--lime)]">
        <div className="relative aspect-[16/10] overflow-hidden bg-black">
          {demo && !failed ? (
             
            <video
              ref={videoRef}
              muted
              loop
              playsInline
              preload="metadata"
              poster={demo.poster}
              onError={() => setFailed(true)}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.025]"
            >
              <source src={demo.webm} type="video/webm" />
              <source src={demo.mp4} type="video/mp4" />
            </video>
          ) : (
            <div className="grid h-full place-items-center" style={{ background: model.gradient }}>
              <span className="text-5xl font-black text-white/70">{model.name.slice(0, 1)}</span>
            </div>
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/5 to-transparent" />
          <div className="absolute left-3 top-3 flex gap-2">
            <span className={`rounded-full px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.14em] ${model.live ? "bg-[var(--lime)] text-black" : "bg-black/55 text-white/65 backdrop-blur"}`}>
              {model.live ? "Live" : "Roadmap"}
            </span>
            {demo && (
              <span className="rounded-full border border-white/15 bg-black/50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-white/70 backdrop-blur">
                Cached preview
              </span>
            )}
          </div>
          <div className="absolute inset-x-0 bottom-0 p-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/55">{model.vendor}</p>
            <h3 className="mt-1 text-xl font-bold text-white">{model.name}</h3>
          </div>
        </div>
        <div className="flex min-h-[104px] items-end justify-between gap-3 p-4">
          <div>
            <p className="text-sm leading-5 text-[var(--fg-muted)]">{model.blurb}</p>
            <p className="mt-2 text-[10px] text-[var(--fg-dim)]">
              {model.live ? "Image → toy motion" : "Visible now so teams can plan the stack"}
            </p>
          </div>
          <span className="shrink-0 text-sm font-bold text-[var(--lime)]">{model.live ? "Use →" : "View →"}</span>
        </div>
      </Link>
    </article>
  );
}

export function HomeModelShelf() {
  const models = MODELS.filter((model) => model.kind === "video").slice(0, 4);

  return (
    <section id="models" className="scroll-mt-20 border-b border-[var(--border)] px-4 py-12 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--lime)]">Model shelf</p>
            <h2 className="mt-2 text-2xl font-bold">Video engines for toy content</h2>
            <p className="mt-1 max-w-xl text-sm text-[var(--fg-muted)]">
              Two live Seedance paths today. Future engines stay clearly marked until they are actually wired.
            </p>
          </div>
          <Link href="/models" className="text-sm font-semibold text-[var(--lime)] hover:text-white">
            Compare models →
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {models.map((model) => (
            <ModelCard key={model.id} model={model} />
          ))}
        </div>
      </div>
    </section>
  );
}
