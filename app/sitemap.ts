import type { MetadataRoute } from "next";
import { PRESETS } from "@/lib/presets";
import { USE_CASES } from "@/lib/usecases";
import { TOY_TYPES } from "@/lib/toytypes";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticPages = [
    "",
    "/effects",
    "/create",
    "/pricing",
    "/privacy",
    "/terms",
  ].map((path) => ({
    url: `${site.url}${path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const effectPages = PRESETS.map((p) => ({
    url: `${site.url}/effects/${p.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const useCasePages = USE_CASES.map((u) => ({
    url: `${site.url}/for/${u.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const toyTypePages = TOY_TYPES.map((t) => ({
    url: `${site.url}/toys/${t.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...effectPages, ...useCasePages, ...toyTypePages];
}
