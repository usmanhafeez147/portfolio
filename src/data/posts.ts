export type Post = {
  slug: string;
  title: string;
  description: string;
  published: string;
  keywords: string[];
};

export const posts: Post[] = [
  {
    slug: "mcp-server-ai-assistant-fleet-data",
    title:
      "Letting an AI Assistant Query Live Fleet Data Safely with an MCP Server",
    description:
      "How a 29-tool MCP server lets an AI assistant answer questions about a live multi-tenant fleet platform, with tenant isolation, role checks and read-only access.",
    published: "2026-11-23",
    keywords: [
      "MCP server",
      "Model Context Protocol",
      "AI assistant",
      "AI agents",
      "multi-tenant SaaS",
      "role-based access control",
      "prompt injection",
      "fleet management",
      "Node.js",
    ],
  },
  {
    slug: "live-gps-tracking-socket-io-redis",
    title:
      "Live GPS Tracking for a Multi-Tenant Fleet Platform with Socket.IO and Redis",
    description:
      "How one Node.js API streams live bus positions to six apps with Socket.IO rooms and Redis, keeps tenants isolated, and handles bad GPS and offline drivers.",
    published: "2026-11-23",
    keywords: [
      "live GPS tracking",
      "Socket.IO",
      "Redis adapter",
      "real-time",
      "Node.js",
      "Express",
      "MongoDB",
      "fleet management",
      "multi-tenant SaaS",
    ],
  },
  {
    slug: "reliable-iot-messaging-nestjs-mqtt",
    title: "Building Reliable IoT Messaging with NestJS, MQTT and MongoDB",
    description:
      "Patterns for reliable device backends: MQTT topic design, device provisioning, QoS choices, idempotent processing and MongoDB transactions in NestJS.",
    published: "2026-11-23",
    keywords: [
      "MQTT",
      "NestJS",
      "MongoDB transactions",
      "IoT backend",
      "device provisioning",
      "idempotency",
      "vehicle tracking",
      "Node.js",
    ],
  },
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
