// Submits every URL in the live sitemap to IndexNow (Bing, Yandex, Seznam, Naver and others).
// Run after a production deploy: node scripts/indexnow.mjs
// The key is public by design; IndexNow verifies it by fetching /<key>.txt from the site.

const SITE = process.env.SITE_URL ?? "https://usmanhafeez147.vercel.app";
const KEY = "1dbfe348f39af9ae004a0efd9ce5896e";
const KEY_LOCATION = `${SITE}/${KEY}.txt`;

async function waitForKeyFile(attempts = 30, delayMs = 10_000) {
  for (let i = 1; i <= attempts; i++) {
    try {
      const res = await fetch(KEY_LOCATION, { cache: "no-store" });
      if (res.ok && (await res.text()).trim() === KEY) return;
    } catch {
      // Site not reachable yet; retry.
    }
    console.log(`Key file not live yet (attempt ${i}/${attempts}), waiting...`);
    await new Promise((r) => setTimeout(r, delayMs));
  }
  throw new Error(`Key file never became available at ${KEY_LOCATION}`);
}

async function sitemapUrls() {
  const res = await fetch(`${SITE}/sitemap.xml`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Sitemap fetch failed: HTTP ${res.status}`);
  const xml = await res.text();
  const urls = [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)]
    .map((m) => m[1])
    .filter((u) => u.startsWith(SITE) && !/\.(jpe?g|png|webp|gif|svg)$/i.test(u));
  return [...new Set(urls)];
}

async function main() {
  await waitForKeyFile();
  const urlList = await sitemapUrls();
  if (urlList.length === 0) throw new Error("No URLs found in sitemap");

  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: new URL(SITE).host,
      key: KEY,
      keyLocation: KEY_LOCATION,
      urlList,
    }),
  });

  // 200 = accepted, 202 = accepted and key validation pending.
  if (res.status !== 200 && res.status !== 202) {
    throw new Error(`IndexNow rejected the submission: HTTP ${res.status} ${await res.text()}`);
  }
  console.log(`IndexNow: submitted ${urlList.length} URLs (HTTP ${res.status})`);
  urlList.forEach((u) => console.log(`  ${u}`));
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
