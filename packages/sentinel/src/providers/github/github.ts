import { Octokit } from "@octokit/rest";
import { readFileSync } from "fs";
import { logger } from "../../core/logger";
import type { CIPlatform, PRInfo, RepoProvider } from "../../core/types";

const log = logger.child("provider:github");

export const github = (env = process.env): GithubProvider => {
  const ciPlatform = githubActions(env);
  const API = new Octokit();

  return {
    name: "github",
    getDiff: async (): Promise<any[]> => {
      return [];
    },
    getPR: async () => {
      const [owner, repo] = ciPlatform.repoSlug.split("/");
      if (!owner || !repo) {
        log.error(`Invalid GitHub repo slug: ${ciPlatform.repoSlug}`);
        return null;
      }

      try {
        const response = await API.pulls.get({
          owner,
          repo,
          pull_number: ciPlatform.PR_IID,
        });

        const pr = response.data;

        return {
          id: String(pr.id),
          title: pr.title ?? "",
          author: pr.user?.login ?? "",
          sourceBranch: pr.head.ref,
          targetBranch: pr.base.ref,
          webUrl: pr.html_url,
        };
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Unknown error while contacting GitHub";
        log.error(
          `Failed to fetch PR ${ciPlatform.PR_IID} from ${ciPlatform.repoSlug}: ${message}`,
        );
        return null;
      }
    },
    postComment: async (md: string) => {
      const [owner, repo] = ciPlatform.repoSlug.split("/");
      try {
        const res = await API.issues.createComment({
          body: md,
          issue_number: ciPlatform.PR_IID,
          owner: owner!,
          repo: repo!,
        });
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Unknown error posting comment";
        log.error(
          `Failed to post GitHub comment for ${ciPlatform.repoSlug}#${ciPlatform.PR_IID}: ${message}`,
        );
      }

      // Implement GitHub specific logic to post a comment
    },
  };
};

const githubActions = (env = process.env): GithubActionsPlatform => {
  let eventPath: string = env.GITHUB_EVENT_PATH || "github/workflow/event.json";
  const event: GithubWebhookEvent = JSON.parse(readFileSync(eventPath, "utf8"));

  return {
    name: "Github Actions",
    PR_IID: event.pull_request.number ?? event.issue.number,
    repoSlug:
      event.pull_request !== undefined
        ? event.pull_request.base.repo.full_name
        : event.repository.full_name,
  };
};

type GithubWebhookEvent = any;

export interface GithubActionsPlatform extends CIPlatform {
  name: "Github Actions";
}

export interface GithubProvider extends RepoProvider {
  name: "github";
  getPR: () => Promise<GithubPRInfo | null>;
}

export interface GithubPRInfo extends PRInfo {}
