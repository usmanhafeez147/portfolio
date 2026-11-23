# Letting an AI Assistant Query Live Fleet Data Safely with an MCP Server

I build a multi-tenant platform for passenger transport operators: school buses, charter coaches and shuttle fleets. Operators manage vehicles, drivers, routes and trips, drivers run their shifts from a mobile app, and parents follow the bus live from a QR code.

A few months in, the most common request from operators was not a new screen. It was a question. "Which buses are running late right now?" "Which driver has the most trips this week?" "Is route 12 still on the old schedule?" The answers were all in our system, but getting them meant clicking through three or four pages.

So we added an MCP server. It exposes 29 tools that let an AI assistant read live fleet data and answer those questions in plain language. This post is about how we built it, and mostly about how we kept it safe, because giving an AI model access to production data across many tenants is easy to get wrong.

## What MCP gives you

The Model Context Protocol is an open standard for connecting AI assistants to outside systems. Instead of writing a custom integration for every assistant, you build one MCP server that describes a set of tools: their names, what they do, and what inputs they take. Any MCP-compatible client can then discover those tools and call them when a user's question needs them.

For us, that meant the fleet platform did not need its own chatbot. An operator can use an assistant they already know, connect it to our server, and ask questions about their own fleet.

## Designing tools around questions, not tables

Our first instinct was to expose the database: a tool to list vehicles, a tool to list trips, a tool to list drivers. That worked badly. The assistant had to pull large lists and do the filtering itself, which was slow, expensive in tokens, and sometimes wrong.

What worked was designing each tool around a question an operator actually asks. "Get vehicles that are currently off route." "Get today's trips for a driver." "Get late arrivals for a route in a date range." Each tool does the filtering on the server, where the data and the indexes live, and returns a small, focused answer.

That is how we ended up with 29 tools rather than five. Small tools with clear names and descriptions are easier for the model to pick correctly. The tool description is part of the interface. We wrote each one the way you would explain it to a new team member: what it returns, when to use it, and what it does not cover. When the assistant picked the wrong tool, the fix was almost always a better description, not more code.

We also kept the output shape boring and consistent. Every tool returns plain, labeled fields with units in the name: minutes late, distance in kilometers, times with their time zone. Ambiguous output is where models make things up, so we removed as much ambiguity as we could.

## Tenant isolation comes first

The platform is multi-tenant. Many operators share the same API and the same database. The single most important rule for the MCP server was that an assistant connected for one operator can never see another operator's data, no matter what the user types.

We did not trust the model to enforce that. The model never chooses the tenant. When an assistant connects, it authenticates with a token tied to one user in one tenant. Every tool call runs through the same authorization layer as our normal API, and the tenant is taken from that token on the server, never from the tool's inputs. There is simply no parameter the model could fill in to ask for someone else's fleet.

This matters because prompt injection is real. A trip note, a driver's name or a route description could contain text that tries to steer the assistant. If the security boundary lived in the prompt, one clever string could break it. Because it lives in the server, the worst a manipulated assistant can do is ask for data the user was already allowed to see.

## Respecting roles, not just tenants

Inside one operator, people have different roles. A dispatcher sees live operations. A finance user sees billing. A driver sees their own trips. The web portals already enforce this through role-based access control, and the MCP server had to follow exactly the same rules.

We reused the existing permission checks instead of writing new ones for the AI path. Every tool declares which permission it needs, and the server checks it before running anything. If a user without access to driver records asks about a driver's hours, the tool returns a clear "not permitted" message. The assistant passes that on instead of guessing.

Reusing the same checks was a deliberate choice. Two separate permission systems drift apart over time, and the AI path would quietly become the weaker one.

## Read-only by default

Every one of the first set of tools only reads data. Nothing the assistant does can cancel a trip, reassign a driver or change a route.

Write actions are tempting, and some operators asked for them. But a wrong answer from a read tool is an annoyance, while a wrong action on a live fleet can leave children waiting at a bus stop. If we add write tools later, they will need an explicit confirmation step from the human, and they will be limited to small, reversible actions.

## Keeping it fast and cheap

Assistants often call several tools to answer one question, so slow tools add up quickly. Most of our tools read from data that is already hot. Live vehicle positions sit in Redis, because the tracking system writes them there anyway, so "where is bus 14 right now" never touches the main database. Heavier questions, like weekly trip counts, use indexed queries with date limits that the server enforces even if the assistant asks for more.

We also cap how much any tool can return. If a question would produce hundreds of rows, the tool returns a summary and the top results, and says how many more exist. That keeps responses small for the model and stops a broad question from turning into a heavy database scan.

## Logging every call

Every tool call is logged with the user, the tenant, the tool name, the inputs and how long it took. This gave us three things.

It gave us security visibility: if anything ever looked wrong, we could see exactly what was asked and what was returned.

It gave us a roadmap: the logs showed which questions people asked most, and which questions the assistant could not answer with the tools it had. Several of the later tools came straight from those gaps.

And it gave us quality data: when an operator said the assistant gave a wrong answer, we could replay the exact tool calls and see whether the data was wrong or the model misread it.

## What I would tell someone starting today

Design tools around real questions, keep them small, and spend real time on their descriptions. Put tenant and role checks in the server, never in the prompt, and reuse the checks your API already has. Start read-only. Log everything.

Most of the work in a good MCP server is not AI work at all. It is ordinary backend engineering: clear interfaces, strict authorization and fast queries. The model is only as useful, and only as safe, as the tools you give it.

---

*I'm Usman Hafeez, a System Architect and Full-Stack Tech Lead. I build multi-tenant SaaS platforms on AWS and Kubernetes, and AI agent features with LangChain, LangGraph and MCP. More of my work is at [usmanhafeez147.vercel.app](https://usmanhafeez147.vercel.app).*
