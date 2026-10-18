import type { MetadataRoute } from "next";

/** Concept demo: ask every crawler to stay away. */
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", disallow: "/" } };
}
