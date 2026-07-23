import { DEMO_VIDEOS, type DemoVideo } from "@/lib/demoVideos";
import { PRESETS, CATEGORIES, type CategoryId } from "@/lib/presets";
import { APPS } from "@/lib/catalog";
import { MODELS } from "@/lib/catalog";
import { viralName } from "@/lib/viralNames";
import {
  HOME_PROOF_BADGE,
  HOME_PROOF_LIMIT,
  HOME_PROOF_SLUGS,
  isHomeProofSlug,
} from "@/lib/softLaunch";
import { createRemixHref } from "@/lib/remixIntent";

export type FeedItem = {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  /** SEO / detail page when href is generate */
  detailHref?: string;
  /** Project inspect page (official Lab) */
  projectHref?: string;
  badge?: string;
  ratio: "9:16" | "1:1" | "16:9" | "video";
  demo: DemoVideo;
  kind: "demo" | "preset" | "app" | "model";
  category?: CategoryId;
  recipeSlug?: string;
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

function createHref(presetSlug: string, sourceId?: string) {
  return createRemixHref(presetSlug, sourceId);
}

/** Soft-launch homepage showcase cap (G2) — frozen by SOFT_NAV_AND_PRESETS. */
export const HOME_SHOWCASE_LIMIT = HOME_PROOF_LIMIT;

/**
 * Homepage main proof wall — only the product-whitelisted 8 slugs, each with a
 * unique Lab demo asset. No shared-loop density fills.
 */
export function buildHomeShowcaseFeed(
  limit = HOME_SHOWCASE_LIMIT
): FeedItem[] {
  const byPreset = new Map(DEMO_VIDEOS.map((d) => [d.preset, d]));
  const seenMp4 = new Set<string>();
  const items: FeedItem[] = [];

  for (const slug of HOME_PROOF_SLUGS) {
    if (items.length >= limit) break;
    if (!isHomeProofSlug(slug)) continue;
    const d = byPreset.get(slug);
    if (!d) continue; // recipe without approved footage stays off the wall
    if (seenMp4.has(d.mp4)) continue;
    seenMp4.add(d.mp4);
    const preset = PRESETS.find((p) => p.slug === d.preset);
    items.push({
      id: `home-${d.id}`,
      title: viralName(d.preset, d.title),
      subtitle: d.character,
      href: createHref(d.preset, d.id),
      detailHref: `/effects/${d.preset}`,
      projectHref: `/projects/${d.id}`,
      badge: HOME_PROOF_BADGE,
      ratio: d.ratio,
      demo: d,
      kind: "demo",
      category: preset?.category,
      recipeSlug: d.preset,
    });
  }

  return items;
}

/**
 * Lab / Feed catalog — **official unique demos only** (G2/G3).
 * Concept recipes without their own footage live on `/effects`, not a
 * shared-loop density wall that looks like a full product catalog.
 */
export function buildVideoFeed(): FeedItem[] {
  const items: FeedItem[] = [];
  const seenMp4 = new Set<string>();

  for (const d of DEMO_VIDEOS) {
    if (seenMp4.has(d.mp4)) continue;
    seenMp4.add(d.mp4);
    const preset = PRESETS.find((p) => p.slug === d.preset);
    items.push({
      id: `demo-${d.id}`,
      title: viralName(d.preset, d.title),
      subtitle: d.character,
      href: createHref(d.preset, d.id),
      detailHref: `/effects/${d.preset}`,
      projectHref: `/projects/${d.id}`,
      badge: "Official example · cached",
      ratio: d.ratio,
      demo: d,
      kind: "demo",
      category: preset?.category,
      recipeSlug: d.preset,
    });
  }

  return items;
}

/** Count of recipes without unique Lab footage (for honest empty/CTA copy). */
export function conceptRecipeCount(): number {
  const withFootage = new Set(DEMO_VIDEOS.map((d) => d.preset));
  return PRESETS.filter((p) => !withFootage.has(p.slug)).length;
}

export function featuredStrip(): FeedItem[] {
  return DEMO_VIDEOS.map((d) => ({
    id: `feat-${d.id}`,
    title: viralName(d.preset, d.title),
    subtitle: d.result,
    href: createHref(d.preset, d.id),
    detailHref: `/effects/${d.preset}`,
    projectHref: `/projects/${d.id}`,
    badge: "Official example · cached",
    ratio: d.ratio,
    demo: d,
    kind: "demo" as const,
    recipeSlug: d.preset,
  }));
}

/** PIKBO Lab projects only; no user identity or engagement is fabricated. */
export function communityProjects(): CommunityProject[] {
  // Official Lab demos only — no remixed concept filler that reuses loops.
  return DEMO_VIDEOS.map((d) => ({
    id: `proj-${d.id}`,
    title: `${d.character} · ${viralName(d.preset, d.title)}`,
    look: d.eyebrow,
    remakeHref: createHref(d.preset, d.id),
    detailHref: `/projects/${d.id}`,
    visibility: "Official example" as const,
    author: {
      name: "Pikbo Lab",
      initials: "P",
      badge: "Pikbo Lab",
    },
    demo: d,
  }));
}

/** Resolve official Lab project by demo id (for /projects/[slug]). */
export function getOfficialProject(slug: string) {
  const d = DEMO_VIDEOS.find((x) => x.id === slug);
  if (!d) return null;
  return {
    slug: d.id,
    title: `${d.character} · ${viralName(d.preset, d.title)}`,
    recipeSlug: d.preset,
    demo: d,
    remakeHref: createHref(d.preset, d.id),
    effectsHref: `/effects/${d.preset}`,
    result: d.result,
    eyebrow: d.eyebrow,
  };
}

/** All official Lab project slugs — SSG + sitemap. */
export function listOfficialProjectSlugs(): string[] {
  return DEMO_VIDEOS.map((d) => d.id);
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
