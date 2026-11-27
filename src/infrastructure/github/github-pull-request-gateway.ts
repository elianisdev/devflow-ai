import { z } from "zod";
import { resolvePullRequestState } from "@/domain/pull-request/pull-request";
import type { PullRequestGateway, PullRequestLookup } from "@/domain/pull-request/pull-request-ports";

const gitHubApiUrl = "https://api.github.com";

const gitHubPullRequestSchema = z.object({
  number: z.number(),
  title: z.string(),
  html_url: z.string(),
  state: z.enum(["open", "closed"]),
  draft: z.boolean().optional().default(false),
  merged_at: z.string().nullable(),
  base: z.object({
    repo: z.object({
      name: z.string(),
      owner: z.object({ login: z.string() }),
    }),
  }),
});

type GitHubPullRequestGatewayOptions = {
  getAccessToken: (userId: string) => Promise<string | null>;
  fetcher?: typeof fetch;
};

const notFoundStatuses = new Set([404, 410, 422]);
const unauthorizedStatus = 401;

export const createGitHubPullRequestGateway = ({
  getAccessToken,
  fetcher = fetch,
}: GitHubPullRequestGatewayOptions): PullRequestGateway => ({
  find: async (userId, { owner, repo, number }): Promise<PullRequestLookup> => {
    const accessToken = await getAccessToken(userId);
    if (!accessToken) return { status: "unauthorized" };

    try {
      const response = await fetcher(
        `${gitHubApiUrl}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/pulls/${number}`,
        {
          headers: {
            Accept: "application/vnd.github+json",
            Authorization: `Bearer ${accessToken}`,
            "X-GitHub-Api-Version": "2022-11-28",
          },
          cache: "no-store",
        },
      );

      if (notFoundStatuses.has(response.status)) return { status: "notFound" };
      if (response.status === unauthorizedStatus) return { status: "unauthorized" };
      if (!response.ok) return { status: "unavailable" };

      const parsed = gitHubPullRequestSchema.safeParse(await response.json());
      if (!parsed.success) return { status: "unavailable" };

      const pullRequest = parsed.data;
      return {
        status: "found",
        pullRequest: {
          owner: pullRequest.base.repo.owner.login,
          repo: pullRequest.base.repo.name,
          number: pullRequest.number,
          url: pullRequest.html_url,
          title: pullRequest.title,
          state: resolvePullRequestState({
            isClosed: pullRequest.state === "closed",
            isDraft: pullRequest.draft,
            isMerged: pullRequest.merged_at !== null,
          }),
        },
      };
    } catch {
      return { status: "unavailable" };
    }
  },
});
