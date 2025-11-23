import type { RepoProvider } from "../core/types";
import { bitbucketProvider } from "./bitbucket/bitbucket";
import { github } from "./github/github";
import { gitlabProvider } from "./gitlab/gitlab";
import { localProvider } from "./local/local";

export const resolveProvider = (
	kind: string | undefined,
	env = process.env,
): RepoProvider => {
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
