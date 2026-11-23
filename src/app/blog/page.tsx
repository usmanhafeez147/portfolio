import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { posts } from "@/data/posts";
import { profile } from "@/data/profile";

export const metadata: Metadata = {
  title: "Blog",
  description: `Articles by ${profile.name} on SaaS architecture, AWS, Kubernetes, full-stack development and AI agents.`,
  alternates: { canonical: "/blog" },
};

function formatDate(date: string) {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export default function BlogIndex() {
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-12 sm:px-6 sm:py-20">
        <p className="text-sm font-medium uppercase tracking-widest text-accent">
          Blog
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          Notes on SaaS, cloud and AI engineering
        </h1>
        <p className="mt-4 text-lg leading-8 text-muted">
          What I have learned building and running production systems.
        </p>
        <ul className="mt-10 space-y-6">
          {posts.map((post) => (
            <li
              key={post.slug}
              className="rounded-2xl border border-line bg-card p-6 transition hover:border-accent"
            >
              <time dateTime={post.published} className="text-sm text-muted">
                {formatDate(post.published)}
              </time>
              <h2 className="mt-2 text-xl font-semibold">
                <Link href={`/blog/${post.slug}`} className="hover:text-accent">
                  {post.title}
                </Link>
              </h2>
              <p className="mt-2 leading-7 text-muted">{post.description}</p>
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}
