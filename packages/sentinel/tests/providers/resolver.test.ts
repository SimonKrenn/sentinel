import { describe, expect, mock, test } from "bun:test";
import type { GitProvider } from "../../src/core/types";
import { ghActPullRequestEnv } from "./fixtures/nektos-act-gh-pr-env";

const createMockProvider = (name: GitProvider["name"]) =>
  ({
    name,
  }) as GitProvider;

mock.module("../../src/providers/github/github", () => ({
  github: () => createMockProvider("github"),
}));

mock.module("../../src/providers/gitlab/gitlab", () => ({
  gitlabProvider: () => createMockProvider("gitlab"),
}));

mock.module("../../src/providers/bitbucket/bitbucket", () => ({
  bitbucketProvider: () => createMockProvider("bitbucket"),
}));

mock.module("../../src/providers/local/local", () => ({
  localProvider: () => createMockProvider("local"),
}));

const resolverModulePromise = import("../../src/providers/resolver");
const getResolveGitProvider = async () =>
  (await resolverModulePromise).resolveGitProvider;

const noopEnv = {} as Record<string, string>;

const resolveProvider = async (
  kind: string | undefined,
  env?: Record<string, string>,
) => {
  const resolveGitProvider = await getResolveGitProvider();
  return resolveGitProvider(kind, env);
};

describe("resolveProvider", () => {
  test("respects explicit provider overrides", async () => {
    const provider = await resolveProvider("github", noopEnv);
    expect(provider.name).toBe("github");
  });

  test("detects GitLab CI from environment", async () => {
    const provider = await resolveProvider(undefined, { GITLAB_CI: "true" });
    expect(provider.name).toBe("gitlab");
  });

  test("detects Github CI from environment", async () => {
    const provider = await resolveProvider(undefined, {
      GITHUB_ACTIONS: "true",
    });
    expect(provider.name).toBe("github");
  });

  test("detects GitHub provider when running via gh act pull_request", async () => {
    const provider = await resolveProvider(undefined, ghActPullRequestEnv);
    expect(provider.name).toBe("github");
  });

  test("detects Bitbucket pipelines variables", async () => {
    const provider = await resolveProvider(undefined, {
      BITBUCKET_WORKSPACE: "acme",
    });
    expect(provider.name).toBe("bitbucket");
  });

  test("falls back to local provider", async () => {
    const provider = await resolveProvider(undefined, {});
    expect(provider.name).toBe("local");
  });
});
