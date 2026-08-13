# Catch-up curriculum — 6 weeks, ~2–3 hours each

**Calibrated for:** someone who uses Claude Code / Cursor ad-hoc but has no CLAUDE.md, no skills,
no MCP config. **Goals:** ship personal projects faster, and understand the landscape.
**Format:** read [00-landscape-2026.md](00-landscape-2026.md) first, then work one week at a time.

Every week has the same shape:

- **Concept** — what it is, in a paragraph
- **Why it matters to you** — tied to shipping side projects, not enterprise scale
- **Do this** — concrete work in this repo
- **Done when** — how you know the week landed

The order is deliberate: each week's mechanism only makes sense once the previous one is in place.
Skipping to MCP in week 1 is the classic mistake — you end up wiring up connections for an agent
that doesn't yet know your conventions.

---

## Week 1 — The loop, and getting out of its way

**Concept.** An agentic session is a loop: the agent reads, plans, calls tools, and checks its
work. Most bad output comes from one of three things — the agent didn't have the context, it
wasn't told when to stop, or you asked for something underspecified and then corrected it five
times. The fix for all three is up front, not mid-session.

**Why it matters to you.** This is the highest-leverage week. Getting the first message right is
worth more than every prompt trick combined, and it's the difference between "the agent built
the wrong thing twice" and "it worked."

**Do this.**
1. Take one real task and write the first message as a **spec**, not a request. Include: the
   outcome, the constraints, and an explicit stopping point ("stop and show me the plan before
   writing any files").
2. Learn plan mode in your tool (Claude Code: shift-tab twice, or ask for a plan explicitly).
   Run the same task with and without it. Note the difference.
3. Look at your permission prompts. Whatever you approve every single time — `ls`, `git status`,
   test commands — allowlist it. Constant approving trains you to stop reading them.

**Done when.** You've done one task start-to-finish where you approved a plan before any code was
written, and you can say what plan mode changed about the result.

---

## Week 2 — Context engineering: CLAUDE.md

**Concept.** The agent starts every session knowing nothing about your preferences. A `CLAUDE.md`
at the repo root loads automatically and fixes that permanently. It holds what only you know:
architecture decisions, conventions, the quality bar, constraints and *why* they exist.

**Why it matters to you.** Every correction you type more than twice belongs in this file. It's
the difference between re-explaining your stack every session and never mentioning it again.

**Do this.**
1. Run `/init` in this repo to generate a starting `CLAUDE.md`, then **edit it down**. Generated
   ones are too long and too generic.
2. Add the things only you know: how you like this repo laid out, that apps stay dependency-free,
   that you prefer single-file HTML for experiments.
3. Write down the **why** next to each rule. "No build step — I want to open these in 3 years and
   have them still work" beats a bare "no build step".
4. Notice what it should *not* contain: generic virtues ("write clean code"), anything the model
   already knows, and things git history already records.

**Done when.** Your `CLAUDE.md` fits on one screen, every line is something the model couldn't
have guessed, and you've caught yourself *not* re-explaining something in a new session.

**Watch out for.** Bloat is the failure mode. This file costs tokens on every single request.
If it grows past a screen, the excess probably belongs in a skill (week 3).

---

## Week 3 — Skills

**Concept.** A skill is a folder with a `SKILL.md` — instructions loaded *only when relevant*,
via the three-tier progressive disclosure described in the landscape note. CLAUDE.md is "always
true"; a skill is "true when doing X."

**Why it matters to you.** It's how you package a repeatable procedure once and stop re-typing it.
And because it's an open standard now supported across 26+ tools, a skill you write here isn't
locked to one vendor.

**Do this.**
1. Pick a procedure you've done twice in this repo. Realistic candidate: **"scaffold a new app
   under `apps/`"** — create the folder, write `index.html` following house style, add a card to
   `apps/index.html`.
2. Create `.claude/skills/new-app/SKILL.md`. Frontmatter: `name` and `description` only.
3. **Spend real effort on the `description`.** It's a routing rule — it must say what the skill
   does *and when to invoke it*, because it's the only part the model sees until it fires.
   Compare: `"Creates apps"` (useless) vs `"Scaffold a new self-contained app under apps/ —
   use when the user asks to create, add, or start a new app in this repo."`
4. Keep the body under ~5k tokens. If you need more, put it in a reference file the body points to.
5. Test the trigger: start a fresh session and say "add a new app that does X." Did it fire?

**Done when.** You have a working skill that triggers without you naming it, and you can explain
why the description matters more than the body.

---

## Week 4 — MCP, and knowing when to skip it

**Concept.** MCP is an open protocol connecting agents to external systems. Read §2 of the
landscape note for the mechanics and the security record before you install anything.

**Why it matters to you.** Honestly? For solo side projects, **possibly not much.** The
filesystem and shell already cover most of what you need, and every MCP server is a live
connection running with your credentials. The goal this week is calibration — knowing what it's
for and when it's worth it — not accumulating servers.

**Do this.**
1. List the MCP servers already available to you. (In this setup: Atlassian, Google Drive/Calendar,
   Slack, Chrome browser automation, and more.) Use one for something real — have the agent read
   a doc from Drive or drive a browser task.
2. Ask the calibration question for each: *could the agent have done this with the shell?* If yes,
   the server is overhead.
3. Read a small third-party MCP server's source before ever installing one. Once. This is the
   week's real lesson — you'll never install one casually again.
4. **Optional, only if genuinely curious:** write a trivial MCP server (one tool, returns a fixed
   string). Understanding the shape is useful even if you never ship one.

**Done when.** You can state in one sentence when *you* would reach for MCP versus a skill versus
just letting the agent use the shell — and you've said "no" to at least one server you don't need.

---

## Week 5 — Verification: the part everyone skips

**Concept.** Agents are excellent at producing plausible work. The bottleneck in 2026 isn't
generation, it's knowing whether what got generated is right. Two mechanisms: **verification**
(the agent proves it works — runs the tests, loads the page, checks the output) and **evals**
(you re-run a fixed set of cases after changing your setup, so you know if a change helped).

**Why it matters to you.** This is what separates "I shipped it" from "I shipped something that
looks like it works." It's also the week that most directly makes you *faster*, because the
alternative is discovering the bug three sessions later.

**Do this.**
1. Add a verification step to your standard spec: not "build X" but "build X, then run it and
   show me it works." Notice how much this changes what comes back.
2. For this repo specifically: any app change should end with the agent actually loading the page
   and checking the console — not just asserting the file was written.
3. Build the smallest possible eval: a `notes/evals.md` with 3–5 prompts you re-run whenever you
   change `CLAUDE.md` or a skill. Record what good output looks like. That's it — that's an eval.
4. Try `/code-review` on a change you made and see what it catches that you didn't.

**Done when.** You have 3+ saved eval prompts, and you've caught at least one thing that "looked
done" but wasn't.

---

## Week 6 — Capstone: app #2, the whole loop

**Concept.** Put weeks 1–5 together on one real build, with no shortcuts.

**Do this.** Pick an app you actually want. Then run the full loop deliberately:

| Step | Using what you learned |
|---|---|
| Spec it | Week 1 — outcome, constraints, explicit stopping points |
| Let CLAUDE.md carry conventions | Week 2 — don't re-explain house style |
| Trigger the scaffolding skill | Week 3 — it should fire without prompting |
| Add a connection only if needed | Week 4 — default is no |
| End with verification | Week 5 — it runs, you saw it run |
| Re-run your evals | Week 5 — did anything regress? |

Then write `notes/what-i-learned.md`: what worked, what you'd change, which mechanism earned its
keep and which was overhead for a project this size. That last question is the real graduation —
knowing which parts of the harness *your* work actually needs.

**Done when.** App #2 is on the shelf at `apps/index.html`, and you built it noticeably faster
than app #1 would have taken.

---

## Beyond week 6

Roughly in order of usefulness for a solo builder:

- **Hooks** — deterministic automation on tool events (auto-format after every edit). Hooks run in
  the harness, not the model, so they're reliable in a way instructions aren't.
- **Subagents** — parallel fresh-context workers. Pays off when a task means reading across many
  files and you only want the conclusion.
- **The Claude API / Agent SDK** — for when the thing you're building *is* an AI app rather than
  built with one. Load the `claude-api` skill; it has the current model IDs and API shapes.
- **Writing a skill you share** — the open standard means a good skill works across tools.
