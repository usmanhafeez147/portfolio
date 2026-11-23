# Live GPS Tracking for a Multi-Tenant Fleet Platform with Socket.IO and Redis

When a parent scans the QR code at a school bus stop, they see the bus moving on a map in real time. Behind that small map is one of the busiest parts of the fleet platform I build for passenger transport operators.

The platform has one Node.js API and six client apps: Next.js admin and customer portals, a native Kotlin driver app, an Expo driver app for iOS and Android, a web driver app, and a public site where parents and passengers follow their bus. Driver apps send GPS positions, and everyone else watches them move.

This post explains how live tracking works across all of those clients: how positions flow in, how they reach exactly the right people, and what we learned keeping it reliable on real roads with real phones.

## One API, many clients

We made an early decision to keep a single backend: one Express API that serves REST for normal data and Socket.IO for live updates, backed by MongoDB and Redis. Every client, native or web, talks to the same API.

That decision saved us a lot of time. Business rules live in one place. A route change or a permission change applies to every app at once. And live tracking has one source of truth, so the admin map and the parent's map never disagree about where a bus is.

## How positions flow in

Driver apps send a position update every few seconds while a trip is active, with latitude, longitude, speed, heading and the device's own timestamp. Updates go over the existing Socket.IO connection rather than separate HTTP requests, because opening a new request every few seconds on a weak mobile network wastes battery and data.

The server does very little with each update on the hot path. It checks that the driver is authenticated and is actually assigned to an active trip on that vehicle, drops points that are obviously wrong, stores the latest position in Redis, and broadcasts it. Heavier work, like saving the full route history and calculating delays, runs in the background so it never slows down the live feed.

Throwing away bad points matters more than it sounds. Phone GPS jumps around, especially near tall buildings and in tunnels. A single bad reading can make a bus appear to teleport across the city. We drop points that imply an impossible speed since the last good point, and points with very poor reported accuracy. Parents do not need every point. They need a bus that moves believably.

## Getting each update to the right people only

This is the part where multi-tenancy really matters. Many operators share the same API, and a parent tracking one school bus must never see the rest of the fleet, let alone another operator's vehicles.

We use Socket.IO rooms. Each vehicle on an active trip has its own room, and each operator has an operator-wide room. When a position comes in, the server sends it to that vehicle's room and that operator's dispatch room, and nowhere else.

Who can join which room is decided on the server, never by the client. An admin's connection is authenticated, and the server puts it in their operator's dispatch room based on their role. A parent's QR code gives them a short-lived, read-only token for one route. The server checks that token and lets them join only the rooms for vehicles running that route. If a parent edits the request to ask for a different vehicle, the server simply refuses.

Public tracking pages also get less data than internal ones. A parent sees the bus position and the estimated arrival time. They do not see the driver's details, the full trip history or other passengers.

## Scaling Socket.IO across servers

A single Node.js process can hold a lot of connections, but not forever, and we wanted more than one instance for reliability anyway. The problem with running several instances is that a driver might be connected to one server while the parents watching that bus are connected to another.

The Socket.IO Redis adapter solves this. When one instance broadcasts to a room, the adapter passes the message through Redis to every other instance, and each one delivers it to its own connected clients. From the application's point of view, rooms work the same no matter how many servers are running.

We also keep the latest known position of every active vehicle in Redis. When someone opens a map, they get the current positions immediately from Redis instead of waiting a few seconds for the next update to arrive. That small detail makes the map feel live from the first moment.

## Dealing with real-world networks

Driver phones lose signal all the time: rural roads, underpasses, depots with bad coverage. The tracking system has to treat this as normal, not as an error.

When a driver app goes offline, it keeps recording positions locally and sends the missed points when it reconnects. The server accepts them, uses them to fill in the route history, but does not replay them on the live map, because an old point is not where the bus is now. That is why every update carries the device's own timestamp, not just the time the server received it.

On the watching side, the map shows when a position is stale. If we have not heard from a bus for a while, the marker fades and shows when it was last seen, instead of pretending the bus is parked. Being honest about missing data builds more trust than a map that silently stops moving.

Socket.IO handles reconnection on the client side, and after reconnecting, each client rejoins its rooms through the same server-side checks. Nobody keeps access just because they had it before a dropped connection.

## Keeping costs down

Live tracking is constant traffic, so small inefficiencies add up. A few habits helped. We only send position updates while a trip is active, not all day. We send only the fields that changed and that the viewer needs. And public viewers get updates at a gentler rate than dispatchers, because a parent does not need a new point every second to know the bus is two stops away.

## What I would keep, and what I would change

I would keep the single API serving every client, server-side room authorization, Redis for both the latest positions and cross-instance broadcasting, and the habit of filtering bad GPS points before anyone sees them.

What I would do earlier is treat offline drivers and stale positions as a core feature from the first version. We added that after the first weeks in the field, and it changed how much operators trusted the map.

Live tracking looks like a map with a moving dot. Most of the real work is making sure the right people see the right dot, that the dot is believable, and that it keeps working when the network does not.

---

*I'm Usman Hafeez, a System Architect and Full-Stack Tech Lead. I build multi-tenant SaaS platforms on AWS and Kubernetes, and real-time systems with Node.js, Socket.IO and Redis. More of my work is at [usmanhafeez147.vercel.app](https://usmanhafeez147.vercel.app).*
