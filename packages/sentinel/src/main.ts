import chalk from "chalk";
import { Command } from "@commander-js/extra-typings";
import { createReporter } from "./core/reporter";
import { localProvider } from "./providers/local/local";
import { runAll } from "./core/runner";
import { loadConfig } from "./core/config";
import type { SentinelPlugin } from "./core/types";
import { resolveProvider } from "./providers/resolver";
import { loadPlugins } from "./plugin/plugin";

const program = new Command()
  .name("Sentinel")
  .description("lint everything but your code")
  .version("0.0.1")
  .option("-h, --help");

program
  .command("check")
  .description("check your PR")
  .action(() => {
    runCheck();
  });

async function runCheck() {
  const provider = resolveProvider(undefined, process.env);
  const cfg = await loadConfig();

  const plugins = await loadPlugins(cfg);

  await runAll(provider, plugins, cfg.settings || {});
}

program.parse(process.argv);
