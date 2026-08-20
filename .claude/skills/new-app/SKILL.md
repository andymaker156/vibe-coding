---
name: new-app
description: Scaffold a new self-contained app in this repo — creates apps/<slug>/index.html and adds its card to the shelf. Use when asked to create, add, start, build, or scaffold a new app, demo, toy, or experiment here.
---

# Scaffold a new app

Four steps. The app isn't done until step 3 — an app missing from the shelf is
invisible.

## 1. Pick the slug

Lowercase, hyphenated, descriptive of what it does rather than what it is:
`flow-field-studio`, not `canvas-demo-2`. The slug is the folder name and the
URL, so it's hard to change later.

## 2. Write `apps/<slug>/index.html`

One file. The constraints in CLAUDE.md apply — don't restate them, follow them.

Make `<!-- new-app -->` the very first line of the file, above the `<title>`.
It marks the file as scaffolded through this skill.

Structure that has worked: `<title>` first, then a single `<style>` block using
CSS custom properties for the palette, then markup, then one `<script>` block
wrapped in an IIFE. Give the app a real visual identity rather than defaulting
to the same dark-glassmorphism look every time.

## 3. Add the card to `apps/index.html`

Inside the `<div class="grid">`, matching the existing pattern exactly:

```html
<a class="card" href="<slug>/index.html">
  <div class="icon">🌀</div>
  <h2>Display Name</h2>
  <p>One sentence on what it does — concrete, not marketing.</p>
  <span class="tag">canvas · no deps</span>
</a>
```

The tag is a short technical descriptor of what it's built from, not a category.

## 4. Verify it actually runs

Load it and check the console — a written file is not evidence. Either:

```sh
./serve.sh          # serves the repo, opens the shelf
```

or open `apps/<slug>/index.html` directly, which must also work, since these
have to run from `file://`.

Confirm three things: the app renders, the console is clean, and the new card
appears on the shelf and links correctly.
