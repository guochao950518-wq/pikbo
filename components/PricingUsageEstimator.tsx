"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CREDITS_PER_VIDEO, PLANS } from "@/lib/pricing";

const QUICK_COUNTS = [3, 30, 100];

export function PricingUsageEstimator() {
  const [clips, setClips] = useState(30);
  const recommendation = useMemo(() => {
    if (clips <= 3) return PLANS[0];
    if (clips <= 50) return PLANS[1];
    return PLANS[2];
  }, [clips]);
  const includedClips = Math.floor(recommendation.credits / CREDITS_PER_VIDEO);
  const perClip = recommendation.priceMonthly > 0
    ? recommendation.priceMonthly / includedClips
    : 0;

  return (
    <section className="overflow-hidden rounded-3xl border border-white/10 bg-[#111016] shadow-[0_30px_80px_-45px_rgba(168,85,247,.65)]">
      <div className="grid lg:grid-cols-[1.25fr_.75fr]">
        <div className="p-6 sm:p-8">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--mint)]">Usage estimator</p>
          <div className="mt-3 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-2xl font-bold">How many clips do you publish?</h2>
              <p className="mt-1 text-sm text-[var(--fg-muted)]">Slide to your real monthly output. Every plan has a finite credit allowance.</p>
            </div>
            <p className="text-4xl font-black text-white">
              {clips}<span className="ml-2 text-sm font-medium text-[var(--fg-dim)]">clips / month</span>
            </p>
          </div>

          <input
            aria-label="Monthly video clip estimate"
            type="range"
            min="1"
            max="150"
            step="1"
            value={clips}
            onChange={(event) => setClips(Number(event.target.value))}
            className="mt-8 h-2 w-full cursor-pointer accent-[var(--brand)]"
          />
          <div className="mt-2 flex justify-between text-[10px] font-bold uppercase tracking-wider text-[var(--fg-dim)]">
            <span>1</span><span>50</span><span>100</span><span>150</span>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {QUICK_COUNTS.map((count) => (
              <button
                key={count}
                type="button"
                onClick={() => setClips(count)}
                className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${clips === count ? "border-[var(--mint)] bg-[var(--mint)] text-black" : "border-white/10 bg-white/[.04] text-[var(--fg-muted)] hover:border-white/25 hover:text-white"}`}
              >
                {count === 3 ? "Try 3" : count === 30 ? "Post daily" : "Run a shop"}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col justify-between border-t border-white/10 bg-[radial-gradient(circle_at_90%_0%,rgba(110,231,199,.16),transparent_55%)] p-6 sm:p-8 lg:border-l lg:border-t-0">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--fg-dim)]">Recommended</p>
            <div className="mt-3 flex items-end justify-between gap-3">
              <h3 className="text-3xl font-black">{recommendation.name}</h3>
              <p className="text-xl font-bold">${recommendation.priceMonthly}<span className="text-xs font-normal text-[var(--fg-dim)]"> / mo</span></p>
            </div>
            <p className="mt-3 text-sm leading-6 text-[var(--fg-muted)]">
              {includedClips} included clips at the current {CREDITS_PER_VIDEO}-credit estimate.
              {recommendation.id === "shop" ? " Batch tools are included for larger drops." : ""}
            </p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/8 bg-black/20 p-3">
                <p className="text-[10px] uppercase tracking-wider text-[var(--fg-dim)]">Credits</p>
                <p className="mt-1 text-xl font-bold">{recommendation.credits.toLocaleString()}</p>
              </div>
              <div className="rounded-2xl border border-white/8 bg-black/20 p-3">
                <p className="text-[10px] uppercase tracking-wider text-[var(--fg-dim)]">Included rate</p>
                <p className="mt-1 text-xl font-bold">{perClip ? `$${perClip.toFixed(2)}` : "$0"}<span className="text-[10px] font-normal text-[var(--fg-dim)]"> / clip</span></p>
              </div>
            </div>
          </div>
          <Link href={`#plan-${recommendation.id}`} className="btn btn-primary mt-6 w-full text-sm">
            See {recommendation.name} details ↓
          </Link>
        </div>
      </div>
    </section>
  );
}
