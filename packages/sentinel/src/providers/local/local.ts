import { $ } from "bun";
import type { DiffFile, GitProvider } from "../../core/types";
import { logger } from "../../core/logger";

const log = logger.child("provider:local");

const git = async (args: string[]) => {
  log.debug(`running git with args: ${args}`);

  let rootPath: string;
  try {
    rootPath = (await $`git rev-parse --show-toplevel`.text()).trim();
  } catch (error) {
    log.error(error, "Failed to get git repository root");
    throw new Error("Failed to get git repository root", { cause: error });
  }

  try {
    const out = await $`git ${args}`.cwd(rootPath).text();
    return out.trim();
  } catch (error) {
    log.error(error, `git ${args.join(" ")} failed`);
    throw new Error(`git ${args.join(" ")} failed`, { cause: error });
  }
};

export const localProvider = (): GitProvider => {
  return {
    name: "local",
    getDiff: getDiffFiles,
    getPR,
    postComment,
    git: async () => {
      const diff = await getDiffFiles();
      log.debug(diff);

      return {
        base: { ref: "", sha: "" },
        head: { ref: "", sha: "" },
        created: diff
          .filter((file) => file.status === "added")
          .map((file) => file.path),
        deleted: diff
          .filter((file) => file.status === "deleted")
          .map((file) => file.path),
        modified: diff
          .filter((file) => file.status === "modified")
          .map((file) => file.path),
        rawDiff: async (filename) => {
          return await getRawDiffForFile(filename);
        },
      };
    },
  };
};

const getDiffFiles = async () => {
  const base = await git(["rev-parse", "--verify", "origin/main"])
    .then(() => "origin/main")
    .catch(() => "HEAD~1");
  const raw = await git(["diff", "--name-status", "-z", `${base}..HEAD`]);
  if (!raw) {
    return [];
  }

  const entries = raw.split("\0").filter(Boolean);
  const files: DiffFile[] = [];

  const toStatus = (token: string): DiffFile["status"] =>
    token.startsWith("A")
      ? "added"
      : token.startsWith("D")
        ? "deleted"
        : token.startsWith("R")
          ? "renamed"
          : "modified";

  for (let i = 0; i < entries.length; i += 2) {
    const status = entries[i];
    const path = entries[i + 1];
    if (!status || !path) {
      continue;
    }

    files.push({ path, status: toStatus(status) });
  }

  log.debug(files);

  return files;
};

const getRawDiffForFile = async (path: string) => {
  const base =
    (await git(["rev-parse", "--verify", "origin/main"])
      .then(() => "origin/main")
      .catch(() => null)) ?? "HEAD~1";

  const range = base === "origin/main" ? "origin/main...HEAD" : `${base}..HEAD`;
  const diff = await git(["diff", range, "--", path]);
  log.debug({ path, len: diff.length }, "diff for file");

  return diff;
};

const getPR = async () => {
  log.debug("Getting PR information");
  log.error("PR information not available in this environment");
  return undefined;
};

const postComment = async (md: string) => {
  log.info("Rendered Sentinel report:\n" + md);
};
