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
      ],
    },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
