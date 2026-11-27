# Tracing AI Agents with OpenTelemetry: What the GenAI Conventions Actually Say in 2026

An AI agent is hard to debug from logs alone. One user request can turn into a planning step, three model calls, four tool calls, a handoff to a sub-agent and a retry. When the answer comes back wrong, slow or expensive, you need to see that whole chain, in order, with timings and token counts.

That is a tracing problem, and OpenTelemetry is the obvious tool. OpenTelemetry already traces your HTTP services and databases. Its GenAI semantic conventions extend the same idea to model calls, tool calls and agent runs, so every tool and vendor can agree on what an "agent span" looks like.

There is a lot of confusing advice about these conventions online, including posts that call them stable. They are not. This post covers where they actually stand in late 2026, what the main spans and attributes are, and how to instrument an agent so your traces stay useful as the spec keeps moving.

## Where the conventions live now

The first thing to know is that the GenAI conventions moved. On 12 June 2026, with semantic-conventions release v1.42.0, OpenTelemetry deprecated the GenAI conventions in its main repository and moved them, together with the OpenAI-specific and MCP conventions, into a dedicated repository: `open-telemetry/semantic-conventions-genai`. The move was made so this area could change faster than the core project's stability rules allow.

If you follow an old link to the GenAI pages on opentelemetry.io today, you get a notice that they have moved and are no longer maintained there. Bookmark the new repository instead.

The second thing to know is the status. The GenAI and agent conventions are marked "Development". That means names and shapes can still change between releases. It does not mean you should wait. It means you should instrument in a way that is easy to update, which we will come back to.

## The span types that matter

The conventions define a small set of operations, each identified by the `gen_ai.operation.name` attribute. For a typical agent, four kinds of spans tell most of the story.

**Model calls.** Each call to a model is a client span. The span name combines the operation and the requested model, so a chat call becomes `chat` followed by the model name. Key attributes include `gen_ai.provider.name`, `gen_ai.request.model`, `gen_ai.response.model`, `gen_ai.usage.input_tokens` and `gen_ai.usage.output_tokens`.

**Tool calls.** When the agent runs a tool, you record an `execute_tool` span named after the tool, for example `execute_tool search_orders`, with `gen_ai.tool.name` and the call id from the model's tool request. This is the span that tells you which tool was slow or failed.

**Agent invocation.** An agent run inside your process is an `invoke_agent` span. The convention names it `invoke_agent {gen_ai.agent.name}`, or just the operation when no name is available, and its kind is INTERNAL. Its required attribute is `gen_ai.operation.name`. The agent name, the conversation id and `error.type` are conditionally required, and the model and token usage are recommended. For workflows, the convention also allows `invoke_workflow`.

**Agent creation and planning.** If your framework creates agents on a provider's platform, there is a `create_agent` span of kind CLIENT, which requires `gen_ai.provider.name`. There is also a `plan` operation for planning steps.

Nested together, a single request looks like a tree: one `invoke_agent` span at the top, with `chat` and `execute_tool` spans under it in the order they happened.

## The attribute rules people get wrong

A few notes in the spec save a lot of pain later.

**Agent names must be low cardinality.** Use a stable name you chose, such as `support-triage` or `order-lookup`. Do not use framework defaults or class names like "StateGraph", and never put a user id or request id in the name. Otherwise every dashboard grouped by agent name turns into thousands of one-off rows.

**Only set a conversation id that already exists.** `gen_ai.conversation.id` should come from your application, such as a chat thread id. The spec says not to invent one from a random UUID, the trace id or a hash of the content just to fill the field.

**Know what token counts include.** Input tokens include cached tokens, and output tokens include reasoning tokens. If you compare these numbers with your provider's bill, keep that in mind before you conclude something is wrong.

**Use a real error type.** `error.type` should be the provider's or library's error code or the exception name, with `_OTHER` as the fallback. That makes error rates comparable across providers.

## Prompts and responses are opt-in, for good reason

The conventions do define attributes for the actual content: `gen_ai.input.messages`, `gen_ai.output.messages`, `gen_ai.system_instructions` and `gen_ai.tool.definitions`. Each also has a `_ref` variant that points to content stored elsewhere instead of putting it on the span.

All of these are opt-in, and the spec warns that they can contain sensitive data and personal information. Treat that seriously. Prompts often contain customer names, emails, order details and sometimes things users should never have pasted. A good default is:

- Record content in development and staging, where it helps most when debugging.
- In production, record metadata only: model, tokens, timings, tool names, errors.
- If you need content in production, send it to separate storage with its own access control and retention, and put only the reference on the span.

The spec also notes that output messages should not be made up for failed operations. If a call failed, the span should show the error, not a placeholder answer.

## Instrumenting an agent in practice

There are two ways to get these spans. The first is an instrumentation library for your framework or SDK. Many popular frameworks and vendor SDKs now emit GenAI spans, and observability platforms such as Datadog document support for ingesting traces that follow the OpenTelemetry GenAI conventions. If your stack has a maintained instrumentation, start there.

The second is to add spans yourself around the parts of the agent loop you control. Even with library instrumentation, you usually want your own `invoke_agent` span at the top so the whole run has one root with your agent name on it. In Python it looks like this:

```python
from opentelemetry import trace

tracer = trace.get_tracer("support-agent")

def run_agent(conversation_id: str, user_message: str):
    with tracer.start_as_current_span(
        "invoke_agent support-triage",
        kind=trace.SpanKind.INTERNAL,
        attributes={
            "gen_ai.operation.name": "invoke_agent",
            "gen_ai.agent.name": "support-triage",
            "gen_ai.conversation.id": conversation_id,
        },
    ) as span:
        result = agent_loop(user_message)
        span.set_attribute("gen_ai.usage.input_tokens", result.input_tokens)
        span.set_attribute("gen_ai.usage.output_tokens", result.output_tokens)
        return result.answer


def call_tool(name: str, call_id: str, args: dict):
    with tracer.start_as_current_span(
        f"execute_tool {name}",
        kind=trace.SpanKind.INTERNAL,
        attributes={
            "gen_ai.operation.name": "execute_tool",
            "gen_ai.tool.name": name,
            "gen_ai.tool.call.id": call_id,
        },
    ) as span:
        try:
            return TOOLS[name](**args)
        except Exception as exc:
            span.set_attribute("error.type", type(exc).__name__)
            span.set_status(trace.Status(trace.StatusCode.ERROR))
            raise
```

Model call spans usually come from your provider SDK's instrumentation and nest under these automatically, because they run inside the current span's context.

The same structure works in Node.js with `@opentelemetry/api`, and in any language with an OpenTelemetry SDK.

## Keeping up with a spec that still moves

Because the conventions are in Development, plan for renames. A few habits make that cheap:

- **Put the attribute names in one place.** A small constants module, rather than strings scattered across the code, turns a rename into a one-line change.
- **Check what your libraries emit.** Instrumentation libraries often let you choose between older and newer GenAI attribute names, commonly through the `OTEL_SEMCONV_STABILITY_OPT_IN` environment variable. Read your library's docs and pick one on purpose, so your dashboards do not silently mix both.
- **Pin and read changelogs.** Pin your instrumentation versions and read the release notes of the `semantic-conventions-genai` repository before upgrading.
- **Build dashboards on a few core fields.** Agent name, operation, model, token counts, duration and error type are the most settled parts. Fancier views can wait until the spec settles further.

## What good agent tracing gives you

Once the spans are in place, the questions that used to take an afternoon take a minute. Which tool is slowest? Which agent uses the most tokens per request? Did yesterday's prompt change increase retries? Which model errors are rate limits and which are bad requests? Why did this one conversation cost ten times the average?

Agent systems are only going to get more complex: more tools, more sub-agents, more models per request. OpenTelemetry's GenAI conventions are not finished, but they are already the shared vocabulary that most of the tooling is converging on. Instrument with them now, keep the names in one place, and your traces will grow with your agents instead of being rewritten every quarter.
