import type { Metadata } from "next";
import Link from "next/link";
import { APPS } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Apps",
  description:
    "Pikbo apps for toy video — spin, unbox, cinema, stills. Photo to clip tools for collectors and sellers.",
};

const CATS = [
  { id: "video" as const, label: "Video for your shelf" },
  { id: "image" as const, label: "Stills & packaging" },
  { id: "edit" as const, label: "Edit tools" },
  { id: "studio" as const, label: "Pro studio" },
];

export default function AppsPage() {
  return (
    <div className="px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <span className="chip">🧸 Suite · toy-native</span>
        <h1 className="mt-3 text-3xl font-bold">Apps</h1>
        <p className="mt-2 max-w-2xl text-sm text-[var(--fg-muted)]">
          Same app-grid idea as big AI platforms — every tile is aimed at
          figures, blind boxes, and product clips.{" "}
          <strong className="text-[var(--fg)]">LIVE</strong> runs Seedance /
          Flux; <strong className="text-[var(--fg)]">SOON</strong> are suite
          stubs (not sold as live).
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link href="/create" className="btn btn-primary text-sm">
            Core: Image → Video
          </Link>
          <Link href="/image" className="btn btn-ghost text-sm">
            Still studio
          </Link>
          <Link href="/supercomputer" className="btn btn-ghost text-sm">
            Batch
          </Link>
        </div>

        {CATS.map((cat) => {
          const items = APPS.filter((a) => a.category === cat.id);
          return (
            <section key={cat.id} className="mt-10">
              <h2 className="mb-4 text-xs font-bold uppercase tracking-wider text-[var(--fg-dim)]">
                {cat.label}
              </h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((app) => (
                  <Link
                    key={app.id}
                    href={app.href}
                    className="card group flex gap-3 p-4 transition-transform hover:-translate-y-0.5"
                  >
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[var(--grad-soft)] text-2xl">
                      {app.emoji}
                    </span>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold group-hover:text-[var(--brand)]">
                          {app.name}
                        </h3>
                        {app.live ? (
                          <span className="rounded-full bg-[var(--mint)]/15 px-1.5 py-0.5 text-[9px] font-bold text-[var(--mint)]">
                            LIVE
                          </span>
                        ) : (
                          <span className="rounded-full bg-white/10 px-1.5 py-0.5 text-[9px] font-bold text-[var(--fg-dim)]">
                            SOON
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-xs text-[var(--fg-muted)]">
                        {app.blurb}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
