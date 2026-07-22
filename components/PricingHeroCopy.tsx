import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export type PricingCopyVariant = "outcome" | "cost-control";

const COPY: Record<
  PricingCopyVariant,
  {
    badge: string;
    eyebrow: string;
    title: React.ReactNode;
    description: string;
    primary: string;
    secondary: string;
  }
> = {
  outcome: {
    badge: "One free trial · finite paid credits",
    eyebrow: "For owned designer-toy photos",
    title: (
      <>
        Turn one figure photo into
        <br />
        <span className="text-grad">a clip worth posting.</span>
      </>
    ),
    description:
      "Preview cached PIKBO Lab examples, then test the workflow with your own toy. Free includes one watermarked live trial when the provider is configured; Creator and Shop stay finite.",
    primary: "Start one free trial",
    secondary: "Compare allowances",
  },
  "cost-control": {
    badge: "Know the cost before Generate",
    eyebrow: "Finite usage · no unlimited promise",
    title: (
      <>
        Price every toy clip
        <br />
        <span className="text-grad">before you render.</span>
      </>
    ),
    description:
      "The current foundation meters each eligible job at 10 credits: Free includes one trial, Creator about five clips, and Shop about fifteen. Model-aware weights come next.",
    primary: "Open the trial workflow",
    secondary: "Review current allowances",
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
          <span>✓ One 5s watermarked Free trial</span>
          <span>✓ Failed live jobs refund credits</span>
          <span>✓ No unlimited model usage</span>
        </div>
      </div>
    </section>
  );
}
