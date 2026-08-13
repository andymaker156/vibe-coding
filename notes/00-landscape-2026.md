# The AI-coding landscape, August 2026

A map of the concepts, how they fit together, and which ones actually change how you work.
Written for someone who has used an agentic coding tool casually but hasn't configured one.

> Sources are listed at the bottom. Vendor docs and Anthropic-published material are reliable;
> the blog/statistics sources are secondary — treat specific numbers as indicative, not gospel.

---

## 1. The one-sentence version

The field moved from **"prompt a model and accept the diff"** to **"run an agent inside a
harness you configure."** Almost everything below — CLAUDE.md, skills, MCP, subagents, evals —
is a different piece of that harness.

```
        ┌───────────────────────────────────────────────┐
        │  THE HARNESS  (what you configure)            │
        │                                               │
        │   CLAUDE.md      standing instructions        │
        │   Skills         task-specific know-how       │
        │   MCP servers    connections to your systems  │
        │   Subagents      parallel / isolated workers  │
        │   Hooks          deterministic automation     │
        │   Permissions    what runs without asking     │
        └────────────────────┬──────────────────────────┘
                             │  assembles context for
                             ▼
              ┌──────────────────────────────┐
              │  THE MODEL  (Opus 5, etc.)   │
              └──────────────┬───────────────┘
                             │ emits tool calls
                             ▼
              ┌──────────────────────────────┐
              │  THE LOOP  plan → act → verify │
              └──────────────────────────────┘
```

The skill that got most valuable is **deciding what goes into the context window** — that's
what people mean by *context engineering*. Everything else is a mechanism for doing that well.

---

## 2. Vocabulary, decoded

### Context engineering
Choosing what the model sees each turn: which files, which tool definitions, how much history.
It replaced "prompt engineering" as the headline skill because with agents the prompt is only a
small slice of the context. The failure mode isn't a badly worded prompt — it's a context window
full of stale tool output and irrelevant files.

**Practical form:** a `CLAUDE.md` at the repo root, loaded automatically every session, holding
architecture decisions, conventions, and constraints. Plus discipline about starting fresh
sessions instead of letting one run for hours.

### Agent Skills / `SKILL.md`
A folder with a `SKILL.md` inside. Frontmatter has just two required fields — `name` and
`description` — followed by a Markdown body. It's an **open standard** Anthropic released on
2025-12-18, now supported across 26+ tools including Claude Code, OpenAI Codex, Gemini CLI,
Cursor, and VS Code.

The important idea is **progressive disclosure**, in three tiers:

| Tier | What loads | Cost |
|---|---|---|
| 1 | `name` + `description` of every skill, at startup | ~100 tokens each |
| 2 | Full `SKILL.md` body, only when the task matches | keep under ~5k tokens |
| 3 | Reference files the body points at, only when needed | on demand |

The consequence: **the `description` is a routing rule, not a summary.** It's the only part the
model sees by default, so it must say *what this does* **and** *when to use it*. This is the
single most common thing people get wrong.

### MCP (Model Context Protocol)
An open protocol for connecting agents to external tools and data — databases, ticket systems,
your company's internal APIs. Anthropic introduced it in November 2024; it's now the de facto
standard, with adoption by OpenAI, Google DeepMind, and Microsoft.

Rough scale as of mid-2026: the official registry lists ~9,600 servers, and one survey put 41%
of software organisations at limited-or-broad production use. The 2026-07-28 spec revision added
a stateless protocol core, multi-round-trip requests, header-based routing, cacheable list
results, and hardened authorization.

**The caveat that matters more than the hype:** MCP servers are a real attack surface. 30+ CVEs
were filed in Jan–Feb 2026 alone, and there have been production incidents (a cross-tenant data
leak at Asana; a path-traversal issue at Smithery affecting thousands of apps). An MCP server
runs with your credentials. Install third-party servers the way you'd install an unvetted
browser extension that can read your database — which is to say, rarely, and after reading it.

**Skills vs MCP — the distinction people fumble:**
- **Skill** = *knowledge*. "Here's how we write migrations in this repo." No network, no daemon,
  just Markdown the agent reads when relevant.
- **MCP** = *capability*. "Here's a live connection to the ticket system." A running server the
  agent can call.

If the thing you want to add is a procedure or a convention → Skill. If it's access to a system
the agent can't otherwise reach → MCP.

### Agentic engineering
Karpathy declared "vibe coding" passé in early 2026 and proposed *agentic engineering* for what
replaced it. Same tools, different discipline: **Plan → Execute → Verify** as an explicit loop,
with the human owning the plan and the verification rather than reviewing a finished diff.

### Spec-driven development
Writing a short spec before the agent starts, rather than steering conversationally as it goes.
The reported pattern from people shipping most: define the outcome and explicit stopping points
up front, because an underspecified task revealed one turn at a time produces worse output *and*
burns more tokens than the same task fully specified in the first message.

### Evals
A small fixed set of cases you re-run to check whether a change to your prompt/skill/harness
actually helped. For personal projects this can be as small as five saved prompts you re-run by
hand. Without it, every prompt tweak is superstition.

### Subagents
Spawning separate agents with their own fresh context windows for independent chunks of work
(search this, review that) so the main agent's context stays small. The main agent gets the
conclusion, not the file dumps.

---

## 3. Models, as of 2026-08

The current Claude family, for when you're choosing one in code:

| Model | ID | Context | $/MTok in | $/MTok out |
|---|---|---|---|---|
| Opus 5 | `claude-opus-5` | 1M | $5 | $25 |
| Sonnet 5 | `claude-sonnet-5` | 1M | $3 (intro $2 through 2026-08-31) | $15 (intro $10) |
| Haiku 4.5 | `claude-haiku-4-5` | 200K | $1 | $5 |
| Fable 5 | `claude-fable-5` | 1M | $10 | $50 |

Two API-shape facts worth knowing early, because tutorials written before 2026 get them wrong:

- **`temperature` / `top_p` / `top_k` are rejected** on current models. Steer with the prompt.
- **Fixed thinking budgets are gone.** Use `thinking: {type: "adaptive"}` and control depth with
  `output_config: {effort: "low"|"medium"|"high"|"xhigh"|"max"}`.

---

## 4. What's hype and what isn't

**Real, adopt it:** context engineering discipline · CLAUDE.md · skills · plan-before-execute ·
verification you actually run.

**Real but easy to over-invest in:** MCP (most personal projects need zero custom servers —
the filesystem and shell are already the best tools) · multi-agent orchestration (genuinely
useful at scale; usually overkill for one person's side project).

**Mostly noise:** "N× productivity" claims · anything promising you never read the code ·
prompt-template marketplaces.

The consistent finding across sources is unglamorous: **the people shipping most are the ones
who wrote things down** — a context file, a spec, a check they re-run.

---

## Sources

- [Agent Skills — Claude Platform Docs](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview)
- [The 2026-07-28 Specification — Model Context Protocol Blog](https://blog.modelcontextprotocol.io/posts/2026-07-28/)
- [MCP Roadmap 2026](https://a2a-mcp.org/blog/mcp-2026-roadmap)
- [The MCP Ecosystem in 2026 — ChatForest](https://chatforest.com/guides/mcp-ecosystem-2026-state-of-the-standard/)
- [Everything your team needs to know about MCP in 2026 — WorkOS](https://workos.com/blog/everything-your-team-needs-to-know-about-mcp-in-2026)
- [MCP Adoption Statistics 2026 — Digital Applied](https://www.digitalapplied.com/blog/mcp-adoption-statistics-2026-model-context-protocol)
- [NSA/CISA MCP security guidance (PDF)](https://media.defense.gov/2026/Jun/02/2003943289/-1/-1/0/CSI_MCP_SECURITY.PDF)
- [Agent Skills: Progressive Disclosure as a System Design Pattern — SwirlAI](https://www.newsletter.swirlai.com/p/agent-skills-progressive-disclosure)
- [Context Engineering: A Practical Guide for AI Agents — Sourcegraph](https://sourcegraph.com/blog/context-engineering)
- [Agentic Coding Best Practices — Blink](https://blink.new/blog/agentic-coding-best-practices)
- [The State of Vibe Coding 2026 — Kingy AI](https://kingy.ai/news/the-state-of-vibe-coding-2026/)
- [Beyond Vibe Coding: Agentic Engineering — Developers Voice](https://developersvoice.com/blog/ai-development/beyond_vibe_coding_agentic_engineering_playbook/)
- [Harness Engineering for Agentic AI Coding Tools (arXiv)](https://arxiv.org/pdf/2602.14690)
