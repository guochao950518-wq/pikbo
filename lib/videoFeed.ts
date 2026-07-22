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
  visibility: "Concept" | "Official";
  author: { name: string; initials: string; badge?: string };
  demo: DemoVideo;
};

function demoForIndex(i: number): DemoVideo {
  return DEMO_VIDEOS[i % DEMO_VIDEOS.length];
}

function createHref(presetSlug: string) {
  return `/create?effect=${encodeURIComponent(presetSlug)}`;
}

/** Build a dense HF-style wall — every preset is a card with autoplay Lab loop. */
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
      badge: "Cached Lab",
      ratio: d.ratio,
      demo: d,
      kind: "demo",
      category: preset?.category,
    });
  }

  // Every remaining recipe gets a card so the wall feels full of video
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

  // Density passes — remixed Lab loops so the wall feels full of motion
  // (same zero-cost cached demos; these are concept previews for a recipe)
  for (const pass of [1, 2, 3]) {
    PRESETS.forEach((p, i) => {
      if ((i + pass) % 2 === 0 && pass > 1) return;
      const demo = demoForIndex(i + pass * 2);
      items.push({
        id: `dense-${pass}-${p.slug}`,
        title: viralName(p.slug, p.name),
        subtitle: `${p.emoji} ${p.tagline}`,
        href: createHref(p.slug),
        detailHref: `/effects/${p.slug}`,
        badge: "Concept · shared loop",
        ratio: (i + pass) % 3 === 0 ? "9:16" : (i + pass) % 3 === 1 ? "1:1" : "16:9",
        demo,
        kind: "preset",
        category: p.category,
      });
    });
  }

  return items;
}

export function featuredStrip(): FeedItem[] {
  return DEMO_VIDEOS.map((d) => ({
    id: `feat-${d.id}`,
    title: viralName(d.preset, d.title),
    subtitle: d.result,
    href: createHref(d.preset),
    detailHref: `/effects/${d.preset}`,
    badge: "Cached Lab",
    ratio: d.ratio,
    demo: d,
    kind: "demo" as const,
  }));
}

/** PIKBO Lab projects only; no user identity or engagement is fabricated. */
export function communityProjects(): CommunityProject[] {
  const base = DEMO_VIDEOS.map((d) => ({
    id: `proj-${d.id}`,
    title: `${d.character} · ${viralName(d.preset, d.title)}`,
    look: d.eyebrow,
    remakeHref: createHref(d.preset),
    detailHref: `/effects/${d.preset}`,
    visibility: "Official" as const,
    author: {
      name: "Pikbo Lab",
      initials: "P",
      badge: "Official",
    },
    demo: d,
  }));

  // Extra project cards so the HF-style rail feels full (remixed Lab loops)
  const extras = PRESETS.map((p, i) => {
    const demo = demoForIndex(i + 1);
    return {
      id: `proj-extra-${p.slug}`,
      title: viralName(p.slug, p.name),
      look: p.tagline,
      remakeHref: createHref(p.slug),
      detailHref: `/effects/${p.slug}`,
      visibility: "Concept" as const,
      author: {
        name: "Pikbo Lab",
        initials: "P",
        badge: "Concept",
      },
      demo,
    };
  });

  return [...base, ...extras];
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
      badge: mapped ? "Lab example" : "Concept",
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
