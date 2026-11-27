import { parsePullRequestUrl } from "@/domain/pull-request/pull-request-url";

describe("parsePullRequestUrl", () => {
  it("reads the owner, repository and number from a pull request URL", () => {
    expect(parsePullRequestUrl("https://github.com/elianisdev/devflow-ai/pull/15")).toEqual({
      owner: "elianisdev",
      repo: "devflow-ai",
      number: 15,
    });
  });

  it("accepts spaces, www, a missing protocol and the tabs of the pull request page", () => {
    const expected = { owner: "vercel", repo: "next.js", number: 42 };

    expect(parsePullRequestUrl("  https://www.github.com/vercel/next.js/pull/42  ")).toEqual(expected);
    expect(parsePullRequestUrl("github.com/vercel/next.js/pull/42")).toEqual(expected);
    expect(parsePullRequestUrl("https://github.com/vercel/next.js/pull/42/files")).toEqual(expected);
    expect(parsePullRequestUrl("https://github.com/vercel/next.js/pull/42#discussion_r1")).toEqual(expected);
  });

  it.each([
    "https://github.com/elianisdev/devflow-ai/issues/15",
    "https://github.com/elianisdev/devflow-ai/pull/0",
    "https://github.com/elianisdev/devflow-ai",
    "https://gitlab.com/elianisdev/devflow-ai/pull/15",
    "https://github.com.evil.dev/elianisdev/devflow-ai/pull/15",
    "",
  ])("rejects %p", (url) => {
    expect(parsePullRequestUrl(url)).toBeNull();
  });

  it("rejects values that are not text", () => {
    expect(parsePullRequestUrl(null)).toBeNull();
  });
});
