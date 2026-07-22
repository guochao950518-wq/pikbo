import type { MetadataRoute } from "next";
import { PRESETS } from "@/lib/presets";
import { USE_CASES } from "@/lib/usecases";
import { TOY_TYPES } from "@/lib/toytypes";
import { GUIDES } from "@/lib/guides";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  // Keep crawl metadata stable. Deploys should update this only after a real
  // content review instead of pretending every request modified every page.
  const lastReviewed = new Date("2026-07-22T00:00:00.000Z");
  const staticPages = [
    "",
    "/effects",
    "/guides",
    "/create",
    "/pricing",
    "/privacy",
    "/terms",
    "/apps",
    "/models",
    "/cinema",
    "/image",
    "/library",
    "/community",
    "/profile",
    "/supercomputer",
  ].map((path) => ({
    url: `${site.url}${path}`,
    lastModified: lastReviewed,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const effectPages = PRESETS.map((p) => ({
    url: `${site.url}/effects/${p.slug}`,
    lastModified: lastReviewed,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const useCasePages = USE_CASES.map((u) => ({
    url: `${site.url}/for/${u.slug}`,
    lastModified: lastReviewed,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const toyTypePages = TOY_TYPES.map((t) => ({
    url: `${site.url}/toys/${t.slug}`,
    lastModified: lastReviewed,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const guidePages = GUIDES.map((g) => ({
    url: `${site.url}/guides/${g.slug}`,
    lastModified: lastReviewed,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [
    ...staticPages,
    ...effectPages,
    ...useCasePages,
    ...toyTypePages,
    ...guidePages,
  ];
}
