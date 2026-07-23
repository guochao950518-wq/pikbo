/**
 * Traceable ShowcaseProject registry (Wave A / HIGGSFIELD_PUBLIC_PARITY).
 * Single source for Home / Explore / /projects/[slug] — no parallel identities.
 */

import { DEMO_VIDEOS, type DemoVideo } from "@/lib/demoVideos";
import { createRemixHref } from "@/lib/remixIntent";
import { viralName } from "@/lib/viralNames";
import { getPreset } from "@/lib/presets";

export type ShowcaseProject = {
  slug: string;
  title: string;
  recipeSlug: string;
  demo: DemoVideo;
  remakeHref: string;
  effectsHref: string;
  detailHref: string;
  result: string;
  eyebrow: string;
  badge: "Official example · cached";
};

export function listShowcaseProjects(): ShowcaseProject[] {
  return DEMO_VIDEOS.map((d) => ({
    slug: d.id,
    title: `${d.character} · ${viralName(d.preset, d.title)}`,
    recipeSlug: d.preset,
    demo: d,
    remakeHref: createRemixHref(d.preset, d.id),
    effectsHref: `/effects/${d.preset}`,
    detailHref: `/projects/${d.id}`,
    result: d.result,
    eyebrow: d.eyebrow,
    badge: "Official example · cached",
  }));
}

export function getShowcaseProject(slug: string): ShowcaseProject | null {
  return listShowcaseProjects().find((p) => p.slug === slug) ?? null;
}

export function listShowcaseProjectSlugs(): string[] {
  return DEMO_VIDEOS.map((d) => d.id);
}

/** Recipe still registered? Used for open-project integrity. */
export function showcaseRecipeExists(recipeSlug: string): boolean {
  return Boolean(getPreset(recipeSlug));
}
