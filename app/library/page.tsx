import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Library",
  description: "Your generated videos and assets.",
};

export default function LibraryPage() {
  return (
    <div className="px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">Library</h1>
            <p className="mt-1 text-sm text-[var(--fg-muted)]">
              Past generations (local session for now — Supabase later).
            </p>
          </div>
          <Link href="/create" className="btn btn-primary text-sm">
            New generate
          </Link>
        </div>

        <div className="mt-10 grid place-items-center rounded-2xl border border-dashed border-[var(--border)] bg-[var(--bg-soft)] py-24 text-center">
          <p className="text-[var(--fg-muted)]">No clips saved yet</p>
          <p className="mt-2 max-w-sm text-xs text-[var(--fg-dim)]">
            Higgsfield-class apps show a grid of outputs here. Wire persistence
            after auth; for now generate from the studio.
          </p>
          <Link href="/create" className="btn btn-ghost mt-6 text-sm">
            Go to Generate
          </Link>
        </div>
      </div>
    </div>
  );
}
