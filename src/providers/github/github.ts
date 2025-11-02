import type { Provider } from "../../core/types";

export const githubProvider = (env = process.env): Provider => {
  return {
    name: "github",
    getDiff: async (): Promise<any[]> => {
      // Implement GitHub specific logic to get the diff
      return [];
    },
    getPR: async () => {
      // Implement GitHub specific logic to get the pull request
      return null;
    },
    postComment: async (md: string) => {
      // Implement GitHub specific logic to post a comment
    },
  };
};
