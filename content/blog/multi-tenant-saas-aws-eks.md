# How We Serve 100+ Client Websites from One Multi-Tenant SaaS on AWS EKS

At Teamcube we build a no-code website builder. A customer picks a template, edits pages in the builder, and publishes. A few minutes later the site is live on its own subdomain or on the customer's own domain, with HTTPS.

Today the platform serves more than 100 live websites, and launching a new one takes about 70% less time than it did when every site was its own deployment. We did not get there by adding more servers. We got there by deciding early that a website is a row in a database, not a deployment.

This post explains how that works: how a request for any customer domain finds the right site, how certificates get issued without anyone touching them, how we cache tenant data, and how we deploy without breaking 100 sites at once. Our stack is Next.js, Redis, cert-manager and Helm on Amazon EKS, but the ideas carry over to other stacks.

## The core idea: one renderer, many hostnames

The naive way to host many client sites is one container (or one Vercel project, or one VM) per site. It feels simple at first. Then you have 40 sites, and a security patch means 40 builds and 40 deploys. Every site has its own config drift. Your cloud bill grows in a straight line with your customer count.

We went the other way. There is one service, the site renderer, and it serves every customer site. When a request comes in, the renderer looks at the hostname the visitor asked for, finds which site owns that hostname, loads that site's pages and theme, and renders them.

So the whole platform has three moving parts on the request path:

1. An ingress layer that accepts traffic for any hostname and handles HTTPS.
2. The renderer, a Next.js app that works out which customer a request belongs to.
3. A tenant store, the database where sites, pages and domains live, with Redis in front of it.

Adding a customer adds data, not infrastructure. That is the whole trick, and the rest of this post is the detail that makes it hold up in production.

## Routing every hostname to one service

Every customer gets a free subdomain like acme.sites.example.com. For those, we only need one wildcard routing rule in Kubernetes. It says that any hostname ending in our sites domain goes to the renderer service, and it uses a single wildcard certificate that covers all of them.

That one rule means every subdomain we will ever create already works. Creating a new site does not touch Kubernetes at all. It is a database insert and nothing else.

A wildcard certificate needs the DNS challenge, because Let's Encrypt has to confirm that you control the whole domain, not just one hostname. On AWS that means cert-manager updates Route 53 to prove ownership. We give cert-manager its own narrow IAM role through IRSA (IAM roles for service accounts), so there are no AWS access keys stored anywhere in the cluster. The certificate renews itself before it expires, and nobody on the team has had to think about it since.

## Custom domains and automatic HTTPS

Subdomains are easy. Custom domains are where most multi-tenant platforms get painful, because you cannot get a wildcard certificate for domains you do not own.

Our flow works like this. The customer adds www.acme.com in the builder, and we show them one DNS record to create, a CNAME pointing to our platform. In the background, our backend keeps checking that domain. As soon as the DNS record points to us, the backend creates a small routing rule just for that domain through the Kubernetes API. cert-manager sees the new rule, completes a Let's Encrypt HTTP challenge for that single domain, and stores the certificate. A few minutes later the customer's site is live on their domain with HTTPS. They never upload a certificate or open a support ticket.

Two rules saved us real trouble here.

First, never create the routing rule before DNS points to you. If you do, the certificate challenge fails, cert-manager retries with growing delays, and if it happens across many domains you start hitting Let's Encrypt rate limits. We confirm DNS first and only then ask for a certificate.

Second, the backend's Kubernetes permissions are as narrow as we could make them. It can create and delete routing rules in the one namespace where customer sites live, and nothing else. This service is talking to the cluster API, so if it is ever compromised, the damage it can do should be small.

When a customer removes a domain, the same job deletes the routing rule and its certificate, so the cluster does not slowly fill up with dead certificates for domains we no longer serve.

## Working out the tenant inside Next.js

Once a request reaches the renderer, the app has to turn a hostname into a site. In the Next.js App Router we split this into two small steps.

Next.js middleware runs first on every request. Ours does one thing only: it reads the hostname and quietly rewrites the request to an internal route that includes that hostname. The visitor still sees www.acme.com/about in the browser. Internally, Next.js serves a route like /sites/www.acme.com/about, so the page code receives the hostname as a normal route parameter, the same way it would receive a product ID.

The page then looks up the site for that hostname, finds the page that matches the path, and renders it with that customer's theme. If there is no site for the hostname, or no page for the path, it returns a normal 404.

We keep the middleware dumb on purpose. It never calls the database. That keeps it fast, and it means a slow database cannot block every single request at the front door. All tenant logic lives in normal server code, where we have proper error handling, timeouts and logging.

## Caching tenants so the database does not take every hit

Every page view needs the site config: theme, navigation, pages and settings. Reading that from the database on every request works at 10 sites. At 100 sites with real traffic, it is the first thing that falls over.

So every lookup goes through Redis first. The key is the hostname, and the value is that site's config. If Redis has it, the database is never touched. If not, we read from the database once and store the result in Redis for five minutes.

The detail most people forget is caching the misses. Bots scan every public IP address all day, sending made-up hostnames. Without care, each one of those becomes a database query that finds nothing. We store "no site for this hostname" in Redis too, for a shorter time, so junk traffic stops at the cache.

The other half is invalidation. When a customer clicks Publish, the builder saves the new version and then immediately deletes the cache entries for every hostname that site owns, both its subdomain and any custom domains. The next visitor gets fresh content. We do not wait for the five-minute expiry, because "I published and nothing changed" would quickly become our most common support ticket.

## Isolating tenants that share a process

Sharing one renderer between all customers is what makes the platform cheap. It is also what makes it risky, because one bug or one heavy site can affect everyone. We handle that in three places.

**Data.** Every query that touches site data goes through a function that requires a site ID. The renderer has no "list all pages" query at all. The only way to reach any data is through a specific tenant, so one customer's page cannot leak into another customer's site because someone forgot a filter.

**Load.** Pages are rendered on the server and the HTML is cached, so a traffic spike on one site mostly hits the cache, not the CPU. On top of that, Kubernetes scales the renderer automatically on CPU usage, between a minimum of three copies and a maximum of twenty. The three-copy minimum is spread across different availability zones, so losing a server, or even a whole AWS zone, does not take any site offline.

**Visibility.** Every log line and every metric carries the hostname. When something goes wrong, the first question is always "is it one site or all of them?" With the hostname everywhere, we can answer that in seconds instead of guessing.

## Deploying without breaking 100 sites at once

When every customer runs on the same service, a bad deploy is not one broken site. It is all of them. Since we moved releases to the setup below, production incidents dropped by about 75%, and most of that came from making deploys boring and reversible.

Releases run through GitHub Actions. On every merge to the main branch, the pipeline logs in to AWS using short-lived OIDC credentials, so there are no long-lived AWS keys saved in GitHub. It builds a Docker image, pushes it to Amazon ECR, and rolls it out to EKS with Helm.

Three details in that pipeline matter more than they look.

**Every image is tagged with its Git commit.** We never deploy an image called "latest". Any running copy of the app can be traced back to the exact commit that produced it, and rolling back simply means deploying an older commit.

**Failed releases roll themselves back.** Helm waits for the new version to become healthy within five minutes. If it does not, Helm restores the previous version automatically and the pipeline fails. A broken release breaks the build, not the websites.

**Health checks test something real.** A container being "up" means very little. Our readiness check renders a real test site from start to finish, which touches the database and Redis. A new copy of the app that starts but cannot reach Redis never receives customer traffic.

Before a release reaches production, it also renders a set of real customer templates in staging. Templates are where regressions hide, because a small CSS or component change that looks fine on one template can break the layout of another.

## Keeping the bill flat as customers grow

Because a new site is a database row, cost follows traffic, not customer count. That is the main reason our cloud spend came down by 20 to 40% compared with running sites one by one. The rest came from a few simple habits.

The renderer stores nothing on its own disk, so it runs well on cheaper Spot instances. If AWS takes one back, Kubernetes simply starts the app elsewhere. Stateful parts, like Redis and the databases, stay on regular on-demand capacity or managed services.

We set each service's CPU and memory requests from real usage graphs, not guesses. Oversized requests are the most common reason an EKS cluster costs more than it should, because Kubernetes reserves capacity that is never used.

Images, scripts and styles are served through a CDN, so the cluster only spends its time rendering HTML.

## If you are building this today

The architecture above has held up well, but if I were starting from zero now, I would change two things.

First, I would not build on the community ingress-nginx controller. Kubernetes retired it in March 2026, which means no more releases and no more security fixes. The Kubernetes project recommends Gateway API as the replacement. Everything in this post still applies: hostname routing, a wildcard setup for subdomains, and per-domain certificates through cert-manager. Only the type of routing resource changes.

Second, I would put the hostname on every log line and metric from day one. We added it later, and the weeks before that were the hardest to debug.

The part I would keep exactly the same is the core decision. Treat a customer website as data, keep one well-tested renderer, and put your effort into routing, caching and safe deploys. That is what lets a small team run 100+ websites without the platform growing a new problem with every new customer.

---

*I'm Usman Hafeez, a System Architect and Full-Stack Tech Lead. I build multi-tenant SaaS platforms on AWS and Kubernetes, and AI agent features with LangChain and LangGraph. More of my work is at [usmanhafeez147.vercel.app](https://usmanhafeez147.vercel.app).*
