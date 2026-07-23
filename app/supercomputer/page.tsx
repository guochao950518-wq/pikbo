import type { Metadata } from "next";
import Link from "next/link";
import { BatchStudio } from "@/components/BatchStudio";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ pack?: string; effects?: string }>;
}): Promise<Metadata> {
  const sp = await searchParams;
  if (sp.pack === "seller") {
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
  const isSeller = sp.pack === "seller";
  const initialEffects = sp.effects
    ? sp.effects.split(",").map((s) => s.trim()).filter(Boolean)
    : undefined;

  return (
    <div className="px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <span className="chip">
          {isSeller ? "Seller Pack · MVP" : "🧠 Batch agent"}
        </span>
        <h1 className="mt-3 text-3xl font-bold">
          {isSeller
            ? "One photo · three seller formats"
            : "One photo · many clips"}
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-[var(--fg-muted)]">
          {isSeller ? (
            <>
              Listing Spin (1:1), Blind-box Reveal (9:16), Social Flash (9:16).
              Cached demos free and labeled. Live path charges per successful
              child; failed jobs refund credits. Not a full Seller OS yet —
              thin MVP entry.
            </>
          ) : (
            <>
              Shop workflow: upload a figure once, queue effects, render with
              Seedance. Seller Pack (3 outputs) built in.
            </>
          )}
        </p>
        <p className="mt-2 text-xs text-[var(--fg-dim)]">
          Need a single careful shot?{" "}
          <Link href="/create" className="text-[var(--brand)] hover:underline">
            Open Generate
          </Link>
          {!isSeller && (
            <>
              {" · "}
              <Link
                href="/supercomputer?pack=seller"
                className="text-[var(--mint)] hover:underline"
              >
                Seller Pack
              </Link>
            </>
          )}
        </p>
        <BatchStudio
          initialEffects={initialEffects}
          pack={isSeller ? "seller" : undefined}
        />
      </div>
    </div>
  );
}
