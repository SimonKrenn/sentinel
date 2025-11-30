import { Command } from "@commander-js/extra-typings";
import { runAll } from "./core/runner";
import { loadConfig } from "./core/config";
import { resolveGitProvider } from "./providers/resolver";
import { loadPlugins } from "./plugin/plugin";
import { logger } from "./core/logger";

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
	logger.info("starting check");
	const provider = resolveGitProvider(undefined, process.env);
	const cfg = await loadConfig();

	const plugins = await loadPlugins(cfg);

	logger.debug(
		`executing with provider: ${JSON.stringify(
			provider,
		)}, plugins: ${JSON.stringify(plugins)}`,
	);
	await runAll(provider, plugins, cfg.settings || {});
}

program.parse(process.argv);
