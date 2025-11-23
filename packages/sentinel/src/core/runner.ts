import type { SentinelSettings } from "./config";
import { createReporter } from "./reporter";
import type { RepoProvider, SentinelContext, SentinelPlugin } from "./types";

export const runAll = async (
  provider: RepoProvider,
  plugins: SentinelPlugin[],
  settings: SentinelSettings,
) => {
  const report = createReporter();

  const ctx: SentinelContext = {
    provider,
    cwd: process.cwd(),
    env: process.env,
    report,
    settings,
    readFile: (file: string) => Bun.file(file).text(),
  };

  for (const p of plugins) {
    p.setup?.(ctx);
  }

  const [mr, diff] = await Promise.all([provider.getPR(), provider.getDiff()]);

  await Promise.all(plugins.map((p) => p.run?.(ctx, diff, mr)));

  const md = report.summary().toMarkdown();

  await provider.postComment(md);
};
