import type { MetadataRoute } from "next";
import { getSitemapEntries } from "@/lib/data";
import { SITE_URL } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { categories, videos } = await getSitemapEntries();

  return [
    {
      url: SITE_URL,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SITE_URL}/privacy`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/terms`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    ...categories.map((category) => ({
      url: `${SITE_URL}/category/${category.slug}`,
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
    ...videos.map((video) => ({
      url: `${SITE_URL}/video/${video.id}`,
      lastModified: video.updated_at,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];
}
