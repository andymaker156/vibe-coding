# MCP calibration

Week 4. The goal isn't to add MCP servers — it's to know when one is the right
answer, and to notice the ones already costing you something for nothing.

## The decision rule

Three mechanisms overlap, and picking wrong is the common failure:

| Reach for | When | Cost |
|---|---|---|
| **The shell** | The agent can already get there with `git`, `curl`, `gh`, or the filesystem | None |
| **A skill** | You're teaching a *procedure* or convention — knowledge, not access | Tokens only when it fires |
| **An MCP server** | The agent genuinely cannot reach the system any other way | A live connection running with your credentials, plus tool definitions in context every session |

**Default to the shell.** For a solo project it covers nearly everything.
Reach for MCP only when the answer to *"could this be done with a shell
command?"* is a clear no.

## What's actually connected

Audited 2026-08-20 with `claude mcp list`, cross-referenced against MCP calls
in the 43 most recent session transcripts.

| Server | Status | Calls observed | Verdict |
|---|---|---|---|
| Atlassian Rovo | connected | 121 | Earning its place — Jira and Confluence have no shell equivalent |
| Slack | connected | 14 | Occasional but real |
| claude-in-chrome | connected | 5 | Genuinely un-shellable: driving a browser |
| Google Drive | connected | 2 | Marginal |
| Gmail | connected | 0 | Unused |
| Google Calendar | connected | 0 | Unused |
| Console | **needs auth** | 0 | Dead weight |
| Rootly | **needs auth** | 0 | Dead weight |
| Notion | **needs auth** | 0 | Dead weight |
| Sentry | **needs auth** | 0 | Dead weight |
| Lucid | **needs auth** | 0 | Dead weight |

**Half the configured servers have never been authenticated.** They can't
execute anything, but they aren't free — a configured server still occupies a
slot, gets health-checked at startup, and shows up as something to reason
about. Five of ten is the finding worth acting on.

## The refusal

Declined this week: adding any new server. Nothing in this repo needs one —
apps are static HTML, the shelf is a file, and deployment is `git push`. The
shell covers all of it.

Also declined: authenticating the five idle servers just to make the list
green. An unused connection with live credentials is worse than no connection.

## Why the bar is high

MCP servers run with your credentials. 2026 has the incident record to match:
30+ CVEs filed in January and February alone, a cross-tenant data leak at
Asana, and a path-traversal issue at Smithery that exposed thousands of apps.
NSA and CISA published dedicated guidance in June.

The bar for a third-party server is **"I read the source"**, not "it looked
useful" — which is what `CLAUDE.md` already says.

## When I *would* add one here

For honesty, the rule needs a positive case. A server would be justified if
this repo ever needed the agent to read from a system with no CLI and no
public API — a design tool's live document state, say. Until then, no.
