import type { SentinelPlugin } from "./types";

export type SentinelSettings = {};

export type SentinelConfig = {
	provider?: "auto" | "local" | "gitlab" | "github" | "bitbucket";
	settings?: SentinelSettings;
	plugins?: (SentinelPlugin | string)[];
};

export const loadConfig = async (
	cwd = process.cwd(),
): Promise<SentinelConfig> => {
	const paths = ["sentinel.config.ts", "sentinel.config.js"];

	for (const path of paths) {
		try {
			const cfg = await import(new URL(`file://${cwd}/${path}`).href);
			return cfg.default || cfg.config || cfg;
		} catch {}
	}

	throw new Error("no config found");
};
