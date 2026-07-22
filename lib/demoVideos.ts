export type DemoVideo = {
  id: string;
  title: string;
  character: string;
  eyebrow: string;
  result: string;
  preset: string;
  ratio: "9:16" | "1:1" | "16:9";
  poster: string;
  mp4: string;
  webm: string;
  accent: string;
};

/**
 * Original Pikbo prototype footage. These are cached product demos, so homepage
 * playback never invokes fal.ai and demo mode remains useful without FAL_KEY.
 */
export const DEMO_VIDEOS: DemoVideo[] = [
  {
    id: "orbit-cgi",
    title: "Zero-gravity product hero",
    character: "Orbit",
    eyebrow: "Product showcase",
    result: "A clean launch visual from one owned-toy photo.",
    preset: "floating-hero",
    ratio: "9:16",
    poster: "/demos/orbit-still.webp",
    mp4: "/demos/orbit-hyper-cgi.mp4",
    webm: "/demos/orbit-hyper-cgi.webm",
    accent: "#b8a3ff",
  },
  {
    id: "moon-reveal",
    title: "Blind-box reveal",
    character: "Moon",
    eyebrow: "Unboxing",
    result: "A punchy reveal loop for Reels, Shorts, and listings.",
    preset: "blind-box-unboxing",
    ratio: "9:16",
    poster: "/demos/moon-float.webp",
    mp4: "/demos/moon-box-reveal.mp4",
    webm: "/demos/moon-box-reveal.webm",
    accent: "#83f3d2",
  },
  {
    id: "scout-story",
    title: "Miniature story world",
    character: "Scout",
    eyebrow: "Story scene",
    result: "Turn a shelf character into a tiny cinematic moment.",
    preset: "miniature-scene",
    ratio: "16:9",
    poster: "/demos/scout-still.webp",
    mp4: "/demos/scout-story-mode.mp4",
    webm: "/demos/scout-story-mode.webm",
    accent: "#ffd36a",
  },
  {
    id: "beatbot-hook",
    title: "Drop-day viral hook",
    character: "Beatbot",
    eyebrow: "Social hook",
    result: "Front-load the motion and make the first second count.",
    preset: "paparazzi-flash",
    ratio: "9:16",
    poster: "/demos/beatbot-still.webp",
    mp4: "/demos/beatbot-viral-hook.mp4",
    webm: "/demos/beatbot-viral-hook.webm",
    accent: "#ff6ea8",
  },
  {
    id: "scout-spin",
    title: "Listing-ready spin",
    character: "Scout",
    eyebrow: "Marketplace",
    result: "Show the silhouette and finish without filming a turntable.",
    preset: "360-spin-showcase",
    ratio: "1:1",
    poster: "/demos/scout-still.webp",
    mp4: "/demos/scout-packshot-spin.mp4",
    webm: "/demos/scout-packshot-spin.webm",
    accent: "#ff9f6e",
  },
  {
    id: "beatbot-unboxed",
    title: "Collector unboxing cut",
    character: "Beatbot",
    eyebrow: "Launch content",
    result: "Reuse one toy photo across a second sales-ready format.",
    preset: "mystery-box-reveal",
    ratio: "9:16",
    poster: "/demos/beatbot-still.webp",
    mp4: "/demos/beatbot-unboxed.mp4",
    webm: "/demos/beatbot-unboxed.webm",
    accent: "#74e4ff",
  },
];
