import { spawn } from "bun";
import type { DiffFile, GitProvider } from "../../core/types";

const log = logger.child("provider:local");

const git = async (args: string[]) => {
  log.info(`running git with args: ${args}`);
  const repoRoot = await spawn(["git", "rev-parse", "--show-toplevel"], {
    stdout: "pipe",
    stderr: "pipe",
  });
  const rootPath = await new Response(repoRoot.stdout).text();
  const rootCode = await repoRoot.exited;
  if (rootCode !== 0) {
    throw new Error("Failed to get git repository root");
  }

  const proc = spawn(["git", ...args], {
    stdout: "pipe",
    stderr: "pipe",
    cwd: rootPath.trim(),
  });
  const out = await new Response(proc.stdout).text();
  const code = await proc.exited;
  if (code !== 0) {
    throw new Error(`git ${args.join(" ")} failed`);
  }
  return out.trim();
};

export const localProvider = (): GitProvider => {
  return {
    name: "local",
    getDiff: getDiffFiles,
    getPR,
    postComment,
    git: async () => {
      const diff = await getDiffFiles();
      log.info(diff);

      return {
        base: { ref: "", sha: "" },
        created: diff
          .filter((file) => file.status === "added")
          .map((file) => file.path),
        deleted: diff
          .filter((file) => file.status === "deleted")
          .map((file) => file.path),
        head: { ref: "", sha: "" },
        modified: diff
          .filter((file) => file.status === "modified")
          .map((file) => file.path),
        fileDiff: async (filename) => {
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
  const diff = await git(["diff", "HEAD", "origin/main", "--", path, "--raw"]);

  log.debug("diff for file:", diff);

  return diff;
};

const getPR = async () => {
  log.debug("Getting PR information");
  return undefined;
  log.error("PR information not available in this environment");
};

const postComment = async (md: string) => {
  log.info("Rendered Sentinel report:\n" + md);
};
