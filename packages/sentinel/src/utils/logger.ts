import chalk, { type ChalkInstance } from "chalk";
import type { LogLevel, Logger } from "../core/types";

const LEVEL_PRIORITY: Record<LogLevel, number> = {
	silent: 0,
	error: 1,
	warn: 2,
	info: 3,
	debug: 4,
};

const LEVEL_COLORS: Record<Exclude<LogLevel, "silent">, ChalkInstance> = {
	error: chalk.red,
	warn: chalk.yellow,
	info: chalk.cyan,
	debug: chalk.gray,
};

const resolveLevel = (value?: string | null): LogLevel => {
	if (!value) {
		return "info";
	}

	const normalized = value.toLowerCase();
	return (Object.keys(LEVEL_PRIORITY) as LogLevel[]).includes(
		normalized as LogLevel,
	)
		? (normalized as LogLevel)
		: "info";
};

const DEFAULT_LEVEL = resolveLevel(process.env.SENTINEL_LOG_LEVEL);

const canLog = (current: LogLevel, target: LogLevel) =>
	LEVEL_PRIORITY[target] <= LEVEL_PRIORITY[current];

const formatScope = (scope?: string) =>
	scope && scope.length > 0 ? chalk.dim(`[${scope}]`) : undefined;

const colorLabel = (level: Exclude<LogLevel, "silent">) =>
	LEVEL_COLORS[level](`[${level.toUpperCase()}]`);

export const createLogger = (
	scope?: string,
	level: LogLevel = DEFAULT_LEVEL,
): Logger => {
	const scoped = formatScope(scope);

	const logFor =
		(
			targetLevel: Exclude<LogLevel, "silent">,
			writer: (...args: unknown[]) => void,
		) =>
		(...args: unknown[]) => {
			if (!canLog(level, targetLevel)) {
				return;
			}

			const parts: unknown[] = [colorLabel(targetLevel)];
			if (scoped) {
				parts.push(scoped);
			}
			parts.push(...args);
			writer(...parts);
		};

	return {
		level,
		child: (childScope: string) =>
			createLogger(scope ? `${scope}:${childScope}` : childScope, level),
		debug: logFor("debug", console.debug),
		info: logFor("info", console.info),
		warn: logFor("warn", console.warn),
		error: logFor("error", console.error),
	};
};

export const logger = createLogger("sentinel");
