import { DEMO_VIDEOS } from "@/lib/demoVideos";

/** 哥飞 V2 — 结果展示块：精选 demo（SSR，爬虫可见文字） */
export function LandingResults({
  effectSlug,
  title = "Example results",
}: {
  effectSlug?: string;
  title?: string;
}) {
  const matched = effectSlug
    ? DEMO_VIDEOS.filter((d) => d.preset === effectSlug)
    : [];
  const demos =
    matched.length > 0
      ? matched
      : DEMO_VIDEOS.slice(0, 3);

  return (
    <section className="container-x py-12">
      <h2 className="text-2xl font-bold">{title}</h2>
      <p className="mt-2 max-w-2xl text-sm text-[var(--fg-muted)]">
        Official cached references for motion and framing. When this preset has no
        verified matching sample, the shared clips below are references — not
        outputs of this exact recipe or your upload.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {demos.map((d) => (
          <article
            key={d.id}
            className="card overflow-hidden p-0"
          >
            <div className="aspect-video bg-black/50">
              <video
                poster={d.poster}
                className="h-full w-full object-cover"
                muted
                loop
                playsInline
                preload="metadata"
                controls
              >
                <source src={d.webm} type="video/webm" />
                <source src={d.mp4} type="video/mp4" />
              </video>
            </div>
            <div className="p-3">
              <p className="text-sm font-semibold">{d.title}</p>
              <p className="mt-0.5 text-[10px] text-[var(--fg-dim)]">
                Official example · cached · {d.character}
              </p>
              <p className="mt-1 text-xs text-[var(--fg-muted)]">{d.result}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
