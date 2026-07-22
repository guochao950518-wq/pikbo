import { DEMO_VIDEOS, type DemoVideo } from "@/lib/demoVideos";
import { PRESETS, CATEGORIES, type CategoryId } from "@/lib/presets";
import { APPS } from "@/lib/catalog";
import { MODELS } from "@/lib/catalog";

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

function demoForIndex(i: number): DemoVideo {
  return DEMO_VIDEOS[i % DEMO_VIDEOS.length];
}

/** Map every live path to looping demo video for HF-style density. */
export function buildVideoFeed(): FeedItem[] {
  const byPreset = new Map(DEMO_VIDEOS.map((d) => [d.preset, d]));
  const items: FeedItem[] = [];

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

  PRESETS.forEach((p, i) => {
    if (byPreset.has(p.slug)) return;
    const demo = demoForIndex(i);
    items.push({
      id: `preset-${p.slug}`,
      title: p.name,
      subtitle: p.tagline,
      href: `/effects/${p.slug}`,
      badge: p.audience === "seller" ? "Sell" : "Flex",
      ratio:
        p.aspectRatio === "1:1"
          ? "1:1"
          : p.aspectRatio === "16:9"
            ? "16:9"
            : "9:16",
      demo,
      kind: "preset",
    });
  });

  APPS.filter((a) => a.live).forEach((a, i) => {
    items.push({
      id: `app-${a.id}`,
      title: a.name,
      subtitle: a.blurb,
      href: a.href,
      badge: "Live",
      ratio: "video",
      demo: demoForIndex(i + 2),
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

/** Wide HF-style app / model promo rail */
export function suiteRail(): FeedItem[] {
  const apps = APPS.filter((a) => a.live).map((a, i) => ({
    id: `suite-app-${a.id}`,
    title: a.name,
    subtitle: a.blurb,
    href: a.href,
    badge: "App",
    ratio: "16:9" as const,
    demo: demoForIndex(i),
    kind: "app" as const,
  }));

  const models = MODELS.filter((m) => m.live)
    .slice(0, 4)
    .map((m, i) => ({
      id: `suite-model-${m.id}`,
      title: m.name,
      subtitle: m.blurb,
      href: m.href,
      badge: "Model",
      ratio: "16:9" as const,
      demo: demoForIndex(i + 1),
      kind: "model" as const,
    }));

  return [...models, ...apps];
}

export function feedByCategory(cat: CategoryId): FeedItem[] {
  return PRESETS.filter((p) => p.category === cat).map((p, i) => {
    const mapped = DEMO_VIDEOS.find((d) => d.preset === p.slug);
    const demo = mapped ?? demoForIndex(i + cat.length);
    return {
      id: `cat-${cat}-${p.slug}`,
      title: p.name,
      subtitle: p.tagline,
      href: `/effects/${p.slug}`,
      badge: p.emoji,
      ratio:
        p.aspectRatio === "1:1"
          ? "1:1"
          : p.aspectRatio === "16:9"
            ? "16:9"
            : "9:16",
      demo,
      kind: "preset" as const,
    };
  });
}

export function allCategoryFeeds() {
  return CATEGORIES.map((c) => ({
    category: c,
    items: feedByCategory(c.id),
  }));
}
