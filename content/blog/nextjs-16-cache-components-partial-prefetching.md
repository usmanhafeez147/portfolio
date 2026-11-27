# Next.js 16 Cache Components and Partial Prefetching in Practice

For most of the App Router's life, caching in Next.js was something that happened to you. Fetches were cached unless you opted out, pages became static or dynamic based on rules that were easy to trip, and "why is this page showing old data" was one of the most common questions in any Next.js team.

Next.js 16 changed the model. With Cache Components, caching is opt-in and explicit: nothing is cached unless you say so with `"use cache"`, and everything else runs at request time. With Next.js 16.4, released in October 2026, the Next.js team now recommends Cache Components for every app, has turned it on by default for new projects, and says it will become the default in Next.js 17.

This post walks through the model as it stands in 16.4: how to turn it on, how `"use cache"` works, how to invalidate correctly, what Partial Prefetching adds, and the new controls for keeping pages static and prefetches cheap. My own portfolio site, the one you are reading this on, runs with Cache Components and Partial Prefetching enabled, so the examples are close to real use.

## Turning it on

Cache Components is a config flag. In 16.4 the full model uses two flags together:

```ts
// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
};

export default nextConfig;
```

If you are upgrading an older app, note the renames. The experimental `dynamicIO` flag became `cacheComponents`, and the old `experimental.ppr` flag and the route-level `experimental_ppr` export were removed in favor of this model.

## "use cache" is Cache-Control for components

The core idea is one directive. Put `"use cache"` at the top of a component, a page or an async function, and its result can be cached. The compiler works out the cache key from the inputs, so you do not build keys by hand.

The Next.js team describes it as a component-level version of the Cache-Control header, and that is a useful way to think about it. You decide, part by part, what can be reused and for how long. Everything you do not mark runs fresh on each request.

Here is the pattern from this site. Blog posts are Markdown files, and turning Markdown into HTML on every request would be wasted work, so the function that reads and renders a post is cached:

```ts
import { readFile } from "node:fs/promises";
import path from "node:path";
import { marked } from "marked";

export async function getPostHtml(slug: string) {
  "use cache";
  const file = path.join(process.cwd(), "content", "blog", `${slug}.md`);
  const markdown = await readFile(file, "utf8");
  return marked.parse(markdown, { async: false });
}
```

The slug is the input, so each post gets its own cache entry automatically.

You control how long an entry lives with `cacheLife`, using a built-in profile such as `"hours"`, `"days"` or `"max"`, or your own profiles defined in the config:

```tsx
import { cacheLife } from "next/cache";

async function Projects({ userId }: { userId: string }) {
  "use cache";
  cacheLife("hours");
  const projects = await getProjectsForUser(userId);
  return <ProjectList projects={projects} />;
}
```

## Mixing cached and dynamic parts on one page

The real payoff is that one page can mix both. A product page can serve its description and images from cache while the stock count or the signed-in user's avatar renders at request time. Dynamic parts go inside a `Suspense` boundary, and Next.js streams them into the same response after the cached shell:

```tsx
import { Suspense } from "react";

export default function ProductPage() {
  return (
    <>
      <ProductDetails />
      <Suspense fallback={<StockSkeleton />}>
        <LiveStock />
      </Suspense>
    </>
  );
}
```

This is Partial Prerendering finally made practical. The static parts can be prerendered at build time or served from a CDN, and only the small dynamic islands cost compute on each request.

A common early mistake is forgetting that dynamic APIs are now async. Since Next.js 16, `params`, `searchParams`, `cookies()`, `headers()` and `draftMode()` must all be awaited. Reading cookies in a component makes it dynamic, so put that component inside `Suspense` rather than letting it block the whole page.

## Invalidation: revalidateTag, updateTag and refresh

Caching is only half the job. The other half is clearing the right entries when data changes. Tag your cached work with `cacheTag`, then invalidate by tag. Next.js 16 changed this API in ways that catch people during upgrades.

**`revalidateTag(tag, profile)`** now takes a second argument, a `cacheLife` profile. Calling it with only a tag is deprecated. With a profile such as `"max"`, it gives stale-while-revalidate behavior: visitors get the cached version immediately while Next.js fetches fresh data in the background. This suits content that can be a little behind, like a blog index or a product catalog.

```ts
import { revalidateTag } from "next/cache";

revalidateTag("blog-posts", "max");
```

**`updateTag(tag)`** is new and only works in Server Actions. It expires the entry and reads fresh data within the same request, which gives read-your-writes behavior. Use it after a user saves a form, so they see their own change immediately:

```ts
"use server";
import { updateTag } from "next/cache";

export async function saveProfile(userId: string, data: ProfileInput) {
  await db.users.update(userId, data);
  updateTag(`user-${userId}`);
}
```

**`refresh()`**, also Server Actions only, does not touch the cache at all. It refreshes uncached data on the page, such as a notification count, after an action.

A simple rule of thumb: `updateTag` when the person who made the change must see it now, `revalidateTag` with `"max"` when everyone can see it a moment later, and `refresh` for dynamic data that was never cached.

## Partial Prefetching and why it matters

Next.js 16 rewrote prefetching. Layouts shared by many links are downloaded once instead of once per link, and prefetches only fetch the parts that are not already cached. Partial Prefetching takes this further: a link can prefetch the cached shell of the next page so navigation feels instant, without rendering that page's dynamic parts ahead of time.

With 16.4, Partial Prefetching is considered part of the Cache Components model, which is why both flags appear in the config above.

## New in 16.4: deferring work with navigation() and prefetch()

Eager prefetching has a cost. If a list shows fifty links and each one prefetches its whole page, you can generate a lot of server work for pages nobody opens. The Next.js team's own example is an email inbox where every visible message link prefetches its entire thread.

Next.js 16.4 adds two functions to control this. Awaiting `navigation()` inside a component keeps it out of prefetches, so it only renders when the user actually navigates. Awaiting `prefetch()` keeps content out of a route's initial shell until an explicit prefetch happens.

```tsx
import { Suspense } from "react";
import { navigation } from "next/cache";

async function Message({ id }: { id: string }) {
  const message = await getMessage(id);
  return (
    <>
      <h1>{message.subject}</h1>
      <div>{message.body}</div>
      <Suspense fallback={<Spinner />}>
        <Thread id={id} />
      </Suspense>
    </>
  );
}

async function Thread({ id }: { id: string }) {
  await navigation();
  const thread = await getThread(id);
  return <ThreadList messages={thread} />;
}
```

Now a prefetch loads the first message so the page opens instantly, and the rest of the thread waits for a real click.

## New in 16.4: guaranteeing a page stays static

The flexibility of mixing static and dynamic content has a downside. On a page that should be fully static, such as a blog post or a marketing page, one careless dynamic component quietly turns it into a server-rendered page with real compute cost.

The new `ensureStatic` route config prevents that. Export it from a page or a layout, and the build fails if dynamic content ever sneaks in:

```tsx
export const ensureStatic = "navigation";
```

`"navigation"` is the strictest level and guarantees that navigations to the route never render at request time. `"prefetch"` and `"shell"` give looser guarantees for prefetches and for the first load. Putting it on a layout applies it to every page under that layout. For a site like this one, putting it on the blog layout is a cheap way to make sure posts stay static as the code changes.

## Two other upgrade notes

**`middleware.ts` is now `proxy.ts`.** Next.js 16 renamed middleware to make the network boundary clearer. Rename the file to `proxy.ts` and the exported function to `proxy`. It runs on the Node.js runtime. The old `middleware.ts` still works for Edge use cases, but it is deprecated.

**Let an agent do the mechanical parts.** Next.js 16.4 ships `next upgrade --agent`, which prepares version-specific migration guides, codemods and checks for a coding agent, plus official agent Skills for adopting Cache Components and Partial Prefetching. They are worth trying on a branch, as long as you review the result the same way you would review a teammate's migration.

## When to adopt

For a new app, there is little reason to wait: new apps from `create-next-app` now start with Cache Components on, and Next.js 17 will make it the default. For an existing app, the work is mostly finding the places that relied on implicit caching, marking them with `"use cache"`, wrapping request-time parts in `Suspense`, and updating every `revalidateTag` call to the new signature.

The result is a model where you can look at a component and know whether it is cached, for how long, and what clears it. After years of guessing, that alone makes the migration worth it.
