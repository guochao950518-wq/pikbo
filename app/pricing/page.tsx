import type { Metadata } from "next";
import Link from "next/link";
import { PLANS, CREDITS_PER_VIDEO, clipsFromCredits } from "@/lib/pricing";
import { site } from "@/lib/site";
import { PricingUsageEstimator } from "@/components/PricingUsageEstimator";
import { PricingPlanCards } from "@/components/PricingPlanCards";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Pricing",
  description: `Simple credits for ${site.name}. Start free (Seedance Fast 480p), upgrade for 720p Seedance 2.0 and commercial use.`,
};

export default function PricingPage() {
  return (
    <div className="pb-24">
      <section className="glow-bg overflow-hidden border-b border-[var(--border)]">
        <div className="container-x relative z-10 py-14 text-center sm:py-20">
          <Badge variant="live" className="mx-auto normal-case tracking-wider">
            Clear credit limits · no unlimited claim
          </Badge>
          <h1 className="mx-auto mt-5 max-w-4xl text-4xl font-black leading-[1.02] tracking-[-0.04em] sm:text-6xl lg:text-7xl">
            Start with one free trial.
            <br />
            Scale to a <span className="text-grad">content engine.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-[var(--fg-muted)] sm:text-lg">
            Free = one watermarked Seedance Fast trial (plus unlimited cached
            demos). Creator ~5 real clips / Shop ~15 at current credit rates —
            priced for model cost, not fake volume.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            <Button asChild size="lg">
              <Link href="/create">Try free — no card</Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link href="#plans">See plans</Link>
            </Button>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-[var(--fg-dim)]">
            <span>✓ No card for Free</span>
            <span>✓ Failed gens refund credits</span>
            <span>✓ Paid = commercial use</span>
          </div>
        </div>
      </section>

      <div className="container-x py-12 sm:py-16">
        <PricingUsageEstimator />

        <div id="plans" className="mt-16 scroll-mt-24">
          <div className="mb-8 text-center">
            <p className="section-label">Plans</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
              Pick the output level you need
            </h2>
          </div>
          <PricingPlanCards />
        </div>

        <Separator className="my-16" />

        <section>
          <div className="mb-6">
            <p className="section-label">Compare</p>
            <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
              Pay for output, not vague access
            </h2>
          </div>
          <Card className="overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px] text-left text-sm">
                <thead className="bg-white/[0.04]">
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
                <tbody className="divide-y divide-white/[0.06] text-[var(--fg-muted)]">
                  {[
                    [
                      "Monthly credits",
                      ...PLANS.map((plan) => plan.credits.toLocaleString()),
                    ],
                    [
                      "Approx. clips",
                      ...PLANS.map((plan) =>
                        String(clipsFromCredits(plan.credits))
                      ),
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
                    <tr key={label} className="hover:bg-white/[0.02]">
                      <th className="p-4 font-medium text-[var(--fg)]">
                        {label}
                      </th>
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
          </Card>
        </section>

        <section className="mx-auto mt-20 max-w-3xl">
          <p className="section-label">FAQ</p>
          <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
            Pricing questions, answered plainly
          </h2>
          <div className="mt-6 space-y-3">
            {[
              [
                "What is a credit?",
                `Each generated clip currently costs ${CREDITS_PER_VIDEO} credits. Failed generations are refunded automatically.`,
              ],
              [
                "Why is Free watermarked?",
                `When provider access is configured, Free uses Seedance Fast (480p) with a ${site.name} mark on the in-app player. Demo mode returns a labeled sample. Creator and Shop remove the player mark; file burn-in watermark is coming next.`,
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
              <Card key={question} className="overflow-hidden">
                <details className="group">
                  <summary className="cursor-pointer list-none p-5 font-semibold text-[var(--fg)] marker:content-none">
                    {question}
                    <span className="float-right text-[var(--mint)] transition group-open:rotate-45">
                      ＋
                    </span>
                  </summary>
                  <CardContent className="border-t border-[var(--border)] pt-4 text-sm leading-6 text-[var(--fg-muted)]">
                    {answer}
                  </CardContent>
                </details>
              </Card>
            ))}
          </div>
        </section>

        <Card className="mt-16 overflow-hidden border-[var(--mint)]/20 bg-gradient-to-br from-[var(--card)] to-black/40">
          <CardHeader className="sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-xl">Ready to animate a figure?</CardTitle>
              <p className="mt-2 text-sm text-[var(--fg-muted)]">
                Upload one photo · labeled demo until live generation is
                configured · upgrade when you need clean exports.
              </p>
            </div>
            <div className="mt-4 flex flex-wrap gap-2 sm:mt-0">
              <Button asChild>
                <Link href="/create">Generate free</Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href="/community">See projects</Link>
              </Button>
            </div>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
