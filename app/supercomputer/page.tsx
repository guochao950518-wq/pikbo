import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { BatchStudio } from "@/components/BatchStudio";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ pack?: string; effects?: string }>;
}): Promise<Metadata> {
  const sp = await searchParams;
  if (sp.pack === "seller") {
    // Legacy entry — still resolve metadata before redirect.
    return {
      title: "Seller Pack · 3 outputs",
      description:
        "One owned toy photo → listing spin, blind-box reveal, and social hook. Marketplace seller workflow on Pikbo.",
    };
  }
  return {
    title: "Batch agent",
    description:
      "Run multiple toy video presets from one photo — Pikbo batch generate for shops.",
  };
}

export default async function SupercomputerPage({
  searchParams,
}: {
  searchParams: Promise<{ effects?: string; pack?: string }>;
}) {
  const sp = await searchParams;
  // Wave A: Seller Pack canonical is /create?mode=seller-pack
  if (sp.pack === "seller") {
    redirect("/create?mode=seller-pack");
  }
  const initialEffects = sp.effects
    ? sp.effects.split(",").map((s) => s.trim()).filter(Boolean)
    : undefined;

  return (
    <div className="px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <span className="chip">🧠 Batch agent · Preview</span>
        <h1 className="mt-3 text-3xl font-bold">One photo · many clips</h1>
        <p className="mt-2 max-w-2xl text-sm text-[var(--fg-muted)]">
          Shop workflow: upload a figure once, queue effects, render with
          Seedance. For the fixed three-format seller path use Seller Pack.
        </p>
        <p className="mt-2 text-xs text-[var(--fg-dim)]">
          Need a single careful shot?{" "}
          <Link href="/create" className="text-[var(--brand)] hover:underline">
            Open Generate
          </Link>
          {" · "}
          <Link
            href="/create?mode=seller-pack"
            className="text-[var(--mint)] hover:underline"
          >
            Seller Pack
          </Link>
        </p>
        <BatchStudio initialEffects={initialEffects} />
      </div>
    </div>
  );
}
