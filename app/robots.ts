import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/profile",
        "/settings",
        "/library",
        "/login",
        "/checkout",
        // Preview / device-local studios (Phase H — not soft-launch primary)
        "/cinema",
        "/image",
        "/apps",
        "/models",
        "/flow",
        "/supercomputer",
        "/generate",
      ],
    },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
