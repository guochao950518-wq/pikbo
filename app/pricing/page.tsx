import type { Metadata } from "next";
import Link from "next/link";
import { PLANS, CREDITS_PER_VIDEO, clipsFromCredits } from "@/lib/pricing";
import { site } from "@/lib/site";
import { PricingUsageEstimator } from "@/components/PricingUsageEstimator";
import { PricingPlanCards } from "@/components/PricingPlanCards";
import {
  PricingHeroCopy,
  type PricingCopyVariant,
} from "@/components/PricingHeroCopy";
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
  description: `Preview finite-credit plans for ${site.name}. Test the labeled designer-toy video workflow before live billing opens.`,
};

export default async function PricingPage({
  searchParams,
}: {
  searchParams: Promise<{ copy?: string | string[] }>;
}) {
  const params = await searchParams;
  const requestedCopy = Array.isArray(params.copy)
    ? params.copy[0]
    : params.copy;
  const copyVariant: PricingCopyVariant =
    requestedCopy === "cost" ? "cost-control" : "outcome";

  return (
    <div className="pb-24">
      <PricingHeroCopy variant={copyVariant} />

      <div className="container-x py-12 sm:py-16">
        <Card className="mb-8 border-[var(--mint)]/20 bg-[var(--mint)]/[0.04]">
          <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-bold text-[var(--fg)]">
                Allowance contract — live billing is still gated
              </p>
              <p className="mt-1 max-w-3xl text-xs leading-5 text-[var(--fg-muted)]">
                These cards match the current server grants: one Free trial,
                about five Creator clips, or about fifteen Shop clips at the
                flat 10-credit rate. Model-aware metering is the next step.
              </p>
            </div>
            <Badge variant="outline" className="shrink-0">
              Foundation aligned
            </Badge>
          </CardContent>
        </Card>

        <PricingUsageEstimator />

        <div id="plans" className="mt-16 scroll-mt-24">
          <div className="mb-8 text-center">
            <p className="section-label">Plans</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
              Compare the current allowances
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-[var(--fg-muted)]">
              Every tier is finite and matches the current credit contract. No
              plan promises unlimited model usage.
            </p>
          </div>
          <PricingPlanCards />
        </div>

        <Separator className="my-16" />

        <section>
          <div className="mb-6">
            <p className="section-label">Compare</p>
            <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
              See exactly what changes by tier
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
                      "On-player watermark",
                      ...PLANS.map((plan) => (plan.watermark ? "✓" : "—")),
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
                "What does the current credit number mean?",
                `The current foundation charges ${CREDITS_PER_VIDEO} credits per eligible generation. Model-, resolution-, and duration-aware weights are next. Failed live generations are refunded.`,
              ],
              [
                "What can I test today?",
                `You can browse cached ${site.name} Lab examples and use the labeled Studio workflow with your own toy photo. With provider access configured, Free includes one 5-second, 480p Seedance Mini live trial; otherwise the result stays a labeled cached demo.`,
              ],
              [
                "Can I use clips commercially?",
                "Creator and Shop include commercial use for listings and ads made from toy photos you own. Confirm the final terms before using a live output commercially.",
              ],
              [
                "Is any plan unlimited?",
                "No. Video models have a real per-generation cost, so every plan shows a finite credit allowance.",
              ],
              [
                "Can the credit rate change?",
                "Yes. Provider cost changes with model, output size, and duration. PIKBO will only change public weights when the same quote is enforced by the server and verified against provider billing.",
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
              <CardTitle className="text-xl">Ready to test the toy workflow?</CardTitle>
              <p className="mt-2 text-sm text-[var(--fg-muted)]">
                Upload one owned-toy photo. Cached output stays labeled until
                live generation is configured and verified.
              </p>
            </div>
            <div className="mt-4 flex flex-wrap gap-2 sm:mt-0">
              <Button asChild>
                <Link href="/create?source=pricing-bottom">Open the demo</Link>
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
