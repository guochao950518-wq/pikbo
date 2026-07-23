// Fourth programmatic page type: search-intent "tool" pages at /tools/[slug].
// Built to GPT's docs/prd/SEO_INTENT_50.md — one page completes one search job:
// searchable H1 + a working recipe deep-link to Create + honest limits + FAQ.
// Keyword mesh is now: Tools × Effects × Use-cases × Toy-types.
//
// Honesty rules (SEO_INTENT_50): no page promises exact unseen product angles,
// sales, reach, speed, or unlimited generation. Every page deep-links to a real
// recipe in Create; brand names are never targeted.

export type Tool = {
  slug: string;
  emoji: string;
  label: string; // short chip label
  h1: string;
  seoTitle: string;
  seoDescription: string;
  intro: string;
  body: string[];
  keywords: string[];
  primaryEffect: string; // preset slug that drives the tool panel
  effects: string[]; // preset slugs shown as recommended cards
  faq: { q: string; a: string }[];
};

export const TOOLS: Tool[] = [
  {
    slug: "ai-toy-video-generator",
    emoji: "🧸",
    label: "AI toy video",
    h1: "AI Toy Video Generator From One Photo",
    seoTitle: "AI Toy Video Generator From One Photo | Pikbo",
    seoDescription:
      "Turn one photo of a toy you own into a short video. Pick a toy-native recipe — spin, float, unbox, or dance — and generate a clip for TikTok or Etsy.",
    intro:
      "Pikbo is an AI toy video generator built for the toy you actually own. Upload one photo, pick a toy-native recipe, and get a short clip you can post or list — no camera rig, no stop-motion setup.",
    body: [
      "Unlike generic 'turn yourself into a figure' filters, Pikbo animates the figure in your photo and keeps its recognizable shape and colors. Generated motion can still change small details, so review each clip.",
      "Free runs use Seedance Mini at 5 seconds and 480p with an on-player mark. Cached demos are labeled and never presented as your upload.",
    ],
    keywords: [
      "ai toy video generator",
      "toy video maker from photo",
      "make a toy video with ai",
    ],
    primaryEffect: "floating-hero",
    effects: ["floating-hero", "360-spin-showcase", "make-figure-dance"],
    faq: [
      {
        q: "Is it free to try?",
        a: "Yes — a free Seedance Mini trial runs at 5 seconds and 480p with an on-player mark. No card required.",
      },
      {
        q: "Does it animate my exact toy?",
        a: "It uses your photo as the reference. Generated motion can change sculpt, color, or small details, so review the result before using it.",
      },
    ],
  },
  {
    slug: "toy-image-to-video-ai",
    emoji: "🎞️",
    label: "Image → video",
    h1: "Turn a Toy Image Into a Video",
    seoTitle: "Toy Image to Video AI — Animate a Photo | Pikbo",
    seoDescription:
      "Upload a toy image and turn it into a short video with AI. The figure in your photo walks, dances, or spins — built for collectors and toy sellers.",
    intro:
      "Have one good photo of your figure? Pikbo turns that image into motion. Choose how it should move and generate a short vertical clip from the still you already have.",
    body: [
      "Image-to-video keeps your figure as the visual reference, so the result looks like your toy rather than a generic character.",
      "Best with a clean, well-lit, front-facing photo on a plain background. Generated details can drift — review before posting.",
    ],
    keywords: [
      "toy image to video",
      "image to video ai toy",
      "photo to video toy maker",
    ],
    primaryEffect: "make-figure-walk",
    effects: ["make-figure-walk", "make-figure-dance", "360-spin-showcase"],
    faq: [
      {
        q: "What image works best?",
        a: "A clean, front-facing photo on a plain background with even lighting gives the smoothest motion.",
      },
      {
        q: "How long is the clip?",
        a: "Free Mini clips are 5 seconds at 480p. Paid tiers unlock longer, higher-resolution runs.",
      },
    ],
  },
  {
    slug: "ai-product-video-generator-for-toys",
    emoji: "🛍️",
    label: "Product video",
    h1: "AI Product Video Generator for Toys",
    seoTitle: "AI Product Video Generator for Toys From One Photo | Pikbo",
    seoDescription:
      "Make listing-ready product videos for toys from one photo. Clean spins and hero shots for Etsy, TikTok Shop, and marketplaces — no studio.",
    intro:
      "Toy listings sell on motion. Pikbo turns one product photo into a clean spin or hero clip that shows your figure off for a storefront, without a camera studio.",
    body: [
      "A short spin lets buyers inspect a collectible, but it does not guarantee a sale, and inferred angles should be checked against the real product.",
      "Paid clips are cleared for commercial use — keep the video honest to the product you're actually selling.",
    ],
    keywords: [
      "ai product video generator toys",
      "toy listing video maker",
      "product video from photo toy",
    ],
    primaryEffect: "360-spin-showcase",
    effects: ["360-spin-showcase", "floating-hero", "display-case-glam"],
    faq: [
      {
        q: "Can I use these for listings?",
        a: "Paid clips are cleared for commercial use. Because angles are generated, review sculpt, paint, and logos before publishing.",
      },
      {
        q: "Which marketplaces?",
        a: "Export vertical for TikTok Shop or square for marketplace galleries like Etsy and eBay.",
      },
    ],
  },
  {
    slug: "collectible-video-generator",
    emoji: "🏆",
    label: "Collectible video",
    h1: "Collectible Video Generator From a Photo",
    seoTitle: "Collectible Video Generator From a Photo | Pikbo",
    seoDescription:
      "Give your collectibles the premium video they deserve. Glam lighting, floating hero shots, and spins from one photo — for collectors and resellers.",
    intro:
      "A grail piece deserves better than a shelf photo. Pikbo turns one photo of your collectible into a glam-lit showcase, a floating hero shot, or a clean spin.",
    body: [
      "Built for designer toys, resin, sofubi, and vinyl where the sculpt and finish are the appeal.",
      "The figure stays the reference; generated lighting and motion are stylized effects — review before commercial use.",
    ],
    keywords: [
      "collectible video generator",
      "collectible showcase video",
      "figure showcase video from photo",
    ],
    primaryEffect: "display-case-glam",
    effects: ["display-case-glam", "floating-hero", "360-spin-showcase"],
    faq: [
      {
        q: "Good for grail pieces?",
        a: "Yes — the glam and hero effects add cinematic lighting while keeping your figure sharp and centered.",
      },
      {
        q: "Does it keep the finish?",
        a: "Glossy vinyl and resin play well with the glam lighting. Review the clip to confirm colors read correctly.",
      },
    ],
  },
  {
    slug: "toy-animation-from-photo",
    emoji: "✨",
    label: "Toy animation",
    h1: "Animate a Toy From a Photo",
    seoTitle: "Animate a Toy From a Photo With AI | Pikbo",
    seoDescription:
      "Bring a toy to life from a single photo. Make the figure you own dance, wave, or come alive — clips built for Reels and TikTok.",
    intro:
      "Pikbo animates the toy in your photo. Pick a come-alive recipe — a dance, a wave, a little bit of life — and generate a short clip that gives your figure personality.",
    body: [
      "The state is always clear before you generate: a labeled cached demo, or a live run against your uploaded photo.",
      "Come-alive motion is generated, so expect small variations in the figure between runs. Not happy? Regenerate — failed live jobs refund credits.",
    ],
    keywords: [
      "animate toy from photo",
      "toy comes alive video",
      "make a toy move ai",
    ],
    primaryEffect: "make-figure-dance",
    effects: ["make-figure-dance", "toy-wave-hello", "plushie-comes-alive"],
    faq: [
      {
        q: "Cached demo or live?",
        a: "The preflight shows whether the next result is a labeled cached demo or a live run that uses your uploaded photo.",
      },
      {
        q: "What if the motion looks off?",
        a: "AI motion varies run to run. Regenerate for a different take — failed live jobs refund the credits.",
      },
    ],
  },
  {
    slug: "toy-cgi-video-generator",
    emoji: "🌀",
    label: "CGI-style",
    h1: "Create a CGI-Style Product Video for a Toy",
    seoTitle: "CGI-Style Toy Product Video Generator From One Photo | Pikbo",
    seoDescription:
      "Make a clean, CGI-style product video for a toy from one photo. Floating hero shots and studio motion without a 3D model or render pipeline.",
    intro:
      "Want that polished, CGI product look without building a 3D model? Pikbo turns one photo into a floating hero or studio-motion clip with a clean, high-end feel.",
    body: [
      "There is no real 3D model behind the clip — it is a generated video from your photo, so it should not be described as a true CAD or CGI render.",
      "Great for a premium storefront hero or a scroll-stopping social post.",
    ],
    keywords: [
      "cgi toy video generator",
      "cgi style product video toy",
      "3d style toy video from photo",
    ],
    primaryEffect: "floating-hero",
    effects: ["floating-hero", "miniature-scene", "display-case-glam"],
    faq: [
      {
        q: "Is this a real 3D render?",
        a: "No — it is a generated video from your photo, not a true 3D model or CAD render. It gives a CGI-style look, not a technical model.",
      },
      {
        q: "Best photo?",
        a: "A clean, evenly lit shot on a plain background produces the most polished result.",
      },
    ],
  },
  {
    slug: "toy-launch-teaser-generator",
    emoji: "🎬",
    label: "Launch teaser",
    h1: "Create a Toy Launch Teaser From One Photo",
    seoTitle: "Toy Launch Teaser Generator From One Photo | Pikbo",
    seoDescription:
      "Make a punchy launch teaser for a toy drop from one photo. Flash-lit reveal energy for announcements on TikTok, Instagram, and Discord.",
    intro:
      "A drop needs a teaser. Pikbo turns one photo of your figure into a punchy, flash-lit reveal built to announce a launch and get people watching.",
    body: [
      "The teaser frames the figure as the moment — ideal for 'coming soon' and 'drop day' posts.",
      "Keep the teaser honest to the product; paid clips are cleared for commercial use.",
    ],
    keywords: [
      "toy launch teaser generator",
      "toy drop teaser video",
      "figure announcement video from photo",
    ],
    primaryEffect: "paparazzi-flash",
    effects: ["paparazzi-flash", "mystery-box-reveal", "confetti-drop-reveal"],
    faq: [
      {
        q: "Good for a drop announcement?",
        a: "Yes — the flash-reveal energy is built for launch and drop-day posts. Paid clips are cleared for commercial use.",
      },
      {
        q: "What length?",
        a: "Free Mini teasers are 5 seconds at 480p — enough for a punchy vertical hook.",
      },
    ],
  },
  {
    slug: "restock-announcement-video",
    emoji: "📢",
    label: "Restock video",
    h1: "Make a Restock Announcement Video for a Toy",
    seoTitle: "Toy Restock Announcement Video From One Photo | Pikbo",
    seoDescription:
      "Announce a toy restock with a high-energy reveal video from one photo. Built for Whatnot, TikTok Shop, and Instagram 'back in stock' posts.",
    intro:
      "Restocks live on urgency. Pikbo turns one photo of the figure into a reveal-energy clip that says 'back in stock' and stops the scroll.",
    body: [
      "There is no inventory integration — the clip is a social announcement you post yourself, not a live stock feed.",
      "Paid clips are cleared for commercial use; keep the reveal honest to the item you're restocking.",
    ],
    keywords: [
      "restock announcement video",
      "toy back in stock video",
      "restock reveal video from photo",
    ],
    primaryEffect: "mystery-box-reveal",
    effects: ["mystery-box-reveal", "blind-box-unboxing", "confetti-drop-reveal"],
    faq: [
      {
        q: "Does it connect to my store's stock?",
        a: "No — there's no inventory integration. It's a social announcement clip you post yourself.",
      },
      {
        q: "Where do restock videos work best?",
        a: "Vertical clips suit Whatnot promos, TikTok Shop, and Instagram 'back in stock' posts.",
      },
    ],
  },
  {
    slug: "toy-ad-generator",
    emoji: "📣",
    label: "Toy ad",
    h1: "AI Toy Ad Generator From a Product Photo",
    seoTitle: "AI Toy Ad Generator From a Product Photo | Pikbo",
    seoDescription:
      "Draft a short toy ad from one product photo. Clean hero motion for TikTok Shop and Etsy ad creative — commercial use on paid clips.",
    intro:
      "Pikbo drafts short ad creative for a toy from one product photo. Pick a clean hero recipe and generate a vertical clip you can use as ad creative.",
    body: [
      "These are ad drafts, not a media buy — Pikbo makes the creative; running the ad is up to you.",
      "Paid clips are cleared for commercial use. Keep the ad honest to the product and avoid claims you can't support.",
    ],
    keywords: [
      "ai toy ad generator",
      "toy ad video maker",
      "product ad video from photo toy",
    ],
    primaryEffect: "floating-hero",
    effects: ["floating-hero", "360-spin-showcase", "paparazzi-flash"],
    faq: [
      {
        q: "Does it run the ad for me?",
        a: "No — Pikbo makes the ad creative. Placing and running the ad is up to you.",
      },
      {
        q: "Can I use it commercially?",
        a: "Paid clips are cleared for commercial use. Keep the ad honest to the product you're selling.",
      },
    ],
  },
  {
    slug: "one-photo-product-video",
    emoji: "📸",
    label: "One photo",
    h1: "Make a Product Video From One Toy Photo",
    seoTitle: "One-Photo Product Video Maker for Toys | Pikbo",
    seoDescription:
      "Only have one photo? Turn a single toy product photo into a short video — a floating hero or clean spin for listings and social.",
    intro:
      "You don't need a photo shoot. Pikbo turns a single product photo of your toy into a short video — a floating hero or a clean spin — from that one image.",
    body: [
      "The one-photo workflow is the fastest path from a shelf shot to a postable clip.",
      "Because the motion and any unseen angles are generated, review the result against the real product before using it in a listing.",
    ],
    keywords: [
      "one photo product video",
      "single photo toy video",
      "product video from one image toy",
    ],
    primaryEffect: "floating-hero",
    effects: ["floating-hero", "360-spin-showcase", "display-case-glam"],
    faq: [
      {
        q: "Really just one photo?",
        a: "Yes — one clean, front-facing photo is enough. Better lighting and a plain background give a smoother clip.",
      },
      {
        q: "Will it show accurate angles?",
        a: "Unseen angles are generated and inferred, so check them against the real product before using the clip in a listing.",
      },
    ],
  },
];

export function getTool(slug: string): Tool | undefined {
  return TOOLS.find((t) => t.slug === slug);
}
