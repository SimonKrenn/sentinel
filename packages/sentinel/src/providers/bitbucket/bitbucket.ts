import type { RepoProvider } from "../../core/types";

export const bitbucketProvider = (env = process.env): RepoProvider => {
	return {
		name: "bitbucket",
		getDiff: async (): Promise<any[]> => {
			// Implement Bitbucket specific logic to get the diff
			return [];
		},
		getPR: async () => {
			// Implement Bitbucket specific logic to get the pull request
			return null;
		},
		postComment: async (md: string) => {
			// Implement Bitbucket specific logic to post a comment
		},
	};
};
