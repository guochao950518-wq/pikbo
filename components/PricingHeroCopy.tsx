import type { ReactNode } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export type PricingCopyVariant = "outcome" | "cost-control";

const COPY: Record<
  PricingCopyVariant,
  {
    badge: string;
    eyebrow: string;
    title: ReactNode;
    description: string;
    primary: string;
    secondary: string;
  }
> = {
  outcome: {
    badge: "Clear credits · 1 free trial",
    eyebrow: "For owned designer-toy photos",
    title: (
      <>
        One figure photo →
        <br />
        <span className="text-grad">a clip worth posting.</span>
      </>
    ),
    description:
      "Free: one watermarked Seedance Mini trial (5s · 480p). Creator ~5 / Shop ~15 at current credit rates. Cached demos unlimited. No fake unlimited live gens.",
    primary: "Start free trial",
    secondary: "Compare plans",
  },
  "cost-control": {
    badge: "Priced for model cost",
    eyebrow: "Finite usage · no unlimited promise",
    title: (
      <>
        Know the allowance
        <br />
        <span className="text-grad">before you render.</span>
      </>
    ),
    description:
      "Credits map to real Seedance cost (see unit economics). Free ~1 · Creator ~5 · Shop ~15 at 10 credits/clip. Live metering by duration/model comes next.",
    primary: "Open Generate",
    secondary: "Review allowances",
  },
};

export function PricingHeroCopy({
  variant,
}: {
  variant: PricingCopyVariant;
}) {
  const copy = COPY[variant];

  return (
    <section
      className="glow-bg overflow-hidden border-b border-[var(--border)]"
      data-pricing-copy-variant={variant}
    >
      <div className="container-x relative z-10 py-14 text-center sm:py-20">
        <Badge variant="live" className="mx-auto normal-case tracking-wider">
          {copy.badge}
        </Badge>
        <p className="mt-5 text-[10px] font-black uppercase tracking-[0.18em] text-[var(--fg-dim)]">
          {copy.eyebrow}
        </p>
        <h1 className="mx-auto mt-3 max-w-4xl text-4xl font-black leading-[1.02] tracking-[-0.04em] sm:text-6xl lg:text-7xl">
          {copy.title}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-[var(--fg-muted)] sm:text-lg">
          {copy.description}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          <Button asChild size="lg">
            <Link href={`/create?source=pricing-${variant}`}>
              {copy.primary}
            </Link>
          </Button>
          <Button asChild variant="secondary" size="lg">
            <Link href="#plans">{copy.secondary}</Link>
          </Button>
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-[var(--fg-dim)]">
          <span>✓ Cached examples use no credits</span>
          <span>✓ Failed live jobs refund credits</span>
          <span>✓ Billing remains gated for validation</span>
        </div>
      </div>
    </section>
  );
}
