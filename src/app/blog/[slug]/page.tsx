import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { getPost, posts } from "@/data/posts";
import { profile } from "@/data/profile";
import { getPostHtml } from "@/lib/posts";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  const url = `/blog/${post.slug}`;
  return {
    title: { absolute: post.seoTitle },
    description: post.description,
    keywords: post.keywords,
    alternates: { canonical: url },
    authors: [{ name: profile.name, url: profile.siteUrl }],
    openGraph: {
      type: "article",
      url,
      title: post.title,
      description: post.description,
      publishedTime: post.published,
      authors: [profile.name],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

function formatDate(date: string) {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const html = await getPostHtml(post.slug);
  const url = `${profile.siteUrl}/blog/${post.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.published,
    dateModified: post.published,
    url,
    mainEntityOfPage: url,
    keywords: post.keywords.join(", "),
    inLanguage: "en",
    author: {
      "@type": "Person",
      "@id": `${profile.siteUrl}/#person`,
      name: profile.name,
      url: profile.siteUrl,
    },
    publisher: { "@id": `${profile.siteUrl}/#person` },
  };

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-12 sm:px-6 sm:py-20">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Link href="/blog" className="text-sm text-muted hover:text-accent">
          ← All articles
        </Link>
        <article className="mt-6">
          <header>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              {post.title}
            </h1>
            <p className="mt-4 text-sm text-muted">
              By {profile.name} ·{" "}
              <time dateTime={post.published}>{formatDate(post.published)}</time>
            </p>
          </header>
          <div
            className="article-body mt-10"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </article>
      </main>
    </>
  );
}
