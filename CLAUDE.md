# vibe-coding

Personal repo for learning AI-assisted coding — experiments and notes.
Not production code, and nothing here is a dependency of anything else.

## Apps

Each app is one folder under `apps/` containing a single `index.html`.

- **Zero dependencies, no build step.** These have to still open and run years
  from now with nothing installed, and they must work from `file://`, not only
  over HTTP. Don't introduce a framework, bundler, or `package.json` unless I
  ask for one explicitly.
- Inline the CSS and JS in the same file. Splitting them out is fine once a
  file gets genuinely long — adding a build step to do it is not.
- The shelf at `apps/index.html` is hand-maintained; nothing scans the
  directory. A new app isn't done until it has a card there.
- `./serve.sh` serves the repo and opens the shelf.

## Notes

`notes/` is numbered by reading order, not by date — `00` is the map you read
first. One topic per file, and `notes/README.md` is the index; keep it current.

## Working style

- **Verify UI changes by loading the page and reading the console.** A written
  file is not evidence that it works, and this repo has no test suite to catch
  the difference.
- Branch names are bare and descriptive — `add-claude-md`, not
  `andyli86/add-claude-md`.
- Ask before adding a third-party MCP server. They run with my credentials, so
  the bar is "I read the source", not "it looked useful".
- Never commit secrets, API keys, or `.env` files.
