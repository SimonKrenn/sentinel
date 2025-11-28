import { spawn } from "bun";
import { logger } from "../../core/logger";
import type { DiffFile, RepoProvider } from "../../core/types";

const log = logger.child("provider:local");

const git = async (args: string[]) => {
  const proc = spawn(["git", ...args], { stdout: "pipe", stderr: "pipe" });
  const out = await new Response(proc.stdout).text();
  const code = await proc.exited;
  if (code !== 0) {
    throw new Error(`git ${args.join(" ")} failed`);
  }
  return out.trim();
};

export const localProvider = (): RepoProvider => {
  return {
    name: "local",
    getDiff,
    getPR,
    postComment,
  };
};

const getDiff = async () => {
  const base = await git(["rev-parse", "--verify", "origin/main"])
    .then(() => "origin/main")
    .catch(() => "HEAD~1");
  const raw = await git(["diff", "--name-status", "-z", `${base}..HEAD`]);
  return raw
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      const [status, ...rest] = line.split(/\s+/);
      const path = rest[rest.length - 1];
      const s = status?.startsWith("A")
        ? "added"
        : status?.startsWith("D")
        ? "deleted"
        : status?.startsWith("R")
        ? "renamed"
        : "modified";

      return { path: path ?? "", status: s } satisfies DiffFile;
    });
};

const getPR = async () => {
  log.warn("Pull request metadata is not available in the local provider");
  return null;
};

const postComment = async (md: string) => {
  log.info("Rendered Sentinel report:\n" + md);
};
