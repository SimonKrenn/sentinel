---
title: Getting started
description: Build the Sentinel binary and run a local check with a custom plugin.
---

Use Sentinel to run non-code checks against your pull requests. These steps walk through installing dependencies, configuring a plugin, and executing a check locally.

## Prerequisites

- [Bun](https://bun.sh/) for running the workspace scripts
- A POSIX shell environment

## Install dependencies

From the repository root, install all workspaces:

```bash
bun install
```

The workspace scripts in the root `package.json` target the CLI package for you. For example, `bun run build:prod` builds the compiled binary into `dist/sentinel`.

## Create a config

Sentinel looks for `sentinel.config.ts` or `sentinel.config.js` in the current working directory. The config selects a provider and registers plugins. This example mirrors the sample config in the repository:

```ts
import type { SentinelConfig } from "./src/core/config";
import type { SentinelPlugin } from "./src/core/types";

const hello: SentinelPlugin = {
  name: "hello",
  run: (ctx) => ctx.report.info("Hello from my first plugin"),
};

const config: SentinelConfig = {
  provider: "local",
  plugins: [hello],
};

export default config;
```

## Run a check locally

Build the binary and run the `check` command from the repo root:

```bash
bun run build:prod
./dist/sentinel check
```

During execution Sentinel will:

1. Load your config and resolve the provider.
2. Execute any plugin `setup` hooks.
3. Run each plugin with the pull request diff and metadata supplied by the provider.
4. Post a single Markdown summary through the provider (the local provider logs to stdout).

You can iterate quickly by editing your config or plugins and re-running `./dist/sentinel check`.
