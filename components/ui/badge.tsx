import type * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide transition-colors",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-white/[0.06] text-[var(--fg-muted)] border-[var(--border)]",
        live: "border-[var(--mint)]/30 bg-[var(--mint)]/15 text-[var(--mint)]",
        brand:
          "border-transparent text-white [background:var(--grad)]",
        outline: "border-[var(--border)] text-[var(--fg-muted)]",
        soon: "border-transparent bg-white/10 text-[var(--fg-dim)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export function Badge({
  className,
  variant,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof badgeVariants>) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}
