import type { Metadata } from "next";
import Link from "next/link";
import { APPS } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Apps",
  description: "One-click AI apps — video, image, edit, and studio tools.",
};

const CATS = [
  { id: "video" as const, label: "Video" },
  { id: "image" as const, label: "Image" },
  { id: "edit" as const, label: "Edit" },
  { id: "studio" as const, label: "Studio" },
];

export default function AppsPage() {
  return (
    <div className="px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold">Apps</h1>
        <p className="mt-2 text-sm text-[var(--fg-muted)]">
          Same surface as big AI suites: open an app, run a job, spend credits.
          Live apps call Seedance; stubs keep the catalog complete.
        </p>

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
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-white/5 text-2xl">
                      {app.emoji}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold group-hover:text-[var(--lime)]">
                          {app.name}
                        </h3>
                        {app.live ? (
                          <span className="rounded bg-[var(--lime)]/20 px-1.5 py-0.5 text-[9px] font-bold text-[var(--lime)]">
                            LIVE
                          </span>
                        ) : (
                          <span className="rounded bg-white/10 px-1.5 py-0.5 text-[9px] font-bold text-white/40">
                            STUB
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
