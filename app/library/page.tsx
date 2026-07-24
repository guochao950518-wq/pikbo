import type { Metadata } from "next";
import Link from "next/link";
import { LibraryGrid } from "@/components/LibraryGrid";

export const metadata: Metadata = {
  title: "Assets · Local Library",
  description:
    "Device-local clips and toy SKU groups — remake, download, or open Generate. Not cloud-synced until durable sign-in.",
  robots: { index: false, follow: false },
};

/**
 * HF Library / Assets pattern — local soft-launch stand-in.
 * Group by project or SKU; never claim multi-device sync.
 */
export default function LibraryPage() {
  return (
    <div className="px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--mint)]">
              Assets · this device
            </p>
            <h1 className="mt-1 text-2xl font-bold">Local Library</h1>
            <p className="mt-1 max-w-2xl text-sm text-[var(--fg-muted)]">
              Higgsfield Library pattern, soft-launch: clips stay in{" "}
              <span className="font-semibold text-[var(--mint)]">
                this browser only
              </span>
              . Group by project or Toy Identity SKU · remake into Generate · not
              cloud-synced yet.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/create" className="btn btn-primary text-sm">
              Generate
            </Link>
            <Link href="/modules" className="btn btn-ghost text-sm">
              Modules
            </Link>
            <Link
              href="/create?mode=seller-pack"
              className="btn btn-ghost text-sm"
            >
              Seller Pack
            </Link>
            <Link href="/flow" className="btn btn-ghost text-sm">
              Flow
            </Link>
          </div>
        </div>
        <LibraryGrid />
      </div>
    </div>
  );
}
