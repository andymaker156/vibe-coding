# ai-coding-hub

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

## Notes

- Keep each experiment self-contained in its own directory.
- Never commit secrets, API keys, or `.env` files.
