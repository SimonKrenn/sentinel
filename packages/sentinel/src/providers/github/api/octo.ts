import { Octokit } from "@octokit/rest";
import type { GithubPRInfo } from "../github";
import type { CIProvider } from "../../../core/types";
import { logger } from "../../../core/logger";

const log = logger.child("github:api");

export const githubAPI = (config: { ci: CIProvider; config: any }) => {
  //todo: init Octokit
  const octokit = new Octokit({ baseUrl: "", auth: undefined });

  if (!config.ci) {
    throw Error("cannot determine CI Platform");
  }

  const [owner, repo] = config.ci.repoSlug.split("/");

  const getPRInfo = async (): Promise<GithubPRInfo | undefined> => {
    if (!owner || !repo) {
      log.error("failed to get PR info");
      return undefined;
    }
    try {
      //TODO get correct metadata for request
      const pr = await octokit.pulls.get({
        owner: owner,
        repo: repo,
        pull_number: config.ci.PR_IID,
      });

      return {
        author: pr.data.assignee?.id.toString() ?? "",
        id: pr.data.id.toString(),
        sourceBranch: pr.data.head.ref,
        targetBranch: pr.data.base.ref,
        title: pr.data.title,
        webUrl: pr.data.html_url,
      };
    } catch (err) {
      console.error("Error fetching PR info:", err);
    }
  };

  const createComment = async (md: string) => {
    if (!owner || !repo) {
      log.error("failed to post comment");
      return undefined;
    }

    try {
      const res = await octokit.issues.createComment({
        body: md,
        issue_number: config.ci.PR_IID,
        owner: owner,
        repo: repo,
      });
    } catch {
      log.error("not posted :(");
    }
  };

  return {
    getPRInfo,
    createComment,
  };
};
