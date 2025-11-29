import type { CIProvider } from "../../../core/types";
import { readFileSync } from "fs";

type GithubWebhookEvent = any;

export interface GithubActionsProvider extends CIProvider {
  name: "Github Actions";
}

export const githubActions = (env = process.env): GithubActionsProvider => {
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
