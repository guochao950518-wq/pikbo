"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

/**
 * Phase H — privacy-conscious funnel beacon for /projects/[slug].
 * No-op when NEXT_PUBLIC_ANALYTICS_URL is unset (must never break render).
 */
export function ProjectOpenBeacon({
  slug,
  recipe,
}: {
  slug: string;
  recipe: string;
}) {
  useEffect(() => {
    const t = window.setTimeout(() => {
      track({
        event: "project_open",
        path: `/projects/${slug}`,
        recipe,
        meta: { slug, source: "project_page" },
      });
    }, 0);
    return () => window.clearTimeout(t);
  }, [slug, recipe]);
  return null;
}
