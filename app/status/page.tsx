import type { Metadata } from "next";
import Link from "next/link";
import { StatusProbe } from "@/components/StatusProbe";

export const metadata: Metadata = {
  title: "System status",
  description: "Pikbo soft-launch readiness (no secrets).",
  robots: { index: false, follow: false },
};

export default function StatusPage() {
  return (
    <main className="mx-auto max-w-lg px-4 py-12">
      <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--fg-dim)]">
        Ops
      </p>
      <h1 className="mt-2 font-display text-3xl font-black uppercase tracking-tight">
        System status
      </h1>
      <p className="mt-2 text-sm text-[var(--fg-muted)]">
        Live probe of{" "}
        <code className="text-[var(--mint)]">/api/health</code> — no secrets
        shown. Launch gates: docs/prd/GO_NO_GO.md.
      </p>
      <StatusProbe />
      <div className="mt-8 flex flex-wrap gap-3 text-sm">
        <Link href="/create" className="text-[var(--mint)] hover:underline">
          Create →
        </Link>
        <Link href="/login" className="text-[var(--fg-muted)] hover:text-white">
          Sign in
        </Link>
        <Link href="/" className="text-[var(--fg-muted)] hover:text-white">
          Home
        </Link>
      </div>
    </main>
  );
}
