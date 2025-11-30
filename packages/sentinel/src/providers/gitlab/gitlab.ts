import type { GitProvider } from "../../core/types";

export const gitlabProvider = (env = process.env): GitProvider => {
  return {
    name: "gitlab",
    getDiff: async (): Promise<any[]> => {
      // Implement GitLab specific logic to get the diff
      return [];
    },
    getPR: async () => {
      // Implement GitLab specific logic to get the merge request
      return null;
    },
    postComment: async (md: string) => {
      // Implement GitLab specific logic to post a comment
    },
  };
};
