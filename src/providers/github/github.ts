import { Octokit } from "@octokit/rest";
import type { PRInfo, Provider } from "../../core/types";

export const githubProvider = (env = process.env): GithubProvider => {
	const githubClient = githubFacade();

	return {
		name: "github",
		getDiff: async (): Promise<any[]> => {
			// Implement GitHub specific logic to get the diff
			return [];
		},
		getPR: async () => {
			return githubClient.pr;
		},
		postComment: async (md: string) => {
			// Implement GitHub specific logic to post a comment
		},
	};
};

export interface GithubProvider extends Provider {
	name: "github";
	getPR: () => Promise<GithubPRInfo | null>;
}

export interface GithubPRInfo extends PRInfo {}

export const githubFacade = () => {
	const octokit = new Octokit();

	return {
		commits: null,
		issue: null,
		pr: null,
		reviews: null,
		utils: null,
		postMessage: (msg: string) => null,
	};
};
