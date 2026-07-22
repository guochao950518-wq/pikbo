import type { Metadata } from "next";
import Link from "next/link";
import { LibraryGrid } from "@/components/LibraryGrid";

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
              Outputs from this device. Download, re-run, or open the tool page.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/create" className="btn btn-primary text-sm">
              New generate
            </Link>
            <Link href="/supercomputer" className="btn btn-ghost text-sm">
              Batch
            </Link>
          </div>
        </div>
        <LibraryGrid />
      </div>
    </div>
  );
}
