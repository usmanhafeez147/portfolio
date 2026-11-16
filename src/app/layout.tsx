import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { profile } from "@/data/profile";
import "./globals.css";

const description = `${profile.title}. ${profile.tagline}`;

export const metadata: Metadata = {
  metadataBase: new URL(profile.siteUrl),
  title: {
    default: `${profile.name} | ${profile.title}`,
    template: `%s | ${profile.name}`,
  },
  description,
  authors: [{ name: profile.name, url: profile.siteUrl }],
  keywords: [
    "Full-Stack Developer",
    "System Architect",
    "Next.js",
    "Node.js",
    "AWS",
    "Kubernetes",
    "DevOps",
    "AI agents",
  ],
  openGraph: {
    type: "website",
    url: profile.siteUrl,
    title: `${profile.name} | ${profile.title}`,
    description,
    siteName: profile.name,
  },
  twitter: {
    card: "summary",
    title: `${profile.name} | ${profile.title}`,
    description,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
