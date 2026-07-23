/**
 * Soft-launch freezes from docs/prd/SOFT_NAV_AND_PRESETS.md.
 * Code imports this so G2 homepage proof cannot drift from the product contract.
 */

/** At most these eight registered recipes may appear on the homepage proof wall. */
export const HOME_PROOF_SLUGS = [
  "floating-hero",
  "blind-box-unboxing",
  "miniature-scene",
  "paparazzi-flash",
  "360-spin-showcase",
  "mystery-box-reveal",
  "make-figure-dance",
  "display-case-glam",
] as const;

export type HomeProofSlug = (typeof HOME_PROOF_SLUGS)[number];

export const HOME_PROOF_LIMIT = HOME_PROOF_SLUGS.length;

export function isHomeProofSlug(slug: string): slug is HomeProofSlug {
  return (HOME_PROOF_SLUGS as readonly string[]).includes(slug);
}

/** Badge required on soft-launch proof cards (not Live generation). */
export const HOME_PROOF_BADGE = "Official example · cached" as const;
