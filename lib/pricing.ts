// Credits model. Golden rule: every paid credit is priced ABOVE marginal
// model cost, and free clips only use the cheapest model + watermark.
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
  resolution: "720p" | "1080p";
  commercial: boolean;
  priority: boolean;
  /** Stripe Price ID env key name (optional until wired) */
  stripePriceEnv?: string;
};

export const CREDITS_PER_VIDEO = 10; // 1 clip = 10 credits (tune to model cost)

export const PLANS: Plan[] = [
  {
    id: "free",
    name: "Free",
    priceMonthly: 0,
    credits: 30,
    blurb: "Try it out. Clips carry a small Pikbo watermark.",
    perks: [
      "30 credits / month",
      "~3 clips on the fast model",
      "720p, watermarked",
      "All effect presets",
    ],
    cta: "Start free",
    watermark: true,
    resolution: "720p",
    commercial: false,
    priority: false,
  },
  {
    id: "creator",
    name: "Creator",
    priceMonthly: 19,
    credits: 500,
    blurb: "For collectors posting regularly.",
    perks: [
      "500 credits / month",
      "~50 clips",
      "1080p, no watermark",
      "Priority queue",
      "Commercial use",
    ],
    featured: true,
    cta: "Go Creator",
    watermark: false,
    resolution: "1080p",
    commercial: true,
    priority: true,
    stripePriceEnv: "STRIPE_PRICE_CREATOR",
  },
  {
    id: "shop",
    name: "Shop",
    priceMonthly: 49,
    credits: 1500,
    blurb: "For sellers producing product & ad videos.",
    perks: [
      "1,500 credits / month",
      "~150 clips",
      "1080p, no watermark",
      "Batch generate",
      "Lowest cost per clip",
    ],
    cta: "Go Shop",
    watermark: false,
    resolution: "1080p",
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
