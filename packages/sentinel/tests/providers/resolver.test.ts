import { describe, expect, test } from "bun:test";
import { resolveProvider } from "../../src/providers/resolver";
import { ghActPullRequestEnv } from "./fixtures/nektos-act-gh-pr-env";

const noopEnv = {} as Record<string, string>;

describe("resolveProvider", () => {
  test("respects explicit provider overrides", () => {
    const provider = resolveProvider("github", noopEnv);
    expect(provider.name).toBe("github");
  });

  test("detects GitLab CI from environment", () => {
    const provider = resolveProvider(undefined, { GITLAB_CI: "true" });
    expect(provider.name).toBe("gitlab");
  });

  test("detects Github CI from environment", () => {
    const provider = resolveProvider(undefined, { GITHUB_ACTIONS: "true" });
    expect(provider.name).toBe("github");
  });

  test("detects GitHub provider when running via gh act pull_request", () => {
    const provider = resolveProvider(undefined, ghActPullRequestEnv);
    expect(provider.name).toBe("github");
  });

  test("detects Bitbucket pipelines variables", () => {
    const provider = resolveProvider(undefined, {
      BITBUCKET_WORKSPACE: "acme",
    });
    expect(provider.name).toBe("bitbucket");
  });

  test("falls back to local provider", () => {
    const provider = resolveProvider(undefined, {});
    expect(provider.name).toBe("local");
  });
});
