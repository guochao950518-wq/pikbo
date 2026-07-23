/**
 * Phase H — index only pages with a working tool, unique intent, proof, and FAQ.
 * Concept recipes without a unique cached Lab sample stay noindex until proof lands.
 */

import type { Metadata } from "next";
import { DEMO_VIDEOS } from "@/lib/demoVideos";
import { PRESETS } from "@/lib/presets";

/** Recipes that have at least one distinct DEMO_VIDEOS entry (unique preset match). */
export function recipeHasUniqueProof(slug: string): boolean {
  return DEMO_VIDEOS.some((d) => d.preset === slug);
}

/** All preset slugs that currently have unique Lab proof. */
export function proofBackedRecipeSlugs(): string[] {
  const set = new Set(
    DEMO_VIDEOS.map((d) => d.preset).filter((s): s is string => Boolean(s))
  );
  return PRESETS.map((p) => p.slug).filter((slug) => set.has(slug));
}

/** Public SEO landings may still be followed so deep links work. */
export const CONCEPT_ROBOTS: NonNullable<Metadata["robots"]> = {
  index: false,
  follow: true,
};

/** Private / device / account surfaces. */
export const PRIVATE_ROBOTS: NonNullable<Metadata["robots"]> = {
  index: false,
  follow: false,
};

/** Preview suite doors (not soft-launch primary product). */
export const PREVIEW_ROBOTS: NonNullable<Metadata["robots"]> = {
  index: false,
  follow: false,
};

export function robotsForRecipe(slug: string): Metadata["robots"] | undefined {
  if (recipeHasUniqueProof(slug)) return undefined;
  return CONCEPT_ROBOTS;
}

export function robotsForPrimaryEffect(
  primaryEffect: string | undefined
): Metadata["robots"] | undefined {
  if (!primaryEffect || !recipeHasUniqueProof(primaryEffect)) {
    return CONCEPT_ROBOTS;
  }
  return undefined;
}
