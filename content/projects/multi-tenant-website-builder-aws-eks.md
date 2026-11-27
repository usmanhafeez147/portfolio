# Case Study: A Multi-Tenant Website Builder Serving 100+ Sites on AWS EKS

## The problem

Teamcube builds a no-code website builder. A customer picks a template, edits pages and publishes, and expects the site to be live on its own subdomain or on their own domain, with HTTPS, within minutes.

When I joined in March 2024, the hard part was not building pages. It was running a growing number of customer sites without the platform, the cloud bill and the team's workload all growing in a straight line with every new customer. Treating each site as its own deployment meant every security patch turned into dozens of builds, configuration drifted between sites, and a bad release could take many of them down.

## What I built

I lead the architecture and a team of four to six developers. The platform is built around one decision: a customer website is a row in a database, not a deployment.

**One renderer for every site.** A single Next.js service on Amazon EKS serves every customer site. It reads the hostname of each request, finds the site that owns it, and renders that site's pages with its theme. Adding a customer adds data, not infrastructure.

**Presets for non-technical admins.** Admins can spin up category-specific websites, such as AI tool directories, e-commerce stores and SaaS sites, from templates, without writing code.

**Automatic domains and HTTPS.** Every site gets a free subdomain, served through one wildcard routing rule and a wildcard certificate. For a custom domain, the customer adds one DNS record. The backend waits until DNS points to the platform, then creates a routing rule for that domain alone, and cert-manager issues a Let's Encrypt certificate for it. Nobody uploads certificates or opens a support ticket.

**Caching that protects the database.** Every lookup of a site's configuration goes through Redis first, keyed by hostname. Misses are cached too, so bots probing made-up hostnames never reach the database. Publishing clears the cache for every hostname a site owns, so changes appear at once.

**Tenant isolation inside a shared service.** Every data query requires a site ID, so one customer's pages cannot leak into another's. Pages are rendered on the server and cached, and Kubernetes scales the renderer between three and twenty copies across availability zones. Every log line and metric carries the hostname, so the first question in any incident, "one site or all of them?", takes seconds to answer.

**Releases that roll themselves back.** I moved releases to GitHub Actions. Each merge builds an image tagged with its Git commit, pushes it to Amazon ECR and rolls it out with Helm using short-lived OIDC credentials, so no AWS keys live in GitHub. If the new version is not healthy within five minutes, Helm restores the previous one. The readiness check renders a real test site end to end, and real customer templates are rendered in staging before production.

## Results

- **100+ websites** generated and deployed by the platform.
- **70% less time** to launch a new site.
- **75% fewer production incidents** after the move to the GitHub Actions and Helm release process.
- **20 to 40% lower cloud costs**, because cost now follows traffic rather than customer count. The stateless renderer also runs on cheaper Spot instances, and resource requests are set from real usage.

## What I would do differently

I would put the hostname on every log line and metric from the first day; we added it later, and the weeks before that were the hardest to debug. For a new build today, I would also use Gateway API instead of the community ingress-nginx controller, which Kubernetes retired in March 2026.

## Need something similar?

If you are running many customer sites, stores or tenants and the platform is getting harder to operate with each one, I can help you design or migrate to a multi-tenant architecture like this. [Get in touch](/#contact).
