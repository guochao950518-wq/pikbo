/**
 * Product catalog mirroring Higgsfield-class AI suites:
 * models shelf + one-click apps + studio modes.
 * Branding is Pikbo; feature surface matches the big apps.
 */

export type CatalogModel = {
  id: string;
  name: string;
  vendor: string;
  kind: "video" | "image" | "audio" | "agent";
  tag?: string;
  blurb: string;
  href: string;
  gradient: string;
  /** Wired to live generate path */
  live?: boolean;
  falId?: string;
};

export type CatalogApp = {
  id: string;
  name: string;
  emoji: string;
  blurb: string;
  href: string;
  category: "video" | "image" | "edit" | "studio";
  live?: boolean;
};

/** Models shelf — names match what users see on big platforms; only Seedance paths are live. */
export const MODELS: CatalogModel[] = [
  {
    id: "seedance-2",
    name: "Seedance 2.0",
    vendor: "ByteDance",
    kind: "video",
    tag: "Featured",
    blurb: "Flagship image-to-video. Default engine for Generate.",
    href: "/create?model=seedance-2",
    gradient: "linear-gradient(135deg,#6ee7c7,#a855f7)",
    live: true,
    falId: "bytedance/seedance-2.0/image-to-video",
  },
  {
    id: "seedance-fast",
    name: "Seedance Fast",
    vendor: "ByteDance",
    kind: "video",
    tag: "Free tier",
    blurb: "Lower latency path for free credits.",
    href: "/create?model=seedance-fast",
    gradient: "linear-gradient(135deg,#d6ff4d,#6ee7c7)",
    live: true,
    falId: "bytedance/seedance-2.0/fast/image-to-video",
  },
  {
    id: "kling",
    name: "Kling",
    vendor: "Kuaishou",
    kind: "video",
    tag: "Soon",
    blurb: "Cinematic physics model — slot ready, not default.",
    href: "/create",
    gradient: "linear-gradient(135deg,#3b82f6,#1e1b4b)",
  },
  {
    id: "veo",
    name: "Veo",
    vendor: "Google",
    kind: "video",
    tag: "Soon",
    blurb: "Multi-input video generation (catalog placeholder).",
    href: "/models",
    gradient: "linear-gradient(135deg,#60a5fa,#312e81)",
  },
  {
    id: "sora",
    name: "Sora",
    vendor: "OpenAI",
    kind: "video",
    tag: "Soon",
    blurb: "Long-form generative video (catalog placeholder).",
    href: "/models",
    gradient: "linear-gradient(135deg,#a78bfa,#4c1d95)",
  },
  {
    id: "seedream",
    name: "Seedream",
    vendor: "ByteDance",
    kind: "image",
    tag: "Image",
    blurb: "ByteDance image model entry — opens Image studio.",
    href: "/image",
    gradient: "linear-gradient(135deg,#f472b6,#7c3aed)",
  },
  {
    id: "nano-banana",
    name: "Nano Banana Pro",
    vendor: "Partner",
    kind: "image",
    tag: "Image",
    blurb: "Fast image generations (UI parity; backend optional).",
    href: "/image",
    gradient: "linear-gradient(135deg,#fbbf24,#f97316)",
  },
  {
    id: "flux",
    name: "Flux",
    vendor: "Black Forest",
    kind: "image",
    tag: "Image",
    blurb: "High-detail stills for product boards.",
    href: "/image",
    gradient: "linear-gradient(135deg,#34d399,#0f766e)",
  },
];

export const APPS: CatalogApp[] = [
  {
    id: "image-to-video",
    name: "Image to Video",
    emoji: "🎬",
    blurb: "Animate a still with Seedance.",
    href: "/create",
    category: "video",
    live: true,
  },
  {
    id: "text-to-video",
    name: "Text to Video",
    emoji: "✍️",
    blurb: "Prompt-only video (UI live; engine rolls out).",
    href: "/create?mode=t2v",
    category: "video",
  },
  {
    id: "cinema",
    name: "Cinema Studio",
    emoji: "🎥",
    blurb: "Shot list, lens, camera language workspace.",
    href: "/cinema",
    category: "studio",
    live: true,
  },
  {
    id: "viral-presets",
    name: "Viral Presets",
    emoji: "⚡",
    blurb: "One-tap effect recipes.",
    href: "/effects",
    category: "video",
    live: true,
  },
  {
    id: "product-spin",
    name: "Product Spin",
    emoji: "🌀",
    blurb: "360° product / figure showcase.",
    href: "/create?effect=360-spin-showcase",
    category: "video",
    live: true,
  },
  {
    id: "unbox",
    name: "Unbox Reveal",
    emoji: "📦",
    blurb: "Reveal beat for blind boxes.",
    href: "/create?effect=blind-box-unboxing",
    category: "video",
    live: true,
  },
  {
    id: "image-studio",
    name: "Image Studio",
    emoji: "🖼️",
    blurb: "Still generation board.",
    href: "/image",
    category: "image",
  },
  {
    id: "face-swap",
    name: "Face Swap",
    emoji: "🎭",
    blurb: "Swap faces in a frame (stub app).",
    href: "/apps/face-swap",
    category: "edit",
  },
  {
    id: "lipsync",
    name: "Lipsync",
    emoji: "🎙️",
    blurb: "Talking-head style clips (stub).",
    href: "/apps/lipsync",
    category: "edit",
  },
  {
    id: "upscale",
    name: "Upscale",
    emoji: "🔍",
    blurb: "Enhance resolution (stub).",
    href: "/apps/upscale",
    category: "edit",
  },
  {
    id: "storyboard",
    name: "Storyboard",
    emoji: "📋",
    blurb: "Multi-shot board for Cinema.",
    href: "/cinema",
    category: "studio",
    live: true,
  },
  {
    id: "supercomputer",
    name: "Supercomputer",
    emoji: "🧠",
    blurb: "Agent / automation surface.",
    href: "/supercomputer",
    category: "studio",
  },
];

export function modelsByKind(kind: CatalogModel["kind"]) {
  return MODELS.filter((m) => m.kind === kind);
}

export function appsByCategory(cat: CatalogApp["category"]) {
  return APPS.filter((a) => a.category === cat);
}
