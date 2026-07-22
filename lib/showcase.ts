import { DEMO_VIDEOS } from "@/lib/demoVideos";
import { getPreset } from "@/lib/presets";

export type ShowcaseCategory =
  | "product-cgi"
  | "unboxing"
  | "come-alive"
  | "shop-hooks";

export type ShowcaseProof = "verified" | "lab";

export type ShowcaseProject = {
  id: string;
  slug: string;
  title: string;
  character: string;
  category: ShowcaseCategory;
  presetId: string;
  presetName: string;
  inputAssets: Array<{ role: "front" | "side" | "back" | "packaging"; url: string }>;
  output: { poster: string; mp4: string; webm: string };
  model: string;
  duration: 5 | 10;
  aspectRatio: "9:16" | "1:1" | "16:9";
  resolution: "480p" | "720p" | "1080p";
  promptSummary: string;
  generationMs: number | null;
  providerTaskId: string | null;
  proof: ShowcaseProof;
  channel: string;
  result: string;
  accent: string;
};

const PROJECT_DETAILS: Record<
  string,
  Pick<ShowcaseProject, "category" | "channel" | "promptSummary">
> = {
  "orbit-cgi": {
    category: "product-cgi",
    channel: "Product launch",
    promptSummary: "Levitate the owned figure with a slow premium orbit and restrained studio lighting.",
  },
  "moon-reveal": {
    category: "unboxing",
    channel: "Reels · Shorts",
    promptSummary: "Open the box, reveal the exact figure, then settle into a clean product frame.",
  },
  "scout-story": {
    category: "come-alive",
    channel: "Brand story",
    promptSummary: "Place the owned figure in a miniature environment with one clear cinematic action.",
  },
  "beatbot-hook": {
    category: "shop-hooks",
    channel: "TikTok Shop",
    promptSummary: "Front-load flashes and motion while keeping the toy identity readable.",
  },
  "scout-spin": {
    category: "product-cgi",
    channel: "Marketplace listing",
    promptSummary: "Center the figure and show a restrained turntable-style product rotation.",
  },
  "beatbot-unboxed": {
    category: "unboxing",
    channel: "Drop announcement",
    promptSummary: "Build anticipation around the packaging, then land on the exact owned figure.",
  },
};

export const SHOWCASE_PROJECTS: ShowcaseProject[] = DEMO_VIDEOS.map((demo) => {
  const preset = getPreset(demo.preset);
  const detail = PROJECT_DETAILS[demo.id];
  return {
    id: demo.id,
    slug: demo.id,
    title: demo.title,
    character: demo.character,
    category: detail.category,
    presetId: demo.preset,
    presetName: preset?.name ?? demo.eyebrow,
    inputAssets: [{ role: "front", url: demo.poster }],
    output: { poster: demo.poster, mp4: demo.mp4, webm: demo.webm },
    model: "Cached PIKBO Lab prototype",
    duration: preset?.duration ?? 5,
    aspectRatio: demo.ratio,
    resolution: "720p",
    promptSummary: detail.promptSummary,
    generationMs: null,
    providerTaskId: null,
    proof: "lab",
    channel: detail.channel,
    result: demo.result,
    accent: demo.accent,
  };
});

export const SHOWCASE_CATEGORIES: Array<{
  id: "all" | ShowcaseCategory;
  label: string;
}> = [
  { id: "all", label: "All" },
  { id: "unboxing", label: "Unboxing" },
  { id: "product-cgi", label: "Product CGI" },
  { id: "come-alive", label: "Come Alive" },
  { id: "shop-hooks", label: "Shop Hooks" },
];

export function getShowcaseProject(slug: string) {
  return SHOWCASE_PROJECTS.find((project) => project.slug === slug);
}
