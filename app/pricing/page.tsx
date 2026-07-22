import type { Metadata } from "next";
import Link from "next/link";
import { PLANS, CREDITS_PER_VIDEO } from "@/lib/pricing";
import { site } from "@/lib/site";
import { PricingCheckoutButton } from "@/components/PricingCheckoutButton";

export const metadata: Metadata = {
  title: "Pricing",
  description: `${site.name} credits & plans. Free watermarked clips; Creator & Shop for HD Seedance.`,
};

export default function PricingPage() {
  return (
    <div className="px-4 py-12 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <span className="chip mx-auto">Plans</span>
          <h1 className="mt-4 text-4xl font-bold">Credits for AI video</h1>
          <p className="mt-3 text-[var(--fg-muted)]">
            1 clip = {CREDITS_PER_VIDEO} credits. Free uses Seedance Fast +
            watermark. Paid unlocks Seedance 2.0 path, HD, commercial use.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`card relative flex flex-col p-6 ${
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
                <span className="text-4xl font-bold">${plan.priceMonthly}</span>
                <span className="mb-1 text-sm text-[var(--fg-dim)]">/mo</span>
              </div>
              <p className="mt-2 text-sm text-[var(--fg-muted)]">{plan.blurb}</p>
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
              ) : (
                <PricingCheckoutButton
                  planId={plan.id}
                  label={plan.cta}
                  featured={plan.featured}
                />
              )}
            </div>
          ))}
        </div>

        <div className="mx-auto mt-14 grid max-w-3xl gap-3 text-sm text-[var(--fg-muted)]">
          <h3 className="text-base font-semibold text-[var(--fg)]">FAQ</h3>
          {[
            {
              q: "What model do I get?",
              a: "Free → ByteDance Seedance Fast. Paid → Seedance 2.0 full path (via fal).",
            },
            {
              q: "What is a credit?",
              a: `Each generate costs ${CREDITS_PER_VIDEO} credits. Failures refund automatically.`,
            },
            {
              q: "Commercial use?",
              a: "Creator and Shop include commercial use for products/toys you own. Free is personal/testing.",
            },
          ].map((f) => (
            <div key={f.q} className="card p-5">
              <p className="font-medium text-[var(--fg)]">{f.q}</p>
              <p className="mt-1">{f.a}</p>
            </div>
          ))}
        </div>

        <p className="mt-10 text-center">
          <Link href="/create" className="text-sm text-[var(--mint)] hover:underline">
            ← Back to Generate
          </Link>
        </p>
      </div>
    </div>
  );
}
