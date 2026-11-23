import type { MetadataRoute } from "next";
import { posts } from "@/data/posts";
import { profile } from "@/data/profile";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: profile.siteUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
      images: [`${profile.siteUrl}/usman-hafeez.jpg`],
    },
    {
      url: `${profile.siteUrl}/blog`,
      lastModified: new Date(),
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
