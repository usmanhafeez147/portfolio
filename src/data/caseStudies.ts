export type CaseStudy = {
  slug: string;
  /** Matches the project's name in src/data/profile.ts, so its card can link here. */
  project: string;
  title: string;
  seoTitle: string;
  description: string;
  published: string;
  role: string;
  stack: string[];
  keywords: string[];
  /** Blog posts that go deeper into parts of this project. */
  related: string[];
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "multi-tenant-website-builder-aws-eks",
    project: "Teamcube Website Builder",
    title:
      "Case Study: A Multi-Tenant Website Builder Serving 100+ Sites on AWS EKS",
    seoTitle: "Case Study: Multi-Tenant Website Builder on AWS EKS | Usman Hafeez",
    description:
      "How I led the architecture of a no-code website builder on AWS EKS: 100+ live sites, 70% faster launches, 75% fewer incidents and 20 to 40% lower cloud costs.",
    published: "2026-11-27",
    role: "System Architect and Full-Stack Tech Lead, leading 4 to 6 developers",
    stack: [
      "Next.js",
      "Vue",
      "Node.js",
      "Python",
      "PostgreSQL",
      "MongoDB",
      "Redis",
      "AWS EKS",
      "Helm",
      "cert-manager",
      "GitHub Actions",
    ],
    keywords: [
      "multi-tenant SaaS case study",
      "website builder",
      "AWS EKS",
      "Kubernetes",
      "Next.js multi-tenant",
      "cloud cost reduction",
      "GitHub Actions CI/CD",
      "SaaS architect",
    ],
    related: ["multi-tenant-saas-aws-eks"],
  },
  {
    slug: "fleet-passenger-transport-platform",
    project: "Fleet and Passenger Transport Platform",
    title:
      "Case Study: A Multi-Tenant Fleet Platform with Live GPS Tracking and an AI Assistant",
    seoTitle: "Case Study: Fleet Platform with Live GPS and MCP | Usman Hafeez",
    description:
      "How I built a multi-tenant fleet and passenger transport platform: one Node.js API, six client apps, live GPS over Socket.IO and Redis, and a 29-tool MCP server.",
    published: "2026-11-27",
    role: "Architect and lead developer",
    stack: [
      "Node.js",
      "Express",
      "Socket.IO",
      "MongoDB",
      "Redis",
      "Next.js",
      "Kotlin",
      "Expo",
      "Model Context Protocol",
    ],
    keywords: [
      "fleet management platform case study",
      "live GPS tracking",
      "Socket.IO Redis",
      "school bus tracking",
      "MCP server",
      "multi-tenant SaaS",
      "role-based access control",
      "Node.js",
    ],
    related: ["live-gps-tracking-socket-io-redis", "mcp-server-ai-assistant-fleet-data"],
  },
  {
    slug: "seamline-made-to-measure-tailoring-platform",
    project: "Seamline",
    title:
      "Case Study: Seamline, a Multi-Tenant Platform for Made-to-Measure Tailoring Shops",
    seoTitle: "Case Study: Seamline Tailoring SaaS Platform | Usman Hafeez",
    description:
      "How I built Seamline: branded storefronts with a 3D garment designer, shop and platform portals, an in-store kiosk app and an MCP server for platform admins.",
    published: "2026-11-27",
    role: "Founder, architect and sole developer",
    stack: [
      "Next.js",
      "TypeScript",
      "Express",
      "MongoDB",
      "Redis",
      "Electron",
      "Blender",
      "Docker",
      "Model Context Protocol",
    ],
    keywords: [
      "tailoring SaaS",
      "made-to-measure",
      "3D garment configurator",
      "multi-tenant e-commerce",
      "Next.js storefront",
      "Electron kiosk app",
      "MCP server",
      "SaaS case study",
    ],
    related: ["mcp-server-ai-assistant-fleet-data", "nextjs-16-cache-components-partial-prefetching"],
  },
];

export function getCaseStudy(slug: string) {
  return caseStudies.find((c) => c.slug === slug);
}

export function caseStudyForProject(project: string) {
  return caseStudies.find((c) => c.project === project);
}
