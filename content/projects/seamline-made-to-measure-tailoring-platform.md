# Case Study: Seamline, a Multi-Tenant Platform for Made-to-Measure Tailoring Shops

## The problem

Made-to-measure clothing is hard to sell online. A customer wants to see their shirt or suit in the exact fabric, collar and cut they chose before paying, and a tailoring shop needs orders to arrive with every measurement and option recorded correctly.

Most tailoring shops cannot build that themselves. Seamline is my answer: a platform that gives each shop its own branded online store with a garment designer, plus the tools to run orders, both online and in the shop.

## What I built

Seamline is a monorepo of independent apps around one API, each with its own Dockerfile and settings.

**Branded storefronts.** Each shop gets a Next.js storefront on its own subdomain or custom domain, with its own branding. Customers browse collections and fabrics, design a garment, check out and track their orders. A second storefront focuses on the dress shirt and its 3D designer alone, running on the same backend.

**A 3D garment designer.** Customers see their shirt or suit jacket in 3D in the fabric they picked. The 3D models are built and adjusted in Blender, with fabric photo tools that turn real cloth photos into textures. The designer covers options such as collars, cuffs, sleeves and fit.

**Portals for shops and for the platform.** Shop teams (admins, managers and staff) run their catalogue, orders, customers and settings in an admin portal built on Next.js 16, Tailwind, Redux Toolkit with RTK Query, and TanStack Table. Each shop sets its own returns policy, payment options and contact details. A separate platform portal is where I create shops, manage their domains, assign plans and per-shop limits, and send invoices.

**An in-store kiosk app.** For shops that sell in person, an Electron app for Windows and macOS runs the storefront and designer on a tablet. The shop's team signs in, designs the garment with the customer, and places the order, paid in cash, on the card machine, by bank transfer, or later with a deposit. It is a paid add-on that the platform switches on per shop.

**An MCP server for platform admins.** An AI assistant can do platform admin work, such as creating shops, managing domains and plans, and checking invoices, through an MCP server that calls the platform API exactly as the portal does. Support accounts can only read, owner accounts can also make changes, destructive tools are marked so clients ask before running them, and every change lands in the audit log.

**Backend and jobs.** An Express and MongoDB API serves every app, with a separate jobs service on Redis for scheduled and queued work such as plan renewals, renewal invoices and custom domain checks, so a slow job never holds up the API. Shared domain files, including the catalogue, pricing rules, money, shipping and order statuses, are kept in sync across the apps by a check that fails the build when copies drift.

## Results

- **One platform** serving branded storefronts, shop admin, platform admin and an in-store app from a single API.
- **A live demo store** at [shop.thewebsters.tech](https://shop.thewebsters.tech), with its sitemap and Search Console set up so its product pages can be found.
- **Built to sell:** plans, per-shop limits, invoices and the kiosk add-on are part of the platform, not an afterthought.

## Need something similar?

If you want a multi-tenant commerce platform, a product configurator, or an in-store app that shares one backend with your online store, I can help you plan and build it. [Get in touch](/#contact).
