import { DEMO_VIDEOS, type DemoVideo } from "@/lib/demoVideos";
import { PRESETS } from "@/lib/presets";
import { APPS } from "@/lib/catalog";

export type FeedItem = {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  badge?: string;
  ratio: "9:16" | "1:1" | "16:9" | "video";
  demo: DemoVideo;
  kind: "demo" | "preset" | "app";
};

/** Map every live path to looping demo video for HF-style density. */
export function buildVideoFeed(): FeedItem[] {
  const byPreset = new Map(DEMO_VIDEOS.map((d) => [d.preset, d]));
  const items: FeedItem[] = [];

  // 1) Real demos first (highest quality mapping)
  for (const d of DEMO_VIDEOS) {
    items.push({
      id: `demo-${d.id}`,
      title: d.title,
      subtitle: d.eyebrow,
      href: `/effects/${d.preset}`,
      badge: "Demo",
      ratio: d.ratio,
      demo: d,
      kind: "demo",
    });
  }

  // 2) Every preset as a video tile (cycle demos for coverage)
  PRESETS.forEach((p, i) => {
    if (byPreset.has(p.slug)) return; // already covered as demo
    const demo = DEMO_VIDEOS[i % DEMO_VIDEOS.length];
    items.push({
      id: `preset-${p.slug}`,
      title: p.name,
      subtitle: p.tagline,
      href: `/effects/${p.slug}`,
      badge: p.audience === "seller" ? "Sell" : "Flex",
      ratio: p.aspectRatio === "1:1" ? "1:1" : p.aspectRatio === "16:9" ? "16:9" : "9:16",
      demo,
      kind: "preset",
    });
  });

  // 3) Live apps
  APPS.filter((a) => a.live).forEach((a, i) => {
    const demo = DEMO_VIDEOS[i % DEMO_VIDEOS.length];
    items.push({
      id: `app-${a.id}`,
      title: a.name,
      subtitle: a.blurb,
      href: a.href,
      badge: "Live",
      ratio: "video",
      demo,
      kind: "app",
    });
  });

  return items;
}

export function featuredStrip(): FeedItem[] {
  return DEMO_VIDEOS.map((d) => ({
    id: `feat-${d.id}`,
    title: d.title,
    subtitle: d.result,
    href: `/effects/${d.preset}`,
    badge: d.eyebrow,
    ratio: d.ratio,
    demo: d,
    kind: "demo" as const,
  }));
}
