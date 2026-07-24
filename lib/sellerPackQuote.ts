/**
 * Seller Pack live quote helpers — Y5 credit transparency.
 * Pure: no React, no network. Used by BatchStudio + engine-smoke.
 */

import {
  SELLER_PACK_CHILD_COUNT,
  SELLER_PACK_QUOTE_CREDITS,
} from "@/lib/durableCredits/sellerPack";
import { CREDITS_PER_VIDEO } from "@/lib/pricing";

export type SellerPackQuote = {
  childCount: number;
  creditsPerChild: number;
  totalCredits: number;
  demo: boolean;
};

/** Fixed 3-child Seller Pack quote (or N×10 for custom childCount). */
export function sellerPackQuote(opts: {
  demo: boolean;
  childCount?: number;
}): SellerPackQuote {
  const childCount = Math.max(
    1,
    Math.min(12, opts.childCount ?? SELLER_PACK_CHILD_COUNT)
  );
  if (opts.demo) {
    return {
      childCount,
      creditsPerChild: 0,
      totalCredits: 0,
      demo: true,
    };
  }
  return {
    childCount,
    creditsPerChild: CREDITS_PER_VIDEO,
    totalCredits: childCount * CREDITS_PER_VIDEO,
    demo: false,
  };
}

/** Default live pack quote is always 30 (3×10). */
export function sellerPackDefaultLiveTotal(): number {
  return SELLER_PACK_QUOTE_CREDITS;
}

/**
 * Whether cookie/me balance covers the live quote.
 * `undefined` balance = me not loaded yet → do not hard-block.
 */
export function sellerPackBalanceCovers(
  quote: SellerPackQuote,
  balance: number | undefined
): boolean {
  if (quote.demo) return true;
  if (balance === undefined) return true;
  return balance >= quote.totalCredits;
}

export function sellerPackShortfall(
  quote: SellerPackQuote,
  balance: number
): number {
  if (quote.demo) return 0;
  return Math.max(0, quote.totalCredits - balance);
}

/** One-line CTA / strip copy for the pack run button. */
export function sellerPackQuoteLabel(quote: SellerPackQuote): string {
  if (quote.demo) {
    return `${quote.childCount} clips · cached free (0 credits)`;
  }
  return `${quote.childCount} × ${quote.creditsPerChild} = ${quote.totalCredits} credits · failed child refunds 10`;
}
