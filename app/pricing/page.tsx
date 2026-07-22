import type { Metadata } from "next";
import Link from "next/link";
import { PLANS, CREDITS_PER_VIDEO } from "@/lib/pricing";
import { site } from "@/lib/site";
import { PricingCheckoutButton } from "@/components/PricingCheckoutButton";

export const metadata: Metadata = {
  title: "Pricing",
  description: `Simple credits for ${site.name}. Start free with watermarked clips, upgrade for HD and commercial use.`,
};

export default function PricingPage() {
  return (
    <div className="container-x py-16">
      <div className="mx-auto max-w-2xl text-center">
        <span className="chip mx-auto">Tool pricing</span>
        <h1 className="mt-4 text-4xl font-bold">Credits that pay for themselves</h1>
        <p className="mt-3 text-[var(--fg-muted)]">
          1 clip = {CREDITS_PER_VIDEO} credits. Free tier includes a small watermark.
          Paid plans unlock HD, commercial use, and more clips for sellers.
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

      <div className="mx-auto mt-14 max-w-2xl space-y-4 text-sm text-[var(--fg-muted)]">
        <h3 className="text-base font-semibold text-[var(--fg)]">FAQ</h3>
        <div className="card p-5">
          <p className="font-medium text-[var(--fg)]">What is a credit?</p>
          <p className="mt-1">
            Each generated clip costs {CREDITS_PER_VIDEO} credits. Failed generations
            are refunded automatically.
          </p>
        </div>
        <div className="card p-5">
          <p className="font-medium text-[var(--fg)]">Why a watermark on Free?</p>
          <p className="mt-1">
            Free clips use the cheaper model and carry a small {site.name} mark so
            we can keep the free tier alive. Creator and Shop remove it.
          </p>
        </div>
        <div className="card p-5">
          <p className="font-medium text-[var(--fg)]">Can I use clips commercially?</p>
          <p className="mt-1">
            Creator and Shop include commercial use for listings and ads of toys
            you own. Free is for personal / testing only.
          </p>
        </div>
      </div>
    </div>
  );
}
