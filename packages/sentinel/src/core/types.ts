export type Severity = "error" | "warn" | "info";
export type LogLevel = "silent" | "error" | "warn" | "info" | "debug";

export type ReportItem = {
  sev: Severity;
  message: string;
  file?: string;
  line?: string;
  markdown?: string;
};

export type Reporter = {
  fail: (msg: string, otps?: any) => void;
  warn: (msg: string, otps?: any) => void;
  info: (msg: string, otps?: any) => void;
  markdown: (md: string) => void;
  summary: () => { items: ReportItem[]; toMarkdown: () => string };
};

export type Logger = {
  level: LogLevel;
  child: (scope: string) => Logger;
  debug: (...args: unknown[]) => void;
  info: (...args: unknown[]) => void;
  warn: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
};

export type DiffFile = {
  path: string;
  status: "added" | "modified" | "deleted" | "renamed";
};

export interface PRInfo {
  id: string;
  title: string;
  author: string;
  sourceBranch: string;
  targetBranch: string;
  webUrl?: string;
}

export interface RepoProvider {
  readonly name: "local" | "github" | "gitlab" | "bitbucket";
  getDiff: () => Promise<DiffFile[]>;
  getPR: () => Promise<PRInfo | null>;
  postComment(markdown: string): Promise<void>;
}

export interface CIPlatform {
  readonly name: string;
  readonly PR_IID: number;
  readonly repoSlug: string;
}

export type SentinelContext = {
  provider: RepoProvider;
  cwd: string;
  env: any;
  report: Reporter;
  logger: Logger;
  settings: Record<string, unknown>;
  readFile: (file: string) => Promise<string>;
};

export type SentinelPlugin = {
  name: string;
  setup?: (ctx: SentinelContext) => Promise<void> | void;
  run?: (
    ctx: SentinelContext,
    diff: DiffFile[],
    pr: PRInfo | null,
  ) => Promise<void> | void;
};
