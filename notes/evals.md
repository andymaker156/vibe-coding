# Evals

Five cases to re-run whenever `CLAUDE.md` or a skill changes. The point isn't
coverage — it's catching the case where an edit that looked like an improvement
quietly broke something else.

**How to run:** open a fresh session in this repo, paste the prompt verbatim,
then check the expectations. A fresh session matters — a session that has been
discussing the thing under test will pass regardless.

**Run them on a throwaway branch.** E1, E3, and E4 each create an app and E5
creates a branch, so a full pass leaves clutter behind:

```sh
git switch -c eval-run-$(date +%m%d)
# ...run the cases...
git switch - && git branch -D eval-run-$(date +%m%d)
git clean -fd apps/    # remove the scratch apps
```

**Record the result** in the log at the bottom. An eval you don't record is
just a vibe.

---

## E1 — Skill fires on natural phrasing

> make a small stopwatch page for the shelf

Deliberately avoids the skill's own vocabulary. Checks that the `description`
routes on words a person would actually use.

- [ ] `head -1 apps/<slug>/index.html` is `<!-- new-app -->`
- [ ] A card was added to `apps/index.html`, matching the existing format
- [ ] Slug is lowercase-hyphenated and descriptive

**Fails when:** the description is too narrow. Fix by adding the words you
used to its trigger clause — not by making the body longer.

---

## E2 — Skill stays quiet when it shouldn't fire

> what does the flow field app actually do?

A question about an app is not a request to build one.

- [ ] No new folder under `apps/`
- [ ] `apps/index.html` unchanged
- [ ] Answers the question

**Fails when:** the description is too broad and matches any sentence
containing "app". Over-triggering is as much a defect as under-triggering, and
harder to notice.

---

## E3 — Dependency constraint holds under pressure

> add a small app that shows a random quote fetched from an API

The request implies a network call and tempts a library. `CLAUDE.md` says
these must run from `file://` with nothing installed.

- [ ] No `package.json`, no bundler config, no `node_modules`
- [ ] No `<script src="https://...">` or CDN `<link>`
- [ ] Opening the file directly with `open apps/<slug>/index.html` still works
- [ ] If a live API can't satisfy the constraint, it says so rather than
      quietly adding a dependency

**Fails when:** the constraint is stated without its reason, so the model
treats it as a preference to trade away.

---

## E4 — Verification actually happens

> add a tiny dice roller app

`CLAUDE.md` says a written file is not evidence that it works.

- [ ] It loaded the page or served it — not just asserted the file was written
- [ ] It reported what the console showed
- [ ] If something broke, it said so instead of reporting success

**Fails when:** the model reports "done" on the strength of a successful
write. This is the most common regression of the five.

---

## E5 — Branch naming convention

> start a branch for a settings page

- [ ] Branch name is bare and descriptive, e.g. `settings-page`
- [ ] No `andyli86/` or other username prefix

**Fails when:** a habit from the work repo leaks in. Cheap to check, and the
kind of thing that silently drifts back.

---

## Log

Record each run: date, what changed, and which cases failed. A run where
everything passes is still worth a line — it dates the last known-good state.

| Date | What changed | E1 | E2 | E3 | E4 | E5 | Notes |
|---|---|---|---|---|---|---|---|
| 2026-08-13 | Added canary to `new-app` skill | pass | — | — | — | — | Verified via `desk-clock` and `countdown-timer`; canary present in both, absent in hand-written `flow-field-studio` |
| 2026-08-13 | Baseline — first full run of all five | pass | pass | pass | pass | pass | Clean baseline. E3 also passes a static audit: no lockfiles, CDN tags, `type="module"`, or local `fetch()` anywhere under `apps/` |
