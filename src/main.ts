import chalk from "chalk";
import { Command } from "@commander-js/extra-typings";
import { createReporter } from "./core/reporter";
import { localProvider } from "./plugin/plugin";

const program = new Command()
	.name("Sentinel")
	.description("lint everything but your code")
	.version("0.0.1")
	.option("-h, --help");

program
	.command("check")
	.description("check your PR")
	.action(() => {
		console.log(chalk.greenBright("foo"));
		runCheck();
	});

async function runCheck() {
	const provider = localProvider();
	const reporter = createReporter();

	const mr = await provider.getDiff();
	reporter.markdown(JSON.stringify(mr));

	const md = reporter.summary();

	await provider.postComment(md);
}

program.parse(process.argv);
