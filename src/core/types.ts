export type Severity = "error" | "warn" | "info";

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

export type DiffFile = {
	path: string;
	status: "added" | "modified" | "deleted" | "renamed";
};

export type MRInfo = {
	id: string;
	title: string;
	author: string;
	sourceBranch: string;
	targetBranch: string;
	webUrl?: string;
};

export type Provider = {
	name: "local" | "github" | "gitlab" | "bitbucket";
	getDiff: () => Promise<DiffFile[]>;
	getPR: () => Promise<MRInfo | null>;
	postComment(markdown: string): Promise<void>;
};

export type SentinelContext = {
	provider: Provider;
	cwd: string;
	env: any;
	report: Reporter;
	settings: Record<string, unknown>;
	readFile: (file: string) => Promise<string>;
};

export type SentinelPlugin = {
	name: string;
	setup?: (ctx: SentinelContext) => Promise<void> | void;
	run?: (
		ctx: SentinelContext,
		diff: DiffFile[],
		pr: MRInfo | null,
	) => Promise<void> | void;
};
