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
    h1: "Etsy Listing Video Maker for Toys & Collectibles",
    seoTitle: "Etsy Listing Video Maker for Toys | Pikbo",
    seoDescription:
      "Turn one product photo into an Etsy listing video. Spin, float, and glam videos that make handmade toys and collectibles sell. No filming.",
    intro:
      "Etsy listings with video get more views and sales. Pikbo turns a single photo of your handmade toy or collectible into a clean listing video — no camera, no rig, no editing.",
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
        q: "What video does Etsy allow on listings?",
        a: "Etsy supports short listing videos in the gallery. A 5-second square or vertical clip works well — exactly what Pikbo exports.",
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
    h1: "TikTok Shop Product Video Maker for Toys",
    seoTitle: "TikTok Shop Product Video Maker for Toys | Pikbo",
    seoDescription:
      "Create scroll-stopping TikTok Shop videos from one photo. Unboxing reveals and dancing figures built to sell designer toys and blind boxes.",
    intro:
      "On TikTok Shop, the first second decides everything. Pikbo turns one product photo into a hook — an unboxing reveal or a dancing figure — that stops the scroll and drives the sale.",
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
    h1: "Amazon Product Video Maker for Toys & Figures",
    seoTitle: "Amazon Product Video Maker for Toys | Pikbo",
    seoDescription:
      "Add a product video to your Amazon toy listing from one photo. 360 spins and floating hero shots that lift conversions and cut returns.",
    intro:
      "Amazon shoppers who watch a product video are far more likely to buy. Pikbo turns one photo of your figure into a clean 360° spin or floating hero video that fits right into your listing.",
    body: [
      "A spin video answers the 'what does it actually look like' question that drives returns and hesitation.",
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
      "Reels reward motion and personality. A dancing figure or a slow shelf pan outperforms a static grid post.",
      "Build a signature look for your account and post consistently without a camera setup.",
    ],
    keywords: [
      "instagram reels toy video",
      "collector reels maker",
      "figure video for instagram",
    ],
    recommendedEffects: ["make-figure-dance", "collection-shelf-pan", "neon-city-night"],
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
    h1: "Video Maker for Blind Box Brands & Drops",
    seoTitle: "Blind Box Brand Marketing Video Maker | Pikbo",
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
        q: "Can I tease before the product ships?",
        a: "Yes — a single render or product mockup photo is enough to build a reveal teaser.",
      },
    ],
  },
];

export function getUseCase(slug: string): UseCase | undefined {
  return USE_CASES.find((u) => u.slug === slug);
}
