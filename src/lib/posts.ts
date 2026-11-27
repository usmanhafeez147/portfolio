import { readFile } from "node:fs/promises";
import path from "node:path";
import { marked } from "marked";

async function markdownHtml(folder: string, slug: string) {
  const file = path.join(process.cwd(), "content", folder, `${slug}.md`);
  const markdown = await readFile(file, "utf8");
  // The page shows the title itself, so drop the Markdown H1.
  const body = markdown.replace(/^# .*\n+/, "");
  return marked.parse(body, { async: false });
}

export async function getPostHtml(slug: string) {
  "use cache";
  return markdownHtml("blog", slug);
}

export async function getCaseStudyHtml(slug: string) {
  "use cache";
  return markdownHtml("projects", slug);
}
