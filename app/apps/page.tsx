import type { Metadata } from "next";
import Link from "next/link";
import { APPS } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Apps",
  description:
    "Pikbo apps for toy video — configured workspaces are separated from roadmap tools, and provider-dependent output is labeled.",
  alternates: { canonical: "/apps" },
};

const CATS = [
  { id: "video" as const, label: "Video for your shelf" },
  { id: "image" as const, label: "Stills & packaging" },
  { id: "studio" as const, label: "Pro studio" },
  { id: "edit" as const, label: "Edit tools" },
];

export default function AppsPage() {
  const live = APPS.filter((a) => a.live);
  const soon = APPS.filter((a) => !a.live);

  return (
    <div className="px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <span className="chip">🧸 Suite · toy-native</span>
        <h1 className="mt-3 text-3xl font-bold">Apps</h1>
        <p className="mt-2 max-w-2xl text-sm text-[var(--fg-muted)]">
          Toy-native workspaces in one app grid.{" "}
          <strong className="text-[var(--mint)]">CONFIGURED</strong> opens an
          implemented workspace; provider-dependent output still needs its key ·{" "}
          <strong className="text-[var(--fg-dim)]">SOON</strong> is catalog only
          (not sold as live).
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link href="/create" className="btn btn-primary text-sm">
            Photo → Clip
          </Link>
          <Link href="/image" className="btn btn-ghost text-sm">
            Still studio
          </Link>
          <Link href="/supercomputer" className="btn btn-ghost text-sm">
            Batch
          </Link>
          <Link href="/pricing" className="btn btn-ghost text-sm">
            Pricing
          </Link>
        </div>

        <section className="mt-10">
          <h2 className="mb-4 text-xs font-bold uppercase tracking-wider text-[var(--mint)]">
            Configured · {live.length}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {live.map((app) => (
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
                    <h3 className="font-semibold group-hover:text-[var(--mint)]">
                      {app.name}
                    </h3>
                    <span className="rounded-full bg-[var(--mint)]/15 px-1.5 py-0.5 text-[9px] font-bold text-[var(--mint)]">
                      CONFIGURED
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-[var(--fg-muted)]">
                    {app.blurb}
                  </p>
                  <p className="mt-2 text-[10px] font-semibold text-[var(--mint)]">
                    Open →
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {CATS.map((cat) => {
          const items = soon.filter((a) => a.category === cat.id);
          if (items.length === 0) return null;
          return (
            <section key={cat.id} id="soon" className="mt-10 scroll-mt-24">
              <h2 className="mb-4 text-xs font-bold uppercase tracking-wider text-[var(--fg-dim)]">
                {cat.label} · soon
              </h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((app) => (
                  <div
                    key={app.id}
                    className="card flex gap-3 p-4 opacity-60"
                    aria-disabled
                  >
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-white/5 text-2xl">
                      {app.emoji}
                    </span>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold">{app.name}</h3>
                        <span className="rounded-full bg-white/10 px-1.5 py-0.5 text-[9px] font-bold text-[var(--fg-dim)]">
                          SOON
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-[var(--fg-muted)]">
                        {app.blurb}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
