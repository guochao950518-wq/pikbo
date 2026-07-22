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
    badge: "Prelaunch plans · finite credits",
    eyebrow: "For owned designer-toy photos",
    title: (
      <>
        Turn one figure photo into
        <br />
        <span className="text-grad">a clip worth posting.</span>
      </>
    ),
    description:
      "Preview cached PIKBO Lab examples, then test the labeled workflow with your own toy. Live allowances will be locked to model, duration, and resolution before billing opens.",
    primary: "Test the workflow",
    secondary: "Compare plan previews",
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
      "Choose a model, resolution, and duration; the live product will show a finite credit quote before a paid render. Today, use the labeled demo while those allowances are validated.",
    primary: "Open the labeled demo",
    secondary: "Review planned allowances",
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
