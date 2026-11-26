import type { MetadataRoute } from "next";
import { posts } from "@/data/posts";
import { profile } from "@/data/profile";

// Update this when the homepage content changes, so lastmod stays truthful.
const SITE_UPDATED = "2026-11-26";

const latestPost = posts
  .map((post) => post.published)
  .sort()
  .at(-1);

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      // Trailing slash matches the canonical URL Next.js renders for "/".
      url: `${profile.siteUrl}/`,
      lastModified: new Date(`${SITE_UPDATED}T00:00:00Z`),
      changeFrequency: "monthly",
      priority: 1,
      images: [`${profile.siteUrl}/usman-hafeez.jpg`],
    },
    {
      url: `${profile.siteUrl}/blog`,
      lastModified: new Date(`${latestPost ?? SITE_UPDATED}T00:00:00Z`),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...posts.map((post) => ({
      url: `${profile.siteUrl}/blog/${post.slug}`,
      lastModified: new Date(`${post.published}T00:00:00Z`),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
