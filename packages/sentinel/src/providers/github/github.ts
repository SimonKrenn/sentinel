import { Octokit } from "@octokit/rest";
import { readFileSync } from "fs";
import type { CIPlatform, PRInfo, RepoProvider } from "../../core/types";

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
				throw new Error(`Invalid GitHub repo slug: ${ciPlatform.repoSlug}`);
			}

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
		},
		postComment: async (md: string) => {
			// Implement GitHub specific logic to post a comment
		},
	};
};

const githubActions = (env = process.env): GithubActionsPlatform => {
	let eventPath: string = env.GITHUB_EVENT_PATH || "github/workflow/event.json";
	const event: GithubWebhookEvent = JSON.parse(readFileSync(eventPath, "utf8"));

	console.log(eventPath, event);

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
