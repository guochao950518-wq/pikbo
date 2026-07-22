import type { Metadata } from "next";
import Link from "next/link";
import { BatchStudio } from "@/components/BatchStudio";

export const metadata: Metadata = {
  title: "Batch agent",
  description:
    "Run multiple toy video presets from one photo — Pikbo batch generate for shops.",
};

export default function SupercomputerPage() {
  return (
    <div className="px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <span className="chip">🧠 Batch agent</span>
        <h1 className="mt-3 text-3xl font-bold">One photo · many clips</h1>
        <p className="mt-2 max-w-2xl text-sm text-[var(--fg-muted)]">
          Shop workflow: upload a figure once, queue spin / float / unbox /
          glam, render with Seedance. Same idea as suite “agents” — focused on
          seller batches.
        </p>
        <p className="mt-2 text-xs text-[var(--fg-dim)]">
          Need a single careful shot?{" "}
          <Link href="/create" className="text-[var(--brand)] hover:underline">
            Open Generate
          </Link>{" "}
          or{" "}
          <Link href="/cinema" className="text-[var(--brand)] hover:underline">
            Cinema Studio
          </Link>
          .
        </p>
        <BatchStudio />
      </div>
    </div>
  );
}
