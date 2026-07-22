"use client";

import Link from "next/link";
import { useState } from "react";
import { PLANS, CREDITS_PER_VIDEO, clipsFromCredits } from "@/lib/pricing";
import { PricingCheckoutButton } from "@/components/PricingCheckoutButton";

export function PricingPlanCards({ annualEnabled }: { annualEnabled: boolean }) {
  const [annual, setAnnual] = useState(false);

  return (
    <>
      {annualEnabled ? (
      <div className="mb-8 flex justify-center">
        <div className="inline-flex rounded-full border border-[var(--border)] p-1 text-sm">
          <button
            type="button"
            onClick={() => setAnnual(false)}
            className={`rounded-full px-4 py-1.5 font-semibold ${
              !annual ? "bg-[var(--card)] text-[var(--fg)]" : "text-[var(--fg-dim)]"
            }`}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setAnnual(true)}
            className={`rounded-full px-4 py-1.5 font-semibold ${
              annual ? "bg-[var(--card)] text-[var(--fg)]" : "text-[var(--fg-dim)]"
            }`}
          >
            Annual{" "}
            <span className="text-[var(--mint)]">−20% preview</span>
          </button>
        </div>
      </div>
      ) : (
        <p className="mb-8 text-center text-xs text-[var(--fg-dim)]">
          Monthly billing is live. Annual checkout appears only after its Stripe prices are verified.
        </p>
      )}

      <div className="grid gap-5 md:grid-cols-3">
        {PLANS.map((plan) => {
          const price = annual
            ? Math.round(plan.priceMonthly * 0.8)
            : plan.priceMonthly;
          return (
            <div
              key={plan.id}
              id={`plan-${plan.id}`}
              className={`card relative flex scroll-mt-24 flex-col overflow-hidden p-6 ${
                plan.featured ? "ring-2 ring-[var(--brand)]" : ""
              }`}
            >
              {plan.featured && (
                <span
                  className="absolute -top-3 left-6 rounded-full px-3 py-1 text-xs font-semibold text-white"
                  style={{ background: "var(--grad)" }}
                >
                  Most popular
                </span>
              )}
              <h2 className="text-lg font-semibold">{plan.name}</h2>
              <div className="mt-2 flex items-end gap-1">
                <span className="text-4xl font-bold">${price}</span>
                <span className="mb-1 text-sm text-[var(--fg-dim)]">
                  /{annual && plan.priceMonthly > 0 ? "mo billed yearly" : "mo"}
                </span>
              </div>
              {annual && plan.priceMonthly > 0 && (
                <p className="text-xs text-[var(--mint)]">
                  ${Math.round(plan.priceMonthly * 12 * 0.8)}/yr · save 20%
                </p>
              )}
              <p className="mt-2 text-sm text-[var(--fg-muted)]">{plan.blurb}</p>
              <div className="mt-5 rounded-2xl border border-white/8 bg-black/20 p-4">
                <p className="text-3xl font-black">
                  ≈ {clipsFromCredits(plan.credits)} clips
                </p>
                <p className="mt-1 text-[10px] uppercase tracking-wider text-[var(--fg-dim)]">
                  at {CREDITS_PER_VIDEO} credits each
                </p>
              </div>
              <ul className="mt-5 flex-1 space-y-2 text-sm">
                {plan.perks.map((perk) => (
                  <li key={perk} className="flex items-start gap-2">
                    <span className="text-[var(--mint)]">✓</span>
                    <span className="text-[var(--fg-muted)]">{perk}</span>
                  </li>
                ))}
              </ul>
              {plan.id === "free" ? (
                <Link href="/create" className="btn btn-ghost mt-6 w-full">
                  {plan.cta}
                </Link>
              ) : annual ? (
                <div className="mt-6">
                  <button
                    type="button"
                    disabled
                    className="btn btn-ghost w-full cursor-not-allowed opacity-60"
                    title="Annual Stripe prices not wired yet"
                  >
                    Annual soon — switch to Monthly
                  </button>
                  <p className="mt-2 text-center text-[10px] text-[var(--fg-dim)]">
                    Checkout is monthly today. Annual billing ships with Stripe
                    yearly prices.
                  </p>
                </div>
              ) : (
                <PricingCheckoutButton
                  planId={plan.id}
                  label={plan.cta}
                  featured={plan.featured}
                  interval={annual ? "year" : "month"}
                />
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
