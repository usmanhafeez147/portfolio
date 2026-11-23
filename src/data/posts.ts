export type Post = {
  slug: string;
  title: string;
  description: string;
  published: string;
  keywords: string[];
};

export const posts: Post[] = [
  {
    slug: "multi-tenant-saas-aws-eks",
    title:
      "How We Serve 100+ Client Websites from One Multi-Tenant SaaS on AWS EKS",
    description:
      "How one Next.js renderer on AWS EKS serves 100+ customer websites: hostname routing, automatic HTTPS for custom domains, Redis caching, tenant isolation and safe deploys.",
    published: "2026-11-23",
    keywords: [
      "multi-tenant SaaS",
      "AWS EKS",
      "Kubernetes",
      "Next.js multi-tenant",
      "custom domains",
      "cert-manager",
      "Redis caching",
      "Helm",
      "GitHub Actions",
      "SaaS architecture",
    ],
  },
];

export function getPost(slug: string) {
  return posts.find((p) => p.slug === slug);
}
