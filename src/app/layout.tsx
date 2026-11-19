import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { education, profile } from "@/data/profile";
import "./globals.css";

const title = `${profile.name} | ${profile.title}`;
const description =
  "System Architect and Full-Stack Tech Lead with 9+ years building SaaS, AWS and Kubernetes platforms, and AI agents. Open to full-time remote roles.";

const longDescription =
  "Usman Hafeez is a System Architect and Full-Stack Tech Lead with 9+ years of experience building SaaS platforms, cloud infrastructure on AWS and Kubernetes, and AI agent features with Node.js, Next.js, React and Python.";

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
    "System Architect",
    "Full-Stack Tech Lead",
    "Full-Stack Developer Pakistan",
    "Remote Full-Stack Tech Lead",
    "Next.js developer",
    "Node.js developer",
    "React developer",
    "NestJS",
    "Python",
    "AWS architect",
    "Kubernetes",
    "Terraform",
    "DevOps engineer",
    "SaaS development",
    "AI agents",
    "RAG",
    "Faisalabad",
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
        "Next.js",
        "Node.js",
        "AWS",
        "Kubernetes",
        "Terraform",
        "DevOps",
        "AI agents",
        "Retrieval-augmented generation",
        "SaaS architecture",
      ],
      sameAs: [
        profile.links.github,
        profile.links.linkedin,
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
