"use client";

import Link from "next/link";
import { track } from "@/lib/analytics";

/**
 * Toy suite entry rail — HF Generate + Yiha modules pattern, verticalized.
 * Used on Home after premiere so users hit real product doors, not model zoo.
 */
const ENTRIES = [
  {
    href: "/create",
    label: "Generate",
    blurb: "Photo → clip workbench",
    emoji: "✦",
    hot: true,
  },
  {
    href: "/modules",
    label: "Modules",
    blurb: "Listing · hook · unbox",
    emoji: "▦",
    hot: true,
  },
  {
    href: "/create?mode=seller-pack",
    label: "Seller Pack",
    blurb: "3 clips · one photo",
    emoji: "🛍️",
    hot: true,
  },
  {
    href: "/effects",
    label: "Recipes",
    blurb: "Full preset wall",
    emoji: "🧸",
  },
  {
    href: "/library",
    label: "Library",
    blurb: "This device",
    emoji: "▢",
  },
  {
    href: "/create?try=1&sample=scout",
    label: "Try free",
    blurb: "Lab still · 10s",
    emoji: "▶",
  },
] as const;

export function SuiteEntryStrip({
  title = "Toy creative suite",
  subtitle = "Generate workbench + modular jobs — not a multi-model zoo",
}: {
  title?: string;
  subtitle?: string;
}) {
  return (
    <section className="border-b border-white/10 bg-gradient-to-b from-[#0c0c12] to-black px-3 py-6 sm:px-5">
      <div className="mx-auto max-w-6xl">
        <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#c8ff3d]/90">
              {title}
            </p>
            <p className="mt-0.5 text-[11px] text-white/45">{subtitle}</p>
          </div>
          <Link
            href="/create"
            className="text-[11px] font-semibold text-[#c8ff3d] hover:underline"
          >
            Open Generate →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
          {ENTRIES.map((e) => (
            <Link
              key={e.href + e.label}
              href={e.href}
              onClick={() =>
                track({
                  event: "landing_view",
                  path: "/",
                  meta: { cta: "suite_entry", label: e.label },
                })
              }
              className={`rounded-2xl border px-3 py-3 transition hover:-translate-y-0.5 ${
                "hot" in e && e.hot
                  ? "border-[#c8ff3d]/35 bg-[#c8ff3d]/[0.08]"
                  : "border-white/10 bg-white/[0.03] hover:border-white/20"
              }`}
            >
              <span className="text-lg" aria-hidden>
                {e.emoji}
              </span>
              <span className="mt-1.5 block text-[13px] font-bold text-white">
                {e.label}
              </span>
              <span className="mt-0.5 block text-[10px] leading-snug text-white/45">
                {e.blurb}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
