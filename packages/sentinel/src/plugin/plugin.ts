import type { SentinelConfig } from "../core/config";
import type { SentinelContext, SentinelPlugin } from "../core/types";

export function definePlugin(
  name: string,
  f: (ctx: SentinelContext) => Partial<SentinelPlugin> | void,
) {
  return { name, ...(f as any)({} as SentinelContext) };
}

export const loadPlugins = async (cfg: SentinelConfig) => {
  const plugins: SentinelPlugin[] = [];

  if (cfg.plugins) {
    for (const plugin of cfg.plugins) {
      if (typeof plugin === "string") {
        const mod = await import(plugin);
        plugins.push((mod.default || mod) as SentinelPlugin);
      } else {
        plugins.push(plugin);
      }
    }
  }
  return plugins;
};
