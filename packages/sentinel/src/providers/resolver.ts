import type { CIProvider, GitProvider } from "../core/types";
import { bitbucketProvider } from "./bitbucket/bitbucket";
import { githubActions } from "./ci/github-actions";
import { github } from "./github/github";
import { gitlabProvider } from "./gitlab/gitlab";
import { localProvider } from "./local/local";

export const resolveGitProvider = (
  kind: string | undefined,
  env = process.env,
): GitProvider => {
  if (kind && kind !== "auto") {
    if (kind === "local") {
      return localProvider();
    }
    if (kind == "gitlab") {
      return gitlabProvider(env);
    }
    if (kind == "github") {
      return github(env);
    }
    if (kind == "bitbucket") {
      return bitbucketProvider(env);
    }
  }

  if (env.GITLAB_CI || env.CI_SERVER_NAME == "Gitlab") {
    return gitlabProvider(env);
  }

  if (env.GITHUB_ACTIONS || env.GITHUB_ACTOR) {
    return github(env);
  }

  if (env.BITBUCKET_BUILD_NUMBER || env.BITBUCKET_WORKSPACE) {
    return bitbucketProvider(env);
  }

  return localProvider();
};

export const resolveCIProvider = (
  kind: string | undefined,
  env = process.env,
): CIProvider | undefined => {
  if (kind && kind !== "auto") {
    if (kind === "Github Actions") {
      return githubActions(env);
    }
  }
  return undefined;
};
