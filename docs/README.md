# Sentinel Docs

Documentation for Sentinel, the "lint everything but your code" tool.

## Project structure

```
.
├── public/          # Static assets served as-is
├── src/             # Starlight content, assets, and config
│   ├── assets/      # Images and shared media
│   ├── content/     # Markdown/MDX documentation pages
│   └── content.config.ts
├── astro.config.mjs # Starlight site configuration
├── package.json
└── tsconfig.json
```

## Commands

Run these from the `docs/` directory or via the workspace scripts in the repo root:

| Command | Action |
| --- | --- |
| `bun install` | Install documentation dependencies |
| `bun run dev` | Start the docs dev server at `localhost:4321` |
| `bun run build` | Build the production site to `./dist/` |
| `bun run preview` | Preview the production build locally |

You can also run the root-level scripts (`bun run docs:dev`, `bun run docs:build`, `bun run docs:preview`) to target this workspace from the monorepo root.
