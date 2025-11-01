import chalk from "chalk";
import { Command } from "@commander-js/extra-typings";
import { createReporter } from "./core/reporter";
import { localProvider } from "./providers/local/local";
import { runAll } from "./core/runner";

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
	runAll();
}

program.parse(process.argv);
