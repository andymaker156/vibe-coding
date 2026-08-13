# apps/

One folder per app. Each is self-contained — no build step, no dependencies.

```
apps/
  index.html              # the shelf: links to every app
  flow-field-studio/
    index.html
```

## Run

From the repo root:

```sh
./serve.sh          # serves on http://localhost:8000/apps/ and opens it
```

Or just open a single app directly:

```sh
open apps/flow-field-studio/index.html
```

## Add a new app

1. `mkdir apps/my-app`
2. Create `apps/my-app/index.html`
3. Add a card for it in `apps/index.html`

Keep each app dependency-free if you can — a single `index.html` that runs from
`file://` is the easiest thing to share and the easiest thing to resurrect later.
