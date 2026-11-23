# Building Reliable IoT Messaging with NestJS, MQTT and MongoDB

Devices in the field do not behave like browsers. They lose power, drop off the network, reconnect with old data, and sometimes send the same message twice. If your backend assumes every message arrives once, in order, on time, it will slowly fill up with wrong data.

I have built backends for connected devices on a few products, including Fribe, a NestJS and MongoDB platform that talks to devices over MQTT, and Saferide, where we built the APIs and infrastructure for vehicle tracking, including how new devices get provisioned. This post collects the patterns that made those systems reliable. It is less about any one product and more about the decisions that matter whenever you connect real hardware to a backend.

## Why MQTT

MQTT is a lightweight publish and subscribe protocol built for devices with limited power and unreliable connections. Devices keep one long-lived connection to a broker, publish messages to topics, and subscribe to the topics they care about. The backend does the same. Nobody talks directly to anybody else.

That design fits devices well. A device does not need to know where the backend lives or how many backend instances are running. It only needs to reach the broker. The backend can restart, scale up or move to a new server without devices noticing.

## Topic design is your API design

With MQTT, the topic structure is effectively your API, and it is hard to change once thousands of devices are in the field. We spent real time on it before shipping anything.

The rule we settled on is that every topic says who the message belongs to and what kind of message it is, from broadest to most specific: the tenant, then the device, then the message type. Device telemetry goes on one kind of topic, status changes on another, and commands from the backend to the device on a separate one.

This structure does two useful things. The backend can subscribe to exactly the traffic it needs using wildcards, such as all telemetry for every device, without parsing everything. And the broker's access rules can be written per topic, so a device can only publish to its own topics and only read its own commands.

## Identity and provisioning

Every device needs its own identity. Shared credentials across a whole fleet mean one leaked password exposes every device, and you cannot cut off one bad device without cutting off all of them.

On Saferide, provisioning was a proper flow, not a manual step. A new device is registered in the platform first, tied to a tenant and a vehicle, and only then issued its own credentials for the broker. Until a device has been provisioned and assigned, the backend ignores anything it sends. When a device is retired or stolen, revoking its credentials cuts it off on its own without touching the rest of the fleet.

The same registry answers a question you will be asked constantly in support: "Is this device ours, which customer has it, and when did it last talk to us?"

## Choosing delivery guarantees deliberately

MQTT offers three quality of service levels: at most once, at least once, and exactly once. It is tempting to pick the strongest everywhere. It is usually a mistake.

High-frequency telemetry, like a position every few seconds, works fine with at most once delivery. If one point is lost, the next one arrives shortly after, and the extra overhead of stronger guarantees on every point costs battery and bandwidth.

Important events are different. A status change, an alarm or a completed transaction must not be lost, so those use at least once delivery. And at least once means exactly what it says: sometimes the same message arrives twice. The backend has to be ready for that.

## Making the backend idempotent

The most important pattern in any device backend is idempotency: processing the same message twice must have the same effect as processing it once.

Every important message carries a unique ID created by the device, plus the device's own timestamp. Before acting on a message, the backend checks whether that ID has already been processed. If it has, the message is acknowledged and ignored. In MongoDB, a unique index on the message ID makes this check reliable even when several backend instances process messages at the same time, because the database itself refuses the duplicate.

Device timestamps matter just as much. Devices that were offline send their buffered messages when they reconnect, often all at once and out of order. If the backend uses the time a message arrived, an old reading can overwrite a newer one. Using the device's timestamp, and refusing to replace a newer state with an older one, keeps the data correct.

## Transactions where money or state is involved

On Fribe, some device messages trigger changes that must happen together or not at all, such as recording an event and updating a balance or a usage counter. If the process crashes halfway through, you end up with one change applied and the other missing.

For those cases we used MongoDB multi-document transactions, wrapped in a NestJS service so the rest of the code did not have to think about them. The duplicate check, the event record and the related updates all happen inside one transaction. Either everything is written, or nothing is, and the message can be safely retried.

We kept transactions only where they were needed. Plain telemetry does not need them, and using them everywhere would only slow the system down.

## Structuring it in NestJS

NestJS has built-in support for MQTT as a microservice transport, which lets you handle MQTT messages with the same structure as HTTP controllers. We used that to keep message handling clean.

Each message type has its own handler. Incoming messages are validated against a schema before any business logic runs, so a device with buggy firmware cannot write malformed data into the database. Business logic lives in services that know nothing about MQTT, so the same logic can be triggered by a device message, an HTTP call or a test, which made it far easier to test.

## Watching the fleet

Finally, a device platform needs to notice silence. A device that stops sending messages does not raise an error, it just goes quiet.

We track the last time each device was heard from and flag devices that have been quiet longer than expected for their type. We also watch for the opposite problem: a device that suddenly sends far more messages than normal is often a firmware bug, and it is better to catch it before it fills your database.

## The short version

Design topics carefully, because they are your API. Give every device its own identity through a real provisioning flow. Choose delivery guarantees per message type. Assume every important message can arrive twice and out of order, and make processing idempotent. Use transactions only where partial writes would hurt. And watch for devices that go quiet.

None of these ideas are new, but skipping any one of them shows up later as data that is slightly wrong in ways that are very hard to trace.

---

*I'm Usman Hafeez, a System Architect and Full-Stack Tech Lead. I build multi-tenant SaaS platforms, IoT backends and AI agent features with Node.js, NestJS, AWS and Kubernetes. More of my work is at [usmanhafeez147.vercel.app](https://usmanhafeez147.vercel.app).*
