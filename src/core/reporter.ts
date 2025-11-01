import type { Reporter, Severity } from "./types";

export function createReporter(): Reporter {
	const items: any[] = [];

	const push =
		(severity: Severity) =>
		(message: string, opts: Partial<any> = {}) =>
			items.push({ severity, message, ...opts });

	return {
		fail: push("error"),
		warn: push("warn"),
		info: push("info"),
		markdown: (md: string) => {
			items.push(md);
		},
		//TODO
		summary: () => {
			return {
				items,
				toMarkdown: () => {
					const header = `### Sentinel report\n\n`;

					const report = items.map((item) => `- ${item.message}`);

					return [header, ...report].join("\n");
				},
			};
		},
	};
}
