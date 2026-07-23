import type { MetadataRoute } from "next";
import { PRESETS } from "@/lib/presets";
import { USE_CASES } from "@/lib/usecases";
import { TOY_TYPES } from "@/lib/toytypes";
import { GUIDES } from "@/lib/guides";
import { TOOLS } from "@/lib/tools";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const reviewedAt = "2026-07-23";
  const staticPages = [
    "",
    "/effects",
    "/tools",
    "/guides",
    "/create",
    "/pricing",
    "/privacy",
    "/terms",
    "/community",
  ].map((path) => ({
    url: `${site.url}${path}`,
    lastModified: reviewedAt,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const effectPages = PRESETS.map((p) => ({
    url: `${site.url}/effects/${p.slug}`,
    lastModified: reviewedAt,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const toolPages = TOOLS.map((t) => ({
    url: `${site.url}/tools/${t.slug}`,
    lastModified: reviewedAt,
    changeFrequency: "weekly" as const,
    priority: 0.75,
  }));

  const useCasePages = USE_CASES.map((u) => ({
    url: `${site.url}/for/${u.slug}`,
    lastModified: reviewedAt,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const toyTypePages = TOY_TYPES.map((t) => ({
    url: `${site.url}/toys/${t.slug}`,
    lastModified: reviewedAt,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const guidePages = GUIDES.map((g) => ({
    url: `${site.url}/guides/${g.slug}`,
    lastModified: reviewedAt,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [
    ...staticPages,
    ...effectPages,
    ...toolPages,
    ...useCasePages,
    ...toyTypePages,
    ...guidePages,
  ];
}
