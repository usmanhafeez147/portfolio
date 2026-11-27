# Case Study: A Multi-Tenant Fleet Platform with Live GPS Tracking and an AI Assistant

## The problem

Passenger transport operators, running school buses, charter coaches and shuttle fleets, need to manage vehicles, drivers, routes and trips, and to show parents and passengers where their bus is right now.

The platform had to serve many operators from one system without any of them seeing each other's data. It had to work for very different users: dispatchers in an office, drivers on phones with weak signal, and parents who scan a QR code at a bus stop and have no account at all.

## What I built

**One API, six apps.** A single Node.js and Express API serves REST for normal data and Socket.IO for live updates, backed by MongoDB and Redis. Six clients use it: Next.js admin and customer portals, a native Kotlin driver app, an Expo driver app for iOS and Android, a web driver app, and a public tracking site. Business rules and permissions live in one place, so a change applies to every app at once.

**Live GPS tracking.** Driver apps stream positions over their existing Socket.IO connection while a trip is active. The server checks that the driver is assigned to that trip, drops impossible or inaccurate points so buses never appear to teleport, stores the latest position in Redis and broadcasts it. Route history and delay calculations run in the background, away from the live feed.

**Tenant and role isolation on the server.** Each vehicle and each operator has its own Socket.IO room, and the server decides who may join which room. A parent's QR code carries a short-lived, read-only token for one route, and public pages show only the bus position and estimated arrival. The Socket.IO Redis adapter lets the API run on several servers while rooms keep working.

**Built for real roads.** When a driver loses signal, the app keeps recording and sends the missed points on reconnect. They fill in the route history but are never replayed on the live map. Maps show when a position is stale instead of pretending a bus is parked.

**An AI assistant for operators.** Operators kept asking questions like "which buses are running late right now?" I added an MCP server with 29 tools, each designed around a real operator question, so an AI assistant can answer in plain language from live data. The tenant always comes from the signed-in user's token on the server, never from the model. Every tool reuses the API's existing role checks, all tools are read-only, and every call is logged.

## Results

- **One backend** serving six client apps across many operators, with tenant isolation enforced on the server.
- **Live tracking** that parents can open from a QR code without an account, while seeing nothing beyond their own route.
- **29 MCP tools** that let operators get answers in one question instead of clicking through several pages, safely scoped to their own fleet and role.

## What I would do differently

I would treat offline drivers and stale positions as a core feature from the first version. We added that after the first weeks in the field, and it changed how much operators trusted the map.

## Need something similar?

If you are building real-time tracking, a multi-tenant operations platform, or want an AI assistant to work safely with your live data, I can help with the architecture and the build. [Get in touch](/#contact).
