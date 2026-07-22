// A FOURTH content axis: informational guide / how-to articles at
// /guides/[slug]. These target top-of-funnel informational searches
// ("how to make a figure spin video", "how to photograph toys for video")
// and funnel readers into the studio + relevant effect pages.
//
// Keyword mesh: Effects × Use-cases × Toy-types × Guides.

export type GuideSection = {
  h2: string;
  paragraphs: string[];
};

export type Guide = {
  slug: string;
  emoji: string;
  title: string; // on-page H1 / card title
  dek: string; // subtitle
  seoTitle: string;
  seoDescription: string;
  readMins: number;
  intro: string;
  sections: GuideSection[];
  faq: { q: string; a: string }[];
  relatedEffects: string[]; // preset slugs
  keywords: string[];
};

export const GUIDES: Guide[] = [
  {
    slug: "how-to-make-a-figure-spin-video",
    emoji: "🌀",
    title: "How to Make a 360° Spin Video of a Figure (No Turntable)",
    dek: "Turn one product photo into a smooth rotating showcase in a couple of minutes.",
    seoTitle: "How to Make a 360° Spin Video of a Figure | Pikbo",
    seoDescription:
      "A simple guide to creating a smooth 360° spin video of your figure or collectible from a single photo — no turntable, camera rig, or editing.",
    readMins: 3,
    intro:
      "A slow 360° spin is the single most useful video you can add to a toy listing or a collection post — it shows the piece from every angle and instantly reads as professional. Here's how to make one from a single photo, without a motorized turntable or any filming.",
    sections: [
      {
        h2: "1. Start with a clean product photo",
        paragraphs: [
          "The sharper your input, the sharper the spin. Shoot your figure front-on against a plain, uncluttered background with even lighting. Avoid harsh shadows and busy surfaces — they confuse the rotation.",
          "A phone photo is completely fine. What matters is that the whole figure is in frame, in focus, and clearly separated from the background.",
        ],
      },
      {
        h2: "2. Pick the spin effect and generate",
        paragraphs: [
          "Upload the photo, choose the 360° Spin Showcase effect, and generate. The figure is placed on a clean studio turntable and rotated smoothly — the look you'd normally need a rig and a photographer for.",
          "For marketplace galleries, export square; for TikTok Shop or Reels, export vertical. You can generate both from the same photo.",
        ],
      },
      {
        h2: "3. Use it where it converts",
        paragraphs: [
          "Add the spin to your product listing gallery, a storefront hero, or a 'new arrival' post. Listings with video consistently out-convert photo-only listings because buyers can see exactly what they're getting.",
          "Keep the clip short — around five seconds, looping — so it plays cleanly in a feed.",
        ],
      },
    ],
    faq: [
      {
        q: "Do I need a real turntable or 360 camera?",
        a: "No. The spin is generated from one photo, so there's no rig, lighting setup, or filming involved.",
      },
      {
        q: "What if my figure is asymmetrical?",
        a: "A clear front-facing photo still produces a convincing rotation. Very complex or transparent pieces may need a cleaner background to look their best.",
      },
    ],
    relatedEffects: ["360-spin-showcase", "floating-hero", "display-case-glam"],
    keywords: [
      "how to make a 360 spin video",
      "figure spin video",
      "product turntable video without rig",
    ],
  },
  {
    slug: "how-to-photograph-toys-for-ai-video",
    emoji: "📸",
    title: "How to Photograph Your Toys for the Best AI Video Results",
    dek: "Five quick photo habits that make every generated clip look sharper.",
    seoTitle: "How to Photograph Toys for AI Video | Pikbo",
    seoDescription:
      "Simple photo tips — lighting, background, angle, focus — that get you cleaner, more convincing AI video clips of your figures and collectibles.",
    readMins: 4,
    intro:
      "AI video is only as good as the photo you feed it. Spend two minutes getting the shot right and every effect — spin, dance, unboxing — comes out cleaner. These five habits make the biggest difference.",
    sections: [
      {
        h2: "1. Light it evenly",
        paragraphs: [
          "Soft, even light beats bright, direct light. A window with indirect daylight, or a cheap softbox, wraps the figure in gentle light and avoids blown-out highlights and hard shadows.",
          "Harsh single-source light creates deep shadows that the model can misread as part of the figure, which shows up as artifacts in motion.",
        ],
      },
      {
        h2: "2. Use a plain background",
        paragraphs: [
          "A clean, plain backdrop — white, grey, or a simple gradient — helps the figure separate cleanly from its surroundings. Busy shelves and patterned surfaces make edges ambiguous.",
          "If you want a scene effect like a neon city or a mini world, still start from a clean photo; the effect adds the world around your figure.",
        ],
      },
      {
        h2: "3. Fill the frame, stay in focus",
        paragraphs: [
          "Get close enough that the figure fills most of the frame, and tap to focus so the whole piece is sharp. Detail in equals detail out.",
          "Avoid extreme angles for showcase effects — a straight, eye-level front view rotates and animates most convincingly.",
        ],
      },
      {
        h2: "4. Shoot the packaging too (for unboxing)",
        paragraphs: [
          "If you want a blind box reveal, include a photo of the box or packaging. The effect animates the reveal around your real product art.",
        ],
      },
    ],
    faq: [
      {
        q: "Does phone photography work?",
        a: "Yes. A modern phone camera with good light and a clean background is more than enough.",
      },
      {
        q: "Should I edit the photo first?",
        a: "A light crop and exposure fix helps, but heavy filters can hurt — keep colors true to the real toy.",
      },
    ],
    relatedEffects: ["360-spin-showcase", "blind-box-unboxing", "display-case-glam"],
    keywords: [
      "how to photograph toys for video",
      "best photo for ai video",
      "figure photography tips",
    ],
  },
  {
    slug: "blind-box-video-ideas-for-tiktok",
    emoji: "📦",
    title: "10 Blind Box Video Ideas for TikTok (From One Photo)",
    dek: "Scroll-stopping clip ideas for sellers and collectors — no filming required.",
    seoTitle: "10 Blind Box Video Ideas for TikTok | Pikbo",
    seoDescription:
      "Ten blind box and designer toy video ideas for TikTok and Reels you can make from a single photo — reveals, dances, mini scenes, and more.",
    readMins: 4,
    intro:
      "Blind box content thrives on TikTok because the reveal is pure dopamine. You don't need a camera crew or a haul to post — here are ten clip ideas you can generate from a single photo, whether you're a seller hyping a drop or a collector showing a pull.",
    sections: [
      {
        h2: "Reveal-driven ideas (great openers)",
        paragraphs: [
          "1. The classic unboxing reveal — the lid lifts and the figure appears. Use it as the first three seconds of any post.",
          "2. The glowing mystery-box burst — a more dramatic, magical reveal with light and confetti, perfect for giveaways and 'guess what I pulled' posts.",
          "3. The claw-machine win — drop your figure into an arcade claw machine and land the grab for a playful, nostalgic hook.",
        ],
      },
      {
        h2: "Personality ideas (great for accounts)",
        paragraphs: [
          "4. Make it dance — a bouncing figure is endlessly shareable and gets your account in front of other collectors.",
          "5. Wave hello — a cute wink-and-wave makes a friendly intro clip for a series or a profile.",
          "6. Red-carpet paparazzi — treat your grail like a celebrity with flashing cameras for a viral, high-energy post.",
        ],
      },
      {
        h2: "Showcase & story ideas",
        paragraphs: [
          "7. A clean 360° spin for the product page or a 'restock' announcement.",
          "8. A mini cinematic scene — drop the figure into a tiny world for a storytelling post.",
          "9. A neon city night scene for an edgier, dramatic look.",
          "10. A shelf pan across your whole collection for a milestone or collection-tour post.",
        ],
      },
    ],
    faq: [
      {
        q: "Do I need to film anything?",
        a: "No — every idea here is generated from a single photo of a toy you own.",
      },
      {
        q: "What length works best on TikTok?",
        a: "Keep clips short and loopable — around five seconds — and lead with the strongest beat (usually the reveal).",
      },
    ],
    relatedEffects: ["blind-box-unboxing", "mystery-box-reveal", "make-figure-dance"],
    keywords: [
      "blind box video ideas",
      "tiktok toy video ideas",
      "designer toy content ideas",
    ],
  },
];

export function getGuide(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}
