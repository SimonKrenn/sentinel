export type Severity = "error" | "warn" | "info";

export type Reporter = {
	fail: (msg: string, otps?: any) => void;
	warn: (msg: string, otps?: any) => void;
	info: (msg: string, otps?: any) => void;
	markdown: (md: string) => void;
	summary: () => string;
};
