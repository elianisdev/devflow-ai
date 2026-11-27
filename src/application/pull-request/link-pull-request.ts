import type { BoardOwner } from "@/application/board/board-dependencies";
import type { PullRequestDependencies } from "@/application/pull-request/pull-request-dependencies";
import { TaskNotFoundError } from "@/domain/board/task-not-found-error";
import { parsePullRequestUrl } from "@/domain/pull-request/pull-request-url";

export const linkPullRequestErrorCodes = ["invalidUrl", "notFound", "unauthorized", "unavailable"] as const;

export type LinkPullRequestErrorCode = (typeof linkPullRequestErrorCodes)[number];

export type LinkPullRequestResult = { success: true } | { success: false; error: LinkPullRequestErrorCode };

export const linkPullRequest =
  ({ pullRequests, links, now }: PullRequestDependencies) =>
  async (owner: BoardOwner, taskId: string, rawUrl: unknown): Promise<LinkPullRequestResult> => {
    const reference = parsePullRequestUrl(rawUrl);
    if (!reference) return { success: false, error: "invalidUrl" };

    const lookup = await pullRequests.find(owner.id, reference);
    if (lookup.status !== "found") return { success: false, error: lookup.status };

    const saved = await links.saveForOwnedTask(owner.id, taskId, lookup.pullRequest, now());
    if (!saved) throw new TaskNotFoundError(taskId);

    return { success: true };
  };
