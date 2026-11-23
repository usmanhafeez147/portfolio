import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { posts } from "@/data/posts";
import { profile } from "@/data/profile";

export const metadata: Metadata = {
  title: { absolute: "Engineering Blog on SaaS, AWS and AI | Usman Hafeez" },
  description: `Articles by ${profile.name} on multi-tenant SaaS architecture, AWS and Kubernetes, real-time systems, IoT backends and AI agents with MCP.`,
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
        <div className="mt-4 space-y-4 text-lg leading-8 text-muted">
          <p>
            I am Usman Hafeez (Usman Abdul Hafeez), a System Architect and
            Full-Stack Tech Lead with more than nine years of experience
            building and running production systems. This blog is where I
            write down what I have learned along the way.
          </p>
          <p>
            The articles come from real projects: multi-tenant SaaS platforms
            on AWS EKS and Kubernetes, real-time tracking with Node.js,
            Socket.IO and Redis, device backends with NestJS and MQTT, and AI
            assistants that work with live data through MCP servers. Each one
            explains the architecture decisions, the problems we ran into and
            what I would do differently, in plain language rather than code.
          </p>
        </div>
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
