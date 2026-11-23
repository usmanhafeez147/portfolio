import { readFile } from "node:fs/promises";
import path from "node:path";
import { marked } from "marked";

export async function getPostHtml(slug: string) {
  "use cache";
  const file = path.join(process.cwd(), "content", "blog", `${slug}.md`);
  const markdown = await readFile(file, "utf8");
  // The page shows the title itself, so drop the Markdown H1.
  const body = markdown.replace(/^# .*\n+/, "");
  return marked.parse(body, { async: false });
}
