"use client";

import Link from "next/link";

export type FailCreditHint =
  | null
  | "10 restored"
  | "refund unconfirmed"
  | "0 cached"
  | "10 used"
  | string;

/**
 * Shared generate failure surface — one tone for Create / Batch / Landing / Image.
 * Always ends with a next action (Retry · recipe · Lab · Modules). No dead-end red text.
 */
export function GenerateFailPanel({
  message,
  creditState = null,
  creditsRestored = false,
  onRetry,
  retryLabel = "Retry",
  showLabSample = true,
  showRecipes = true,
  showModules = true,
  compact = false,
  className = "",
}: {
  message?: string | null;
  creditState?: FailCreditHint;
  /** Explicit restored flag when creditState is not set */
  creditsRestored?: boolean;
  onRetry?: () => void;
  retryLabel?: string;
  showLabSample?: boolean;
  showRecipes?: boolean;
  showModules?: boolean;
  compact?: boolean;
  className?: string;
}) {
  const restored =
    creditsRestored ||
    creditState === "10 restored" ||
    (typeof creditState === "string" && /restored|refunded/i.test(creditState));
  const unconfirmed = creditState === "refund unconfirmed";

  if (!message && !restored && !unconfirmed) return null;

  const tone = restored || unconfirmed ? "amber" : "brand";

  return (
    <div
      role="alert"
      className={`rounded-xl border ${
        tone === "amber"
          ? "border-amber-400/35 bg-amber-400/[0.07] text-amber-50"
          : "border-[var(--brand)]/40 bg-[var(--brand)]/[0.08] text-[var(--brand)]"
      } ${compact ? "px-3 py-2" : "px-3.5 py-3"} ${className}`}
    >
      {message ? (
        <p
          className={`font-semibold leading-snug ${
            compact ? "text-xs" : "text-sm"
          } ${tone === "amber" ? "text-amber-50" : "text-[var(--brand)]"}`}
        >
          {message}
        </p>
      ) : null}

      {restored ? (
        <p className="mt-1 text-[11px] font-bold uppercase tracking-wide text-amber-200/90">
          10 credits restored · not charged for this failed job
        </p>
      ) : null}
      {unconfirmed ? (
        <p className="mt-1 text-[11px] font-bold uppercase tracking-wide text-amber-200/90">
          Refund unconfirmed · check balance before retrying
        </p>
      ) : null}

      <p
        className={`leading-relaxed text-amber-100/70 ${
          compact ? "mt-1 text-[10px]" : "mt-1.5 text-[11px]"
        }`}
      >
        Keep the still · switch recipe if motion looked off · Lab sample is free
        when you just want to feel the flow.
      </p>

      <div
        className={`flex flex-wrap items-center gap-1.5 ${
          compact ? "mt-1.5" : "mt-2.5"
        }`}
      >
        {onRetry ? (
          <button
            type="button"
            onClick={onRetry}
            className="rounded-full border border-[var(--mint)]/45 bg-[var(--mint)]/15 px-3 py-1 text-[11px] font-bold text-[var(--mint)] transition hover:bg-[var(--mint)]/25"
          >
            {retryLabel}
          </button>
        ) : null}
        {showLabSample ? (
          <Link
            href="/create?try=1&sample=scout"
            className="rounded-full border border-white/15 bg-white/[0.04] px-3 py-1 text-[11px] font-semibold text-white/75 transition hover:border-white/30 hover:text-white"
          >
            Free Lab sample
          </Link>
        ) : null}
        {showRecipes ? (
          <Link
            href="/effects"
            className="rounded-full border border-white/15 bg-white/[0.04] px-3 py-1 text-[11px] font-semibold text-white/75 transition hover:border-white/30 hover:text-white"
          >
            Try another recipe
          </Link>
        ) : null}
        {showModules ? (
          <Link
            href="/modules"
            className="rounded-full border border-white/15 bg-white/[0.04] px-3 py-1 text-[11px] font-semibold text-white/75 transition hover:border-white/30 hover:text-white"
          >
            Modules
          </Link>
        ) : null}
      </div>
    </div>
  );
}
