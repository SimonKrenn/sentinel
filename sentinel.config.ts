import type { SentinelConfig } from "./src/core/config.ts";
import type { SentinelPlugin } from "./src/core/types.ts";

const defaultPlugin: SentinelPlugin = {
  name: "defaultPlugin",
  run: (ctx, diff, pr) => {
    ctx.report.info("Hello from defaultPlugin");
  },
};

const config: SentinelConfig = {
  provider: "local",
  plugins: [defaultPlugin],
};

export default config;
