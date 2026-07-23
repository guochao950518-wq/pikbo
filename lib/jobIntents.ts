/**
 * Job-to-be-done intents for first-run Create (SaaS onboarding 2026 pattern:
 * route by outcome, not by model/feature list).
 *
 * Sources synthesized: progressive disclosure, outcome-first activation,
 * Etsy/TikTok seller workflows, empty-state primary CTA research.
 */

export type JobIntentId =
  | "etsy-listing"
  | "tiktok-hook"
  | "blind-box-drop"
  | "shelf-display"
  | "seller-pack";

export type JobIntent = {
  id: JobIntentId;
  label: string;
  blurb: string;
  /** Recipe to select */
  effect: string;
  aspectRatio: "9:16" | "16:9" | "1:1";
  channel: "etsy" | "tiktok" | "reels" | "whatnot" | "pdp";
  /** Optional deep link into Seller Pack mode */
  href?: string;
};

export const JOB_INTENTS: JobIntent[] = [
  {
    id: "etsy-listing",
    label: "Etsy listing spin",
    blurb: "1:1 packshot that turns on the listing gallery",
    effect: "360-spin-showcase",
    aspectRatio: "1:1",
    channel: "etsy",
  },
  {
    id: "tiktok-hook",
    label: "TikTok / Reels hook",
    blurb: "9:16 flash motion for the first 1–2 seconds",
    effect: "paparazzi-flash",
    aspectRatio: "9:16",
    channel: "tiktok",
  },
  {
    id: "blind-box-drop",
    label: "Blind-box reveal",
    blurb: "Unbox beat for restocks and drop day posts",
    effect: "blind-box-unboxing",
    aspectRatio: "9:16",
    channel: "tiktok",
  },
  {
    id: "shelf-display",
    label: "Shelf / display case",
    blurb: "Clean studio hold for collectors and PDP",
    effect: "display-case-glam",
    aspectRatio: "9:16",
    channel: "pdp",
  },
  {
    id: "seller-pack",
    label: "Seller Pack · 3 clips",
    blurb: "Listing + reveal + social from one photo",
    effect: "360-spin-showcase",
    aspectRatio: "1:1",
    channel: "etsy",
    href: "/create?mode=seller-pack",
  },
];

export function getJobIntent(id: string): JobIntent | undefined {
  return JOB_INTENTS.find((j) => j.id === id);
}
