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
    tag: "Flagship",
  },
  {
    href: "/flow",
    label: "Flow",
    blurb: "Media matrix · one tap",
    emoji: "◎",
    hot: true,
    tag: "Explore",
  },
  {
    href: "/modules",
    label: "Modules",
    blurb: "Listing · hook · unbox",
    emoji: "▦",
    hot: true,
    tag: "Jobs",
  },
  {
    href: "/create?mode=seller-pack",
    label: "Seller Pack",
    blurb: "3 clips · one photo",
    emoji: "🛍️",
    hot: true,
    tag: "Sell",
  },
  {
    href: "/effects",
    label: "Recipes",
    blurb: "Full preset wall",
    emoji: "🧸",
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
    <section className="border-b border-white/10 bg-gradient-to-b from-[#0c0c14] via-[#08080c] to-black px-3 py-8 sm:px-5">
      <div className="mx-auto max-w-6xl">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#c8ff3d]">
              {title}
            </p>
            <p className="mt-1 text-[12px] text-white/50">{subtitle}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/flow"
              className="text-[11px] font-semibold text-white/55 hover:text-white hover:underline"
            >
              Browse Flow
            </Link>
            <Link
              href="/create"
              className="text-[11px] font-semibold text-[#c8ff3d] hover:underline"
            >
              Open Generate →
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
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
              className={`group relative overflow-hidden rounded-2xl border px-3 py-3.5 transition duration-200 hover:-translate-y-0.5 ${
                "hot" in e && e.hot
                  ? "border-[#c8ff3d]/40 bg-[#c8ff3d]/[0.09] shadow-[0_0_32px_rgba(200,255,61,0.08)] hover:shadow-[0_0_40px_rgba(200,255,61,0.14)]"
                  : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]"
              }`}
            >
              <span
                className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c8ff3d]/50 to-transparent opacity-0 transition group-hover:opacity-100"
                aria-hidden
              />
              <div className="flex items-start justify-between gap-1">
                <span className="text-lg" aria-hidden>
                  {e.emoji}
                </span>
                {"tag" in e && e.tag ? (
                  <span className="rounded-full border border-white/12 bg-black/35 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white/45">
                    {e.tag}
                  </span>
                ) : null}
              </div>
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
