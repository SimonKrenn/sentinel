---
title: Configuration
description: Configure providers and plugins for Sentinel.
---

Sentinel loads configuration from `sentinel.config.ts` or `sentinel.config.js` in the current working directory. The exported
object follows the `SentinelConfig` type.

## Provider

Field: `provider?: "auto" | "local" | "gitlab" | "github" | "bitbucket"`

- Defaults to `local` when unset.
- Determines how Sentinel resolves pull request metadata and diffs and where it posts the final report.

## Settings

Field: `settings?: Record<string, unknown>`

- A free-form object passed to plugins via the `ctx.settings` property.
- Use this for shared configuration such as API keys or thresholds.

## Plugins

Field: `plugins?: (SentinelPlugin | string)[]`

- Accepts inline plugin objects or module specifiers that export a plugin.
- Plugins may implement two lifecycle hooks:
  - `setup(ctx)` runs before any provider data is fetched.
  - `run(ctx, diff, pr)` runs after Sentinel has collected the pull request diff and metadata.
- Use the shared reporter (`ctx.report`) to emit `info`, `warn`, or `fail` messages. Sentinel aggregates these into a Markdown
  summary and posts a single comment through the active provider.

### Plugin context

Each plugin receives a `SentinelContext` with:

- `provider`: the resolved provider instance
- `cwd`: the current working directory
- `env`: environment variables
- `report`: helper for producing the aggregated report
- `settings`: configuration from `SentinelConfig.settings`
- `readFile`: helper for reading files relative to the current working directory

### Diff data

When the provider supplies file changes, each `DiffFile` entry includes the path and status (`added`, `modified`, `deleted`, or
`renamed`). Use this to scope your plugin work to the files that changed in the pull request.
