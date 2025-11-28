import { Octokit } from "@octokit/rest";
import type { GithubPRInfo } from "../github";
import type { CIPlatform } from "../../../core/types";

export const githubAPI = (config: { ci: CIPlatform; config: any }) => {
	//todo: init Octokit
	const octokit = new Octokit({ baseUrl: "", auth: undefined });

	const getPRInfo = async (): Promise<GithubPRInfo> => {
		//TODO get correct metadata for request
		const pr = await octokit.pulls.get({
			owner: "",
			repo: "",
			pull_number: 0,
		});

		return {
			author: pr.data.assignee?.id.toString() ?? "",
			id: pr.data.id.toString(),
			sourceBranch: pr.data.head.ref,
			targetBranch: pr.data.base.ref,
			title: pr.data.title,
			webUrl: pr.data.html_url,
		};
	};

	const createComment = () => {};

	return {
		getPRInfo,
		createComment,
	};
};
