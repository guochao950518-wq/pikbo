import { DEMO_VIDEOS, type DemoVideo } from "@/lib/demoVideos";
import { PRESETS, CATEGORIES, type CategoryId } from "@/lib/presets";

export type FeedItem = {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  badge?: string;
  ratio: "9:16" | "1:1" | "16:9" | "video";
  demo: DemoVideo;
  kind: "demo" | "preset" | "app" | "model";
};

/** Build the public feed from clips that have an exact preset match only. */
export function buildVideoFeed(): FeedItem[] {
  return DEMO_VIDEOS.map((d) => ({
      id: `demo-${d.id}`,
      title: d.title,
      subtitle: d.eyebrow,
      href: `/effects/${d.preset}`,
      badge: "PIKBO Lab",
      ratio: d.ratio,
      demo: d,
      kind: "demo",
    }));
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

/** Wide rail of the same verified-to-preset Lab clips. */
export function suiteRail(): FeedItem[] {
  return featuredStrip().map((item) => ({ ...item, ratio: "16:9" as const }));
}

export function feedByCategory(cat: CategoryId): FeedItem[] {
  const presets = new Map(PRESETS.map((preset) => [preset.slug, preset]));
  return DEMO_VIDEOS.filter((demo) => presets.get(demo.preset)?.category === cat).map(
    (demo) => {
      const preset = presets.get(demo.preset)!;
      return {
      id: `cat-${cat}-${preset.slug}`,
      title: preset.name,
      subtitle: preset.tagline,
      href: `/effects/${preset.slug}`,
      badge: "PIKBO Lab",
      ratio:
        preset.aspectRatio === "1:1"
          ? "1:1"
          : preset.aspectRatio === "16:9"
            ? "16:9"
            : "9:16",
      demo,
      kind: "demo" as const,
    };
    },
  );
}

export function allCategoryFeeds() {
  return CATEGORIES.map((c) => ({
    category: c,
    items: feedByCategory(c.id),
  }));
}
