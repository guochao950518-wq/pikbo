// Credits model. Align with docs/UNIT_ECONOMICS.md (2026-07-23).
// Every paid credit must stay above marginal Seedance cost; free is a tiny trial.
// Never offer true "unlimited" on expensive models.

export type PlanId = "free" | "creator" | "shop";

export type Plan = {
  id: PlanId;
  name: string;
  priceMonthly: number; // USD
  credits: number;
  blurb: string;
  perks: string[];
  featured?: boolean;
  cta: string;
  watermark: boolean;
  /** Honest engine cap: Seedance ships 480p (free) / 720p (paid). */
  resolution: "480p" | "720p";
  commercial: boolean;
  priority: boolean;
  /** Stripe Price ID env key name (optional until wired) */
  stripePriceEnv?: string;
};

/** Flat cost until server-side model×duration metering ships (Grok next). */
export const CREDITS_PER_VIDEO = 10;

/**
 * Launch allowances (honest vs fal cost, not "fake 50 clips").
 * Free ≈ 1 trial · Creator ≈ 5 clips · Shop ≈ 15 clips at 10 credits each.
 */
export const PLANS: Plan[] = [
  {
    id: "free",
    name: "Free",
    priceMonthly: 0,
    credits: 10,
    blurb: "One Seedance Mini 480p live trial with an on-player mark. Cached demos stay free.",
    perks: [
      "10 credits (~1 live trial job / month)",
      "Seedance Mini · 480p · on-player mark",
      "All toy effect presets",
      "Unlimited cached demo playback",
    ],
    cta: "Start free trial",
    watermark: true,
    resolution: "480p",
    commercial: false,
    priority: false,
  },
  {
    id: "creator",
    name: "Creator",
    priceMonthly: 19,
    credits: 50,
    blurb: "For collectors who post a few real clips a month — priced for model cost.",
    perks: [
      "50 credits / month",
      "~5 clips (5s Fast 720p class — not 50)",
      "720p Seedance path · no player mark",
      "Priority queue",
      "Commercial use (toys you own)",
    ],
    featured: true,
    cta: "Go Creator",
    watermark: false,
    resolution: "720p",
    commercial: true,
    priority: true,
    stripePriceEnv: "STRIPE_PRICE_CREATOR",
  },
  {
    id: "shop",
    name: "Shop",
    priceMonthly: 49,
    credits: 150,
    blurb: "For sellers shipping finite listing packs at the current flat rate.",
    perks: [
      "150 credits / month",
      "~15 clips at current credit rate",
      "720p Seedance path · no player mark",
      "Batch generate",
      "Commercial use",
    ],
    cta: "Go Shop",
    watermark: false,
    resolution: "720p",
    commercial: true,
    priority: true,
    stripePriceEnv: "STRIPE_PRICE_SHOP",
  },
];

export function getPlan(id: PlanId | string | undefined): Plan {
  return PLANS.find((p) => p.id === id) ?? PLANS[0];
}

export function clipsFromCredits(credits: number): number {
  return Math.floor(credits / CREDITS_PER_VIDEO);
}
