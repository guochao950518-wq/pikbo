import type { Metadata } from "next";
import Link from "next/link";
import { MODELS } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Models",
  description: "All image and video models available in the studio.",
};

export default function ModelsPage() {
  return (
    <div className="px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold">Models</h1>
        <p className="mt-2 max-w-2xl text-sm text-[var(--fg-muted)]">
          Multi-model shelf (Higgsfield pattern).{" "}
          <strong className="text-[var(--fg)]">Seedance</strong> is live via
          fal; other cards reserve slots so the product surface matches a full
          suite.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {MODELS.map((m) => (
            <Link
              key={m.id}
              href={m.href}
              className="card group overflow-hidden p-0 transition-transform hover:-translate-y-1"
            >
              <div className="relative h-28" style={{ background: m.gradient }}>
                {m.live && (
                  <span className="absolute left-2 top-2 rounded bg-black/50 px-2 py-0.5 text-[10px] font-bold text-[var(--lime)]">
                    LIVE
                  </span>
                )}
                {m.tag && !m.live && (
                  <span className="absolute left-2 top-2 rounded bg-black/50 px-2 py-0.5 text-[10px] font-bold text-white/70">
                    {m.tag}
                  </span>
                )}
              </div>
              <div className="p-4">
                <h2 className="font-semibold group-hover:text-[var(--lime)]">
                  {m.name}
                </h2>
                <p className="text-[11px] text-[var(--fg-dim)]">{m.vendor}</p>
                <p className="mt-2 text-xs text-[var(--fg-muted)]">{m.blurb}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
