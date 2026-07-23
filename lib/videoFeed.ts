import { DEMO_VIDEOS, type DemoVideo } from "@/lib/demoVideos";
import { PRESETS, CATEGORIES, type CategoryId } from "@/lib/presets";
import { APPS } from "@/lib/catalog";
import { MODELS } from "@/lib/catalog";
import { viralName } from "@/lib/viralNames";

export type FeedItem = {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  /** SEO / detail page when href is generate */
  detailHref?: string;
  badge?: string;
  ratio: "9:16" | "1:1" | "16:9" | "video";
  demo: DemoVideo;
  kind: "demo" | "preset" | "app" | "model";
  category?: CategoryId;
};

export type CommunityProject = {
  id: string;
  title: string;
  look: string;
  remakeHref: string;
  detailHref: string;
  visibility: "Concept" | "Official example";
  author: { name: string; initials: string; badge?: string };
  demo: DemoVideo;
};

function demoForIndex(i: number): DemoVideo {
  return DEMO_VIDEOS[i % DEMO_VIDEOS.length];
}

function createHref(presetSlug: string) {
  return `/create?effect=${encodeURIComponent(presetSlug)}`;
}

/** Soft-launch homepage showcase cap (G2). GPT may replace with an exact slug whitelist. */
export const HOME_SHOWCASE_LIMIT = 8;

/**
 * Homepage main proof wall — at most 8 cards, each with its own Lab demo asset.
 * No shared-loop density fills. Prefer sparse real cards over fake walls.
 */
export function buildHomeShowcaseFeed(
  limit = HOME_SHOWCASE_LIMIT
): FeedItem[] {
  const seenMp4 = new Set<string>();
  const items: FeedItem[] = [];

  for (const d of DEMO_VIDEOS) {
    if (items.length >= limit) break;
    if (seenMp4.has(d.mp4)) continue;
    seenMp4.add(d.mp4);
    const preset = PRESETS.find((p) => p.slug === d.preset);
    items.push({
      id: `home-${d.id}`,
      title: viralName(d.preset, d.title),
      subtitle: d.character,
      href: createHref(d.preset),
      detailHref: `/effects/${d.preset}`,
      badge: "Official example · cached",
      ratio: d.ratio,
      demo: d,
      kind: "demo",
      category: preset?.category,
    });
  }

  return items;
}

/**
 * Lab / Feed catalog — one card per Lab demo + one concept card per remaining
 * preset. No multi-pass density remounts of the same mp4.
 */
export function buildVideoFeed(): FeedItem[] {
  const byPreset = new Map(DEMO_VIDEOS.map((d) => [d.preset, d]));
  const items: FeedItem[] = [];

  // Cached PIKBO Lab demos first (the media shown is the media described)
  for (const d of DEMO_VIDEOS) {
    const preset = PRESETS.find((p) => p.slug === d.preset);
    items.push({
      id: `demo-${d.id}`,
      title: viralName(d.preset, d.title),
      subtitle: d.character,
      href: createHref(d.preset),
      detailHref: `/effects/${d.preset}`,
      badge: "Official example · cached",
      ratio: d.ratio,
      demo: d,
      kind: "demo",
      category: preset?.category,
    });
  }

  // Remaining recipes once each — labeled concept, not fake UGC density
  PRESETS.forEach((p, i) => {
    if (byPreset.has(p.slug)) return;
    const demo = demoForIndex(i);
    items.push({
      id: `preset-${p.slug}`,
      title: viralName(p.slug, p.name),
      subtitle: p.tagline,
      href: createHref(p.slug),
      detailHref: `/effects/${p.slug}`,
      badge: "Concept · shared loop",
      ratio:
        p.aspectRatio === "1:1"
          ? "1:1"
          : p.aspectRatio === "16:9"
            ? "16:9"
            : "9:16",
      demo,
      kind: "preset",
      category: p.category,
    });
  });

  return items;
}

export function featuredStrip(): FeedItem[] {
  return DEMO_VIDEOS.map((d) => ({
    id: `feat-${d.id}`,
    title: viralName(d.preset, d.title),
    subtitle: d.result,
    href: createHref(d.preset),
    detailHref: `/effects/${d.preset}`,
    badge: "Official example · cached",
    ratio: d.ratio,
    demo: d,
    kind: "demo" as const,
  }));
}

/** PIKBO Lab projects only; no user identity or engagement is fabricated. */
export function communityProjects(): CommunityProject[] {
  // Official Lab demos only — no remixed concept filler that reuses loops.
  return DEMO_VIDEOS.map((d) => ({
    id: `proj-${d.id}`,
    title: `${d.character} · ${viralName(d.preset, d.title)}`,
    look: d.eyebrow,
    remakeHref: createHref(d.preset),
    detailHref: `/effects/${d.preset}`,
    visibility: "Official example" as const,
    author: {
      name: "Pikbo Lab",
      initials: "P",
      badge: "Pikbo Lab",
    },
    demo: d,
  }));
}

/** Wide HF-style app / model promo rail */
export function suiteRail(): FeedItem[] {
  const apps = APPS.filter((a) => a.live).map((a, i) => ({
    id: `suite-app-${a.id}`,
    title: a.name,
    subtitle: a.blurb,
    href: a.href,
      badge: "Configured · cached preview",
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
      badge: "Configured · cached preview",
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
      title: viralName(p.slug, p.name),
      subtitle: mapped
        ? p.tagline
        : `Concept recipe · shared Lab loop · ${p.tagline}`,
      href: createHref(p.slug),
      detailHref: `/effects/${p.slug}`,
      badge: mapped ? "Official example" : "Concept",
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
