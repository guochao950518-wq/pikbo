// A THIRD programmatic page type: toy-type / subject pages at /toys/[slug].
// This is the "subject" keyword axis — people search by what they OWN
// ("action figure video", "plush video", "anime figure video"). Each page
// cross-links to the effects that suit that toy type.
//
// Site keyword mesh is now: Effects × Use-cases × Toy-types.

import type { Audience } from "./presets";

export type ToyType = {
  slug: string;
  emoji: string;
  label: string;
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

export const TOY_TYPES: ToyType[] = [
  {
    slug: "action-figures",
    emoji: "🦸",
    label: "Action figures",
    audience: "collector",
    h1: "Action Figure Video Maker",
    seoTitle: "Action Figure Video Maker — Animate Your Figures | Pikbo",
    seoDescription:
      "Make your action figures walk, dance, and pose. Upload one photo and animate the figure you own — no rig, no stop-motion setup.",
    intro:
      "Action figures are made to move. Pikbo animates the figure you own from a single photo — a confident walk, a dance, or a cinematic scene — without a stop-motion rig.",
    body: [
      "Unlike 'turn yourself into an action figure' filters, Pikbo animates your actual figure, keeping its real sculpt, paint, and details.",
      "Great for articulated figures, mecha, and character collectibles you want to bring to life for your feed.",
    ],
    keywords: [
      "action figure video maker",
      "animate action figure",
      "make action figure move video",
    ],
    recommendedEffects: ["make-figure-walk", "make-figure-dance", "neon-city-night"],
    faq: [
      {
        q: "Does it animate my figure or generate a new one?",
        a: "It animates the figure in your photo — same sculpt and colors — rather than generating a generic character.",
      },
    ],
  },
  {
    slug: "plush-toys",
    emoji: "🧸",
    label: "Plush toys",
    audience: "collector",
    h1: "Plush & Plushie Video Maker",
    seoTitle: "Plush & Plushie Video Maker | Pikbo",
    seoDescription:
      "Bring your plush toys and stuffed animals to life. Squishy, bouncy come-alive videos from one photo — made for the plushie community.",
    intro:
      "Plush toys have endless personality. Pikbo makes your plushie squish, bounce, and come alive from a single photo, keeping its exact soft look.",
    body: [
      "Built for stuffed animals, beanies, and soft collectibles — the huggable motion suits plush better than any generic filter.",
      "Perfect for gifts, keepsakes, and 'meet my plushie' posts.",
    ],
    keywords: [
      "plush video maker",
      "plushie animation",
      "stuffed animal video",
    ],
    recommendedEffects: ["plushie-comes-alive", "claw-machine-win", "toy-wave-hello"],
    faq: [
      {
        q: "Does it keep my plush's exact look?",
        a: "Yes — it animates the plush in your photo, keeping its real shape, colors, and softness.",
      },
    ],
  },
  {
    slug: "art-toys",
    emoji: "🎨",
    label: "Art toys",
    audience: "seller",
    h1: "Art Toy & Designer Toy Video Maker",
    seoTitle: "Art Toy & Designer Toy Video Maker | Pikbo",
    seoDescription:
      "Give your art toys and designer vinyl the premium video they deserve. Spins, glam lighting, and stop-motion from one photo.",
    intro:
      "Art toys deserve a premium presentation. Pikbo turns one photo of your designer vinyl, resin, or sofubi into a clean spin, glam lighting, or handcrafted stop-motion clip.",
    body: [
      "Ideal for indie makers and resellers who want a consistent, high-end look across a drop.",
      "The stop-motion and glam effects suit the collectible, gallery-piece feel of art toys.",
    ],
    keywords: [
      "art toy video",
      "designer toy video maker",
      "vinyl toy video",
    ],
    recommendedEffects: ["360-spin-showcase", "display-case-glam", "stop-motion-style"],
    faq: [
      {
        q: "Does it work with resin and sofubi?",
        a: "Yes — any art toy photographed clearly works. Glossy resin especially shines with the glam lighting effect.",
      },
    ],
  },
  {
    slug: "anime-figures",
    emoji: "⛩️",
    label: "Anime figures",
    audience: "collector",
    h1: "Anime Figure Video Maker",
    seoTitle: "Anime Figure Video Maker | Pikbo",
    seoDescription:
      "Show off your anime figures with cinematic video. Floating hero shots, glam lighting, and mini scenes from a single photo.",
    intro:
      "Your anime figures deserve more than a shelf photo. Pikbo turns one shot into a floating hero, glam-lit showcase, or tiny cinematic scene that does the sculpt justice.",
    body: [
      "Built for scale figures, prize figures, and garage kits where the detail and pose are the star.",
      "A cinematic clip makes a grail piece feel special and gets your collection noticed.",
    ],
    keywords: [
      "anime figure video",
      "scale figure video maker",
      "figure showcase video",
    ],
    recommendedEffects: ["display-case-glam", "floating-hero", "miniature-scene"],
    faq: [
      {
        q: "Is it good for detailed scale figures?",
        a: "Yes — the showcase effects keep your figure sharp while adding cinematic lighting and motion around it.",
      },
    ],
  },
  {
    slug: "vinyl-figures",
    emoji: "🧊",
    label: "Vinyl figures",
    audience: "collector",
    h1: "Vinyl Figure Video Maker",
    seoTitle: "Vinyl Figure Video Maker | Pikbo",
    seoDescription:
      "Bring your vinyl figures to life. Spin, dance, and glam videos that show off the glossy finish — from a single photo.",
    intro:
      "Vinyl figures have that clean, glossy look that loves the camera. Pikbo turns one photo into a spin, dance, or glam-lit clip that shows your vinyl at its best.",
    body: [
      "Perfect for stylized designer vinyl and character collectibles where the finish and pose are the appeal.",
      "Animate the figure you own — the exact colors and sculpt — instead of a generic look-alike.",
    ],
    keywords: [
      "vinyl figure video",
      "vinyl toy animation",
      "designer vinyl video maker",
    ],
    recommendedEffects: ["360-spin-showcase", "make-figure-dance", "display-case-glam"],
    faq: [
      {
        q: "Does the glossy finish come through?",
        a: "Yes — the glam and spin effects add lighting that plays up the reflective vinyl finish.",
      },
    ],
  },
  {
    slug: "resin-sofubi",
    emoji: "🫗",
    label: "Resin & sofubi",
    audience: "seller",
    h1: "Resin & Sofubi Figure Video Maker",
    seoTitle: "Resin & Sofubi Figure Video Maker | Pikbo",
    seoDescription:
      "Give your resin art toys, sofubi, and garage kits a premium video. Glam lighting, stop-motion, and mini scenes from one photo.",
    intro:
      "Resin and sofubi have a handmade, collectible soul. Pikbo turns one photo of your garage kit or soft-vinyl art toy into a glam-lit, stop-motion, or cinematic-scene clip worthy of the craft.",
    body: [
      "Ideal for indie sculptors and small-run drops where each piece is special.",
      "The stop-motion look especially suits the tactile, handmade feel of resin and sofubi.",
    ],
    keywords: [
      "sofubi video",
      "resin figure video",
      "garage kit video maker",
    ],
    recommendedEffects: ["display-case-glam", "stop-motion-style", "miniature-scene"],
    faq: [
      {
        q: "Good for one-off custom pieces?",
        a: "Yes — a single photo of a custom resin or sofubi piece is all you need for a premium clip.",
      },
    ],
  },
  {
    slug: "model-kits",
    emoji: "🤖",
    label: "Model kits",
    audience: "collector",
    h1: "Gunpla & Model Kit Video Maker",
    seoTitle: "Gunpla & Model Kit Video Maker | Pikbo",
    seoDescription:
      "Show off your finished builds. Turn one photo of your model kit into a dynamic walk, neon scene, or spin video — no rig required.",
    intro:
      "You spent hours on that build — give it a video to match. Pikbo turns one photo of your finished model kit into a dynamic walk, neon cityscape, or clean spin that does the work justice.",
    body: [
      "Made for builders showing off completed kits, mecha, and dioramas.",
      "Pair a walk or neon scene with your build reveal to make the post pop.",
    ],
    keywords: [
      "gunpla video",
      "model kit video maker",
      "mecha figure video",
    ],
    recommendedEffects: ["make-figure-walk", "neon-city-night", "360-spin-showcase"],
    faq: [
      {
        q: "Does it work with custom paint jobs?",
        a: "Yes — it animates your actual build, keeping your paint, decals, and weathering intact.",
      },
    ],
  },
];

export function getToyType(slug: string): ToyType | undefined {
  return TOY_TYPES.find((t) => t.slug === slug);
}
