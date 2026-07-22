import type { Metadata } from "next";
import { PLANS, CREDITS_PER_VIDEO, clipsFromCredits } from "@/lib/pricing";
import { site } from "@/lib/site";
import { PricingUsageEstimator } from "@/components/PricingUsageEstimator";
import { PricingPlanCards } from "@/components/PricingPlanCards";

export const metadata: Metadata = {
  title: "Pricing",
  description: `Simple credits for ${site.name}. Start free (Seedance Fast 480p), upgrade for 720p Seedance 2.0 and commercial use.`,
};

export default function PricingPage() {
  return (
    <div className="pb-20">
      <section className="glow-bg overflow-hidden border-b border-[var(--border)]">
        <div className="container-x relative z-10 py-16 text-center sm:py-24">
          <span className="chip mx-auto">Clear pricing</span>
          <h1 className="mx-auto mt-5 max-w-4xl text-5xl font-black leading-[.98] tracking-[-0.04em] sm:text-7xl">
            Start with three clips.
            <br />
            Scale to a <span className="text-grad">content engine.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-[var(--fg-muted)] sm:text-lg">
            Free lets you test your own toy photo. Creator removes the watermark
            for regular posting. Shop adds volume and batch workflow sellers need.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-[var(--fg-dim)]">
            <span>✓ No card for Free</span>
            <span>✓ Failed generations refund credits</span>
            <span>✓ Paid plans include commercial use</span>
          </div>
        </div>
      </section>

      <div className="container-x py-12 sm:py-16">
        <PricingUsageEstimator />

        <div className="mt-16">
          <PricingPlanCards />
        </div>

        <section className="mt-20">
          <div className="mb-6">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--mint)]">
              Compare plans
            </p>
            <h2 className="mt-2 text-3xl font-bold">
              Pay for output, not vague access
            </h2>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead className="bg-white/[.045]">
                <tr>
                  <th className="p-4 font-medium text-[var(--fg-dim)]">
                    Capability
                  </th>
                  {PLANS.map((plan) => (
                    <th key={plan.id} className="p-4 text-base font-bold">
                      {plan.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/8 text-[var(--fg-muted)]">
                {[
                  [
                    "Monthly credits",
                    ...PLANS.map((plan) => plan.credits.toLocaleString()),
                  ],
                  [
                    "Approx. clips",
                    ...PLANS.map((plan) => String(clipsFromCredits(plan.credits))),
                  ],
                  ["Resolution", ...PLANS.map((plan) => plan.resolution)],
                  [
                    "Watermark-free",
                    ...PLANS.map((plan) => (plan.watermark ? "—" : "✓")),
                  ],
                  [
                    "Commercial use",
                    ...PLANS.map((plan) => (plan.commercial ? "✓" : "—")),
                  ],
                  [
                    "Priority queue",
                    ...PLANS.map((plan) => (plan.priority ? "✓" : "—")),
                  ],
                  ["Batch workflow", "—", "—", "✓"],
                ].map(([label, ...values]) => (
                  <tr key={label}>
                    <th className="p-4 font-medium text-[var(--fg)]">{label}</th>
                    {values.map((value, index) => (
                      <td key={`${label}-${PLANS[index].id}`} className="p-4">
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mx-auto mt-20 max-w-3xl">
          <h2 className="text-3xl font-bold">
            Pricing questions, answered plainly
          </h2>
          <div className="mt-6 space-y-3 text-sm text-[var(--fg-muted)]">
            {[
              [
                "What is a credit?",
                `Each generated clip currently costs ${CREDITS_PER_VIDEO} credits. Failed generations are refunded automatically.`,
              ],
              [
                "Why is Free watermarked?",
                `Free uses Seedance Fast (480p) with a ${site.name} mark on the in-app player. Creator and Shop remove it. File burn-in watermark is coming next.`,
              ],
              [
                "Can I use clips commercially?",
                "Creator and Shop include commercial use for listings and ads of toys you own. Free is for personal testing.",
              ],
              [
                "Is any plan unlimited?",
                "No. Video models have a real per-generation cost, so every plan shows a finite credit allowance.",
              ],
              [
                "When should I choose Shop?",
                "Choose Shop for regular product drops, multiple listings, or the batch workspace.",
              ],
            ].map(([question, answer]) => (
              <details
                key={question}
                className="group rounded-2xl border border-white/10 bg-[var(--card)] p-5 open:border-white/20"
              >
                <summary className="cursor-pointer list-none font-semibold text-[var(--fg)]">
                  {question}
                  <span className="float-right text-[var(--mint)] group-open:rotate-45">
                    ＋
                  </span>
                </summary>
                <p className="mt-3 leading-6">{answer}</p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
