import { createGitHubPullRequestGateway } from "@/infrastructure/github/github-pull-request-gateway";

const reference = { owner: "ElianisDev", repo: "DevFlow-AI", number: 15 };

const gitHubPullRequest = {
  number: 15,
  title: "feat: accessible drag and drop for board tasks",
  html_url: "https://github.com/elianisdev/devflow-ai/pull/15",
  state: "closed",
  draft: false,
  merged_at: "2026-11-27T15:00:00Z",
  base: { repo: { name: "devflow-ai", owner: { login: "elianisdev" } } },
};

const respondWith = (status: number, body: unknown = {}) =>
  jest.fn().mockResolvedValue({ status, ok: status >= 200 && status < 300, json: async () => body });

const createGateway = (fetcher: jest.Mock, accessToken: string | null = "token-123") =>
  createGitHubPullRequestGateway({ getAccessToken: async () => accessToken, fetcher });

describe("GitHub pull request gateway", () => {
  it("asks GitHub for the pull request with the user token and maps its state", async () => {
    const fetcher = respondWith(200, gitHubPullRequest);

    const lookup = await createGateway(fetcher).find("user-1", reference);

    expect(lookup).toEqual({
      status: "found",
      pullRequest: {
        owner: "elianisdev",
        repo: "devflow-ai",
        number: 15,
        url: "https://github.com/elianisdev/devflow-ai/pull/15",
        title: "feat: accessible drag and drop for board tasks",
        state: "merged",
      },
    });
    const [url, init] = fetcher.mock.calls[0];
    expect(url).toBe("https://api.github.com/repos/ElianisDev/DevFlow-AI/pulls/15");
    expect(init.headers.Authorization).toBe("Bearer token-123");
  });

  it("reports a missing or private pull request as not found", async () => {
    expect(await createGateway(respondWith(404)).find("user-1", reference)).toEqual({ status: "notFound" });
  });

  it("asks to sign in again when the token was revoked or is missing", async () => {
    const fetcher = respondWith(200, gitHubPullRequest);

    expect(await createGateway(respondWith(401)).find("user-1", reference)).toEqual({ status: "unauthorized" });
    expect(await createGateway(fetcher, null).find("user-1", reference)).toEqual({ status: "unauthorized" });
    expect(fetcher).not.toHaveBeenCalled();
  });

  it("reports GitHub as unavailable on rate limits, unexpected bodies or network errors", async () => {
    const networkError = jest.fn().mockRejectedValue(new TypeError("fetch failed"));

    expect(await createGateway(respondWith(403)).find("user-1", reference)).toEqual({ status: "unavailable" });
    expect(await createGateway(respondWith(200, { message: "?" })).find("user-1", reference)).toEqual({
      status: "unavailable",
    });
    expect(await createGateway(networkError).find("user-1", reference)).toEqual({ status: "unavailable" });
  });
});
