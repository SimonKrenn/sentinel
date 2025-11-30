import type { PRInfo, GitProvider } from "../../core/types";
import type { Git, GitMetaData, PRDiff } from "../../core/types/git";
import { githubAPI } from "./api/octo";
import { githubActions } from "../ci/github-actions";
import { resolveCIProvider } from "../resolver";

export interface GithubProvider extends GitProvider {
  name: "github";
  getPR: () => Promise<GithubPRInfo | undefined>;
}

export interface GithubPRInfo extends PRInfo {}

export const github = (env = process.env): GithubProvider => {
  const ciProvider = resolveCIProvider(undefined, env);
  const API = githubAPI({ ci: ciProvider, config: undefined });

  return {
    name: "github",
    getDiff: async (): Promise<any[]> => {
      return [];
    },
    getPR: API.getPRInfo,
    postComment: API.createComment,
    git: function (): Promise<Git> {
      return new Promise<Git>((resolve, reject) => {
        resolve(getGit());
      });
    },
  };
};

const getBranchInfo = (): GitMetaData & PRDiff => {
  return {
    created: [],
    deleted: [],
    modified: [],
    base: {
      ref: "",
      sha: "",
    },
    head: {
      ref: "",
      sha: "",
    },
  };
};

const getGit = (): Git => {
  return {
    ...getBranchInfo(),
    rawDiff: () => {
      throw new Error("not implemented yet");
    },
  };
};
