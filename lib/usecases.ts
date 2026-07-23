// A SECOND programmatic page type: use-case / platform landing pages at
// /for/[slug]. This is a different keyword axis from effects — it targets
// commercial-intent seller queries ("etsy listing video", "tiktok shop
// product video") that competitors rank for but Pikbo didn't cover.
//
// Each use-case cross-links to relevant effect pages, weaving effects × use
// cases into an internal-link mesh (the Pollo "Use Cases" + "Effects" model).

import type { Audience } from "./presets";

export type UseCase = {
  slug: string;
  emoji: string;
  label: string; // short nav label
  audience: Audience;
  h1: string;
  seoTitle: string;
  seoDescription: string;
  intro: string;
  body: string[];
  keywords: string[];
  recommendedEffects: string[]; // preset slugs
  faq: { q: string; a: string }[];
};

export const USE_CASES: UseCase[] = [
  {
    slug: "etsy-listing-videos",
    emoji: "🛍️",
    label: "Etsy sellers",
    audience: "seller",
    h1: "Make an Etsy Listing Video for a Toy From One Photo",
    seoTitle: "Etsy Toy Listing Video Generator From One Photo | Pikbo",
    seoDescription:
      "Turn one owned product photo into a short Etsy listing video. Generate a spin, floating hero, or glam look without setting up a new product shoot.",
    intro:
      "Pikbo turns one photo of your handmade toy or collectible into a short listing-video draft—no camera rig or turntable. Review generated angles and product details before publishing.",
    body: [
      "Etsy shows listing videos right in the gallery, so a short spin or floating hero shot gives buyers the confidence a photo can't.",
      "Batch a whole shop's worth of product videos from the photos you already have, and keep a consistent look across every listing.",
    ],
    keywords: [
      "etsy listing video",
      "etsy video maker",
      "product video for etsy",
      "handmade toy video",
    ],
    recommendedEffects: ["360-spin-showcase", "floating-hero", "display-case-glam"],
    faq: [
      {
        q: "How do I make an Etsy listing video for a toy without filming?",
        a: "Upload one product photo you own, choose a listing recipe, and generate a short draft. Check Etsy's current listing requirements and verify every generated product detail before uploading.",
      },
      {
        q: "What video does Etsy allow on listings?",
        a: "Etsy supports listing videos. Pikbo can be configured for a 5-second square or vertical clip; confirm the marketplace requirements before publishing.",
      },
      {
        q: "Do I need to film anything?",
        a: "No. Pikbo generates the video from one product photo you already have.",
      },
    ],
  },
  {
    slug: "tiktok-shop-product-videos",
    emoji: "🎵",
    label: "TikTok Shop",
    audience: "seller",
    h1: "Create a TikTok Shop Video for a Toy From One Photo",
    seoTitle: "TikTok Shop Toy Video Generator From One Photo | Pikbo",
    seoDescription:
      "Create short TikTok Shop video drafts from one toy photo. Try unboxing, product-spin, and character-motion hooks built for vertical viewing.",
    intro:
      "On TikTok Shop, the opening beat matters. Pikbo turns one owned product photo into an unboxing reveal, product spin, or character-motion draft you can review and test.",
    body: [
      "Vertical 9:16 output drops straight into TikTok with no reformatting.",
      "Post a reveal for a new drop, a dance for a viral moment, and a spin for the product page — all from the same photo.",
    ],
    keywords: [
      "tiktok shop product video",
      "tiktok product video maker",
      "toy video for tiktok",
      "blind box tiktok video",
    ],
    recommendedEffects: ["blind-box-unboxing", "make-figure-dance", "mystery-box-reveal"],
    faq: [
      {
        q: "Can I make a TikTok Shop toy video from one product photo?",
        a: "Yes. Start with one clear photo, choose a vertical recipe, and generate a short draft. Performance is not guaranteed, so test hooks and verify product details before publishing.",
      },
      {
        q: "Are videos vertical for TikTok?",
        a: "Yes — these effects export in 9:16 vertical, ready to upload directly.",
      },
      {
        q: "Can I make videos for a whole product line?",
        a: "Yes, generate one per product from each photo to keep a consistent shop feed.",
      },
    ],
  },
  {
    slug: "amazon-product-videos",
    emoji: "📦",
    label: "Amazon listings",
    audience: "seller",
    h1: "Make an Amazon Product Video for a Toy From One Photo",
    seoTitle: "Amazon Toy Product Video Generator From One Photo | Pikbo",
    seoDescription:
      "Draft a product video for an Amazon toy listing from one owned photo. Generate a product spin or floating hero shot, then verify every inferred detail.",
    intro:
      "Pikbo turns one photo of your figure into a short product-spin or floating-hero draft. Generated unseen angles are illustrative, not product documentation, and must be checked before publishing.",
    body: [
      "A reviewed spin draft can provide another product view, but generated angles are not a substitute for accurate product documentation.",
      "No studio booking — produce listing videos for your whole catalog from existing product photos.",
    ],
    keywords: [
      "amazon product video",
      "amazon listing video maker",
      "product video for amazon",
      "toy listing video",
    ],
    recommendedEffects: ["360-spin-showcase", "floating-hero", "blind-box-unboxing"],
    faq: [
      {
        q: "Can I create an Amazon toy product video without a studio shoot?",
        a: "You can generate a short draft from one owned product photo. Confirm Amazon's current media rules and compare every generated angle with the real product before using it in a listing.",
      },
      {
        q: "What format does Amazon need?",
        a: "Square or 16:9 clips work well for Amazon listings — Pikbo's showcase effects export in those ratios.",
      },
    ],
  },
  {
    slug: "instagram-reels-for-collectors",
    emoji: "📸",
    label: "Instagram collectors",
    audience: "collector",
    h1: "Instagram Reels Maker for Toy Collectors",
    seoTitle: "Instagram Reels Maker for Collectors | Pikbo",
    seoDescription:
      "Turn your collection photos into Instagram Reels. Dancing figures, shelf pans, and neon scenes that grow a collector account.",
    intro:
      "Grow your collector account with Reels that move. Pikbo turns photos of the figures you own into dancing clips, shelf pans, and cinematic scenes — the content that gets shared.",
    body: [
      "Reels are built around motion and personality. Test a dancing figure or slow shelf pan against your static posts; performance varies by account and audience.",
      "Build a signature look for your account and post consistently without a camera setup.",
    ],
    keywords: [
      "instagram reels toy video",
      "collector reels maker",
      "figure video for instagram",
    ],
    recommendedEffects: ["make-figure-dance", "paparazzi-flash", "neon-city-night"],
    faq: [
      {
        q: "Are clips ready for Reels?",
        a: "Yes — vertical 9:16 output uploads straight to Instagram Reels.",
      },
    ],
  },
  {
    slug: "blind-box-brand-marketing",
    emoji: "🎁",
    label: "Blind box brands",
    audience: "seller",
    h1: "Create Blind Box Drop Videos From One Product Photo",
    seoTitle: "Blind Box Drop Video Generator for Toy Brands | Pikbo",
    seoDescription:
      "Launch drops with hype. Turn one figure photo into unboxing reveals and mystery-box teasers for your blind box brand — no production shoot.",
    intro:
      "Every blind box drop needs a teaser. Pikbo turns a single figure photo into unboxing reveals and mystery-box moments that build hype before a launch — no production shoot required.",
    body: [
      "Tease a series before samples ship, and post a reveal the moment it drops.",
      "Keep a consistent, hype-driven look across an entire release with matching effects.",
    ],
    keywords: [
      "blind box marketing video",
      "blind box brand video",
      "toy drop teaser video",
    ],
    recommendedEffects: ["blind-box-unboxing", "mystery-box-reveal", "360-spin-showcase"],
    faq: [
      {
        q: "How can a blind box brand make a drop teaser from one image?",
        a: "Upload an image your brand owns, select an unboxing or mystery-reveal recipe, and generate a short teaser draft. Packaging text and unrevealed surfaces are model-generated and require review.",
      },
      {
        q: "Can I tease before the product ships?",
        a: "Yes — a single render or product mockup photo is enough to build a reveal teaser.",
      },
    ],
  },
  {
    slug: "whatnot-live-selling",
    emoji: "📡",
    label: "Whatnot sellers",
    audience: "seller",
    h1: "Make a Whatnot Promo Video for a Toy From One Photo",
    seoTitle: "Whatnot Toy Promo Video Generator From One Photo | Pikbo",
    seoDescription:
      "Promote your Whatnot shows and drops with quick hype videos. Turn one figure photo into an unboxing or spin clip that pulls buyers into your live.",
    intro:
      "Prepare a Whatnot show promo from one owned figure photo. Pikbo drafts an unboxing or spin clip you can post before a show—without setting up another shoot between sales.",
    body: [
      "Announce a drop, tease a grail, or recap a break with a clip that matches the energy of live selling.",
      "Vertical output fits the social posts that funnel viewers to your Whatnot show.",
    ],
    keywords: [
      "whatnot seller video",
      "whatnot promo video",
      "live selling toy video",
    ],
    recommendedEffects: ["blind-box-unboxing", "360-spin-showcase", "mystery-box-reveal"],
    faq: [
      {
        q: "How do I make a promo video for a Whatnot toy show?",
        a: "Upload a photo of a toy you own, choose an unboxing or spin recipe, and prepare the clip before your show. Pikbo does not publish to Whatnot or guarantee attendance.",
      },
      {
        q: "Can I make clips between lives?",
        a: "Yes — create a promo from one photo. With a configured provider, live renders usually take 30–90 seconds, so prepare them before the show.",
      },
    ],
  },
  {
    slug: "depop-shop-videos",
    emoji: "🧵",
    label: "Depop sellers",
    audience: "seller",
    h1: "Depop Video Maker for Toy & Collectible Shops",
    seoTitle: "Depop Video Maker for Toy Sellers | Pikbo",
    seoDescription:
      "Make your Depop listings move. Turn one photo of a figure or collectible into a clean spin or glam video that stands out in the feed.",
    intro:
      "Depop is a visual, feed-first marketplace. Pikbo turns one photo of your figure or collectible into a spin or glam clip that stops the scroll and makes your shop look pro.",
    body: [
      "A short video on a listing signals a serious seller and helps a piece stand out from static photos.",
      "Keep a consistent look across your whole shop with the same effect on every item.",
    ],
    keywords: [
      "depop video",
      "depop listing video",
      "resale toy video maker",
    ],
    recommendedEffects: ["360-spin-showcase", "display-case-glam", "floating-hero"],
    faq: [
      {
        q: "What size video does Depop use?",
        a: "Square or vertical short clips work well on Depop — both export from Pikbo's showcase effects.",
      },
    ],
  },
];

/**
 * G4: short / roast-era slugs → real use-case pages.
 * Kept in source so App Router `[slug]` never 404s before next.config redirects.
 */
export const FOR_SLUG_ALIASES: Record<string, string> = {
  "etsy-sellers": "etsy-listing-videos",
  etsy: "etsy-listing-videos",
  "tiktok-shop": "tiktok-shop-product-videos",
  tiktok: "tiktok-shop-product-videos",
  amazon: "amazon-product-videos",
  "amazon-sellers": "amazon-product-videos",
  instagram: "instagram-reels-for-collectors",
  collectors: "instagram-reels-for-collectors",
  "blind-box": "blind-box-brand-marketing",
  whatnot: "whatnot-live-selling",
  depop: "depop-shop-videos",
};

/** Resolve alias → canonical slug (or return input). */
export function resolveUseCaseSlug(slug: string): string {
  return FOR_SLUG_ALIASES[slug] ?? slug;
}

export function getUseCase(slug: string): UseCase | undefined {
  return USE_CASES.find((u) => u.slug === resolveUseCaseSlug(slug));
}
