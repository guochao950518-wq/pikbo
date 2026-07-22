import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Supercomputer",
  description: "Agent automation surface for creative workflows.",
};

export default function SupercomputerPage() {
  return (
    <div className="px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--lime)]">
          Supercomputer
        </p>
        <h1 className="mt-1 text-3xl font-bold">Agents & automation</h1>
        <p className="mt-3 text-sm text-[var(--fg-muted)]">
          Large platforms ship an agent layer (skills, multi-step jobs, free
          modes). This page reserves that product surface. For now use Generate
          + Cinema + Apps.
        </p>
        <div className="card mt-8 space-y-3 p-6 text-sm text-[var(--fg-muted)]">
          <p>· Batch listing videos for a whole shop</p>
          <p>· Auto storyboard → multi-shot render</p>
          <p>· Scheduled social exports</p>
          <Link href="/create" className="btn btn-primary mt-4 inline-flex text-sm">
            Use Generate for now
          </Link>
        </div>
      </div>
    </div>
  );
}
