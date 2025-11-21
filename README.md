# Sentinel

Lint everything but your code.

## Monorepo layout
- `packages/sentinel`: CLI source, tests, and build tooling
- `docs`: Astro Starlight docs site

## Setup
Install all workspace dependencies from the repo root:

```bash
bun install
```

## Useful scripts
Run these from the repo root so they target the right workspace:

```bash
bun run test        # CLI tests
bun run lint:ci     # CLI lint (CI mode)
bun run build:prod  # CLI binary output to dist/
bun run docs:dev    # Docs dev server
bun run docs:build  # Docs production build
```
