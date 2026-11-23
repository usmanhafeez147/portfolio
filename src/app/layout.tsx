import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { certifications, education, profile } from "@/data/profile";
import "./globals.css";

const title = `${profile.name} | ${profile.title}`;
const description =
  "Hire Usman Hafeez, System Architect and Full-Stack Tech Lead: 9+ years in Next.js, Node.js, Python, AWS, Kubernetes and AI agents. Remote and freelance.";

const longDescription =
  "Usman Hafeez is a System Architect and Full-Stack Tech Lead with 9+ years of experience building multi-tenant SaaS platforms, cloud infrastructure on AWS EKS and Kubernetes, and AI agents and RAG pipelines with Node.js, NestJS, Next.js, React, Python, LangChain and LangGraph.";

export const metadata: Metadata = {
  metadataBase: new URL(profile.siteUrl),
  title: { default: title, template: `%s | ${profile.name}` },
  description,
  applicationName: `${profile.name} Portfolio`,
  authors: [{ name: profile.name, url: profile.siteUrl }],
  creator: profile.name,
  publisher: profile.name,
  category: "technology",
  keywords: [
    "Usman Hafeez",
    "Usman Abdul Hafeez",
    "usmanhafeez147",
    "System Architect",
    "Full-Stack Tech Lead",
    "Full-Stack Developer",
    "Senior Full-Stack Engineer",
    "Full-Stack Developer Pakistan",
    "Remote Full-Stack Developer",
    "Hire Full-Stack Developer",
    "Freelance Full-Stack Developer",
    "Next.js developer",
    "Node.js developer",
    "NestJS developer",
    "React developer",
    "TypeScript developer",
    "Python developer",
    "FastAPI",
    "MERN stack",
    "MongoDB",
    "MySQL",
    "Redis",
    "AWS architect",
    "AWS EKS",
    "Kubernetes",
    "Docker",
    "Terraform",
    "CI/CD",
    "DevOps engineer",
    "Cloud architect",
    "Multi-tenant SaaS",
    "SaaS development",
    "Microservices architecture",
    "AI engineer",
    "AI agents",
    "RAG",
    "LangChain",
    "LangGraph",
    "MCP server",
    "n8n automation",
    "MQTT and IoT",
    "Faisalabad",
    "Pakistan",
  ],
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    url: profile.siteUrl,
    title,
    description: longDescription,
    siteName: `${profile.name} Portfolio`,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: longDescription,
  },
  formatDetection: { email: false, address: false, telephone: false },
  verification: { google: "hQZ4at7WEwriKIefuwGMhGl11Z4948QcM2btSM-bEjU" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#070b14" },
  ],
  colorScheme: "light dark",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${profile.siteUrl}/#person`,
      name: profile.name,
      alternateName: profile.alternateNames,
      givenName: "Usman",
      familyName: "Hafeez",
      url: profile.siteUrl,
      jobTitle: profile.title,
      email: profile.email,
      worksFor: {
        "@type": "Organization",
        name: "Teamcube",
        url: "https://teamcube.io",
      },
      telephone: profile.phoneE164,
      image: `${profile.siteUrl}/profile-photo.jpg`,
      description: longDescription,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Faisalabad",
        addressCountry: "PK",
      },
      alumniOf: { "@type": "CollegeOrUniversity", name: education.school },
      knowsAbout: [
        "Full-stack development",
        "System architecture",
        "Multi-tenant SaaS architecture",
        "Microservices",
        "TypeScript",
        "Next.js",
        "React",
        "Vue.js",
        "Node.js",
        "NestJS",
        "Express",
        "Python",
        "FastAPI",
        "Laravel",
        "MongoDB",
        "MySQL",
        "PostgreSQL",
        "Redis",
        "AWS",
        "Amazon EKS",
        "Google Cloud Platform",
        "Kubernetes",
        "Docker",
        "Terraform",
        "CI/CD",
        "DevOps",
        "MQTT",
        "Internet of Things",
        "AI agents",
        "Retrieval-augmented generation",
        "LangChain",
        "LangGraph",
        "Model Context Protocol",
        "n8n",
      ],
      hasCredential: certifications.map((c) => ({
        "@type": "EducationalOccupationalCredential",
        name: `${c.issuer} ${c.name} Certification`,
        credentialCategory: "certificate",
        url: c.url,
        recognizedBy: { "@type": "Organization", name: c.issuer },
      })),
      sameAs: [
        profile.links.github,
        profile.links.linkedin,
        profile.links.stackoverflow,
        profile.links.freecodecamp,
        profile.links.upwork,
        profile.links.fiverr,
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${profile.siteUrl}/#website`,
      url: profile.siteUrl,
      name: `${profile.name} Portfolio`,
      inLanguage: "en",
      publisher: { "@id": `${profile.siteUrl}/#person` },
    },
    {
      "@type": "ProfilePage",
      url: profile.siteUrl,
      name: title,
      mainEntity: { "@id": `${profile.siteUrl}/#person` },
    },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
