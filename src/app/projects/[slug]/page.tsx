import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Tag } from "@/components/Section";
import { caseStudies, getCaseStudy } from "@/data/caseStudies";
import { getPost } from "@/data/posts";
import { profile } from "@/data/profile";
import { getCaseStudyHtml } from "@/lib/posts";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return caseStudies.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return {};
  const url = `/projects/${study.slug}`;
  return {
    title: { absolute: study.seoTitle },
    description: study.description,
    keywords: study.keywords,
    alternates: { canonical: url },
    authors: [{ name: profile.name, url: profile.siteUrl }],
    openGraph: {
      type: "article",
      url,
      title: study.title,
      description: study.description,
      publishedTime: study.published,
      authors: [profile.name],
    },
    twitter: {
      card: "summary_large_image",
      title: study.title,
      description: study.description,
    },
  };
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();

  const html = await getCaseStudyHtml(study.slug);
  const url = `${profile.siteUrl}/projects/${study.slug}`;
  const related = study.related
    .map((postSlug) => getPost(postSlug))
    .filter((post) => post !== undefined);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: study.title,
    description: study.description,
    datePublished: study.published,
    dateModified: study.published,
    url,
    mainEntityOfPage: url,
    keywords: study.keywords.join(", "),
    inLanguage: "en",
    about: study.project,
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
        <Link href="/#projects" className="text-sm text-muted hover:text-accent">
          ← All projects
        </Link>
        <article className="mt-6">
          <header>
            <p className="text-sm font-medium uppercase tracking-widest text-accent">
              Case study
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              {study.title}
            </h1>
            <p className="mt-4 text-sm text-muted">
              {profile.name} · {study.role}
            </p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {study.stack.map((item) => (
                <li key={item}>
                  <Tag>{item}</Tag>
                </li>
              ))}
            </ul>
          </header>
          <div
            className="article-body mt-10"
            dangerouslySetInnerHTML={{ __html: html }}
          />
          {related.length > 0 && (
            <aside className="mt-12 rounded-2xl border border-line bg-card p-6">
              <h2 className="text-lg font-semibold">Read more about this project</h2>
              <ul className="mt-3 space-y-2">
                {related.map((post) => (
                  <li key={post.slug}>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-accent hover:underline"
                    >
                      {post.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </aside>
          )}
        </article>
      </main>
    </>
  );
}
