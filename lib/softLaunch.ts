/**
 * Soft-launch freezes from docs/prd/SOFT_NAV_AND_PRESETS.md (+ suite Modules).
 * Code imports this so G1/G2 cannot drift from the product contract.
 *
 * 2026-07-24: PRIMARY/MOBILE aligned to HF pixel IA (Explore/Video/Image/Cinema/Community
 * + bottom Home·Community·Generate·Library·Profile). Video is the product.
 */

/**
 * Desktop primary — HF-style product OS nav (video first).
 */
export const PRIMARY_NAV = [
  { href: "/", label: "Explore" },
  { href: "/create", label: "Video" },
  { href: "/image", label: "Image" },
  { href: "/cinema", label: "Cinema" },
  { href: "/community", label: "Community" },
] as const;

export const PRIMARY_NAV_HREFS = PRIMARY_NAV.map((item) => item.href);

/**
 * Mobile bottom bar — pixel parity with HF:
 * Home · Community · Generate(center) · Library · Profile
 */
export const MOBILE_NAV = [
  { href: "/", label: "Home" },
  { href: "/community", label: "Community" },
  { href: "/create", label: "Generate", primary: true as const },
  { href: "/library", label: "Library" },
  { href: "/profile", label: "Profile" },
] as const;

export const MOBILE_NAV_HREFS = MOBILE_NAV.map((item) => item.href);

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
