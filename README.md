# vibe-coding

Personal hub for learning AI-assisted coding — notes, prompts, agent skills, and experiments.

## Layout

```
apps/         # small self-contained apps, one folder each
notes/        # what I learned, per topic
prompts/      # reusable prompts
skills/       # Claude Code agent skills
experiments/  # throwaway projects
```

## Run the apps

```sh
./serve.sh    # http://localhost:8000/apps/
```

See [apps/README.md](apps/README.md) for how to add a new one.

## Learning track

- [notes/00-landscape-2026.md](notes/00-landscape-2026.md) — what MCP, skills, and context engineering actually are
- [notes/01-curriculum.md](notes/01-curriculum.md) — 6-week plan, ~2–3 hours/week, each week builds something here

## Notes

- Keep each experiment self-contained in its own directory.
- Never commit secrets, API keys, or `.env` files.
