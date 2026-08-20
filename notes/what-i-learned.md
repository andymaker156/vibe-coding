# What I learned

Week 6 retrospective. The facts are filled in from what actually happened;
the verdicts are mine to write — that's the point of the exercise.

---

## What got built

| Week | Artifact | Where |
|---|---|---|
| 1 | Permission allowlist | `.claude/settings.json` + `~/.claude/settings.json` |
| 2 | Standing instructions | `CLAUDE.md` |
| 3 | Scaffolding skill | `.claude/skills/new-app/SKILL.md` |
| 4 | MCP decision rule + audit | `notes/02-mcp-calibration.md` |
| 5 | Eval suite | `notes/evals.md` |
| 6 | Capstone | `apps/context-budget/` |

Four apps on the shelf, up from zero. Three of them scaffolded through the
skill; the first written by hand before the skill existed.

## What the evidence showed

- **The skill fired with no tuning.** Two requests that never used its
  vocabulary — "add a little clock app to the shelf", "make a tiny countdown
  timer page" — both triggered it. The description's synonym list covered
  phrasings that matched no listed verb-noun pair exactly.
- **Verification only became real once there was a canary.** Every other
  signal was confounded: `CLAUDE.md` already required the shelf card, and
  `apps/index.html` already contained a card to copy. The marker was the first
  check that could distinguish a fired skill from careful improvisation.
- **Getting the test right took three attempts.** The first canary was left
  uncommitted in a different worktree, so it never reached the run. The
  discriminator before that was confounded. The test design was harder than
  the thing it tested.
- **MCP's answer was no.** The audit found ten configured servers, five never
  authenticated and two more unused. The useful question turned out to be
  "why do I have these?" rather than "should I add one?".
- **`CLAUDE.md` earns its keep through drift, not setup.** The entries that
  matter most were added after friction: the `gh` account switch, the bare
  branch-name rule. Both came from mistakes made in the same session.

## Verdicts — to fill in

Answer these from experience, not from what the curriculum claimed:

**Which mechanism earned its keep?**
> …

**Which was overhead at this scale?**
> …

**What would I skip if I were teaching someone else this in an afternoon?**
> …

**Did the capstone actually go faster than app #1?**
> Flow Field Studio was hand-written with no harness. Context Budget had
> `CLAUDE.md`, a skill, an eval suite, and a spec written up front.
> …

**What's still unpracticed?**
> Week 1's spec-first habit and plan mode. The capstone had a real spec written
> before any code, but that's one data point, not a habit.
> …

## Loose ends

- The Chrome extension isn't connected, so "load the page and read the console"
  — the rule in `CLAUDE.md` — can't currently be done directly. The workaround
  was executing the script in a stubbed DOM under Node. Worth fixing, since the
  rule assumes a capability that isn't there.
- E2, the negative eval case, has never caught anything. It's the case most
  likely to matter and the least exercised.
- Seven idle MCP servers are still configured.
