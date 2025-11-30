import type { SentinelConfig } from "./src/core/config.ts";
import type { SentinelPlugin } from "./src/core/types.ts";

const defaultPlugin: SentinelPlugin = {
	name: "defaultPlugin",
	run: async (ctx, diff, pr) => {
		const { modified, rawDiff } = await ctx.provider.git();

		ctx.report.info("Hello from defaultPlugin");
		ctx.report.info(`changed files: ${modified}`);
		ctx.report.info(
			`diff for file ${modified[0]} :  ${await rawDiff(modified[0]!)}`,
		);
	},
};

const config: SentinelConfig = {
	provider: "local",
	plugins: [defaultPlugin],
};

export default config;
