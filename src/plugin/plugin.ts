import type { SentinelContext, SentinelPlugin } from "../core/types";

export function definePlugin(
	name: string,
	f: (ctx: SentinelContext) => Partial<SentinelPlugin> | void,
) {
	return { name, ...(f as any)({} as SentinelContext) };
}
