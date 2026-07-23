import type { Metadata } from "next";
import Link from "next/link";
import { MODELS } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Models · Preview",
  description:
    "AI model integrations in PIKBO — configured paths are separated from roadmap models and cached previews are labeled.",
  alternates: { canonical: "/models" },
  robots: { index: false, follow: false },
};

export default function ModelsPage() {
  const live = MODELS.filter((m) => m.live);
  const soon = MODELS.filter((m) => !m.live);

  return (
    <div className="px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <span className="chip">Engines</span>
        <h1 className="mt-3 text-3xl font-bold">Models</h1>
        <p className="mt-2 max-w-2xl text-sm text-[var(--fg-muted)]">
          Configured model shelf for the PIKBO workflow.{" "}
          <strong className="text-[var(--mint)]">WIRED</strong> cards open a
          workspace; live output still requires provider credentials.{" "}
          <strong className="text-[var(--fg)]">Seedance</strong> for motion ·{" "}
          <strong className="text-[var(--fg)]">Flux</strong> for stills. We
          don&apos;t fake Kling/Veo/Sora without keys.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link href="/create" className="btn btn-primary text-sm">
            Generate with Seedance →
          </Link>
          <Link href="/image" className="btn btn-ghost text-sm">
            Flux stills
          </Link>
          <Link href="/pricing" className="btn btn-ghost text-sm">
            Pricing
          </Link>
        </div>

        <h2 className="mt-10 mb-4 text-xs font-bold uppercase tracking-wider text-[var(--mint)]">
          Configured · {live.length}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {live.map((m) => (
            <Link
              key={m.id}
              href={m.href}
              className="card group overflow-hidden p-0 transition-transform hover:-translate-y-1"
            >
              <div className="relative h-28" style={{ background: m.gradient }}>
                <span className="absolute left-2 top-2 rounded-full bg-black/55 px-2 py-0.5 text-[10px] font-bold text-[var(--mint)]">
                  WIRED
                </span>
                {m.tag && (
                  <span className="absolute right-2 top-2 rounded-full bg-black/45 px-2 py-0.5 text-[10px] font-semibold text-white/80">
                    {m.tag}
                  </span>
                )}
              </div>
              <div className="p-4">
                <h2 className="font-semibold group-hover:text-[var(--mint)]">
                  {m.name}
                </h2>
                <p className="text-[11px] text-[var(--fg-dim)]">{m.vendor}</p>
                <p className="mt-2 text-xs text-[var(--fg-muted)]">{m.blurb}</p>
                <p className="mt-3 text-[10px] font-bold uppercase tracking-wide text-[var(--mint)]">
                  Open workspace →
                </p>
              </div>
            </Link>
          ))}
        </div>

        <h2
          id="soon"
          className="mt-12 mb-4 scroll-mt-24 text-xs font-bold uppercase tracking-wider text-[var(--fg-dim)]"
        >
          Roadmap · not sold as live
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {soon.map((m) => (
            <div
              key={m.id}
              className="card overflow-hidden p-0 opacity-65"
              aria-disabled
            >
              <div className="relative h-28" style={{ background: m.gradient }}>
                <span className="absolute left-2 top-2 rounded-full bg-black/55 px-2 py-0.5 text-[10px] font-bold text-white/75">
                  {m.tag ?? "Soon"}
                </span>
              </div>
              <div className="p-4">
                <h2 className="font-semibold">{m.name}</h2>
                <p className="text-[11px] text-[var(--fg-dim)]">{m.vendor}</p>
                <p className="mt-2 text-xs text-[var(--fg-muted)]">{m.blurb}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
