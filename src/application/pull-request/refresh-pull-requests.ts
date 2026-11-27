import type { BoardOwner } from "@/application/board/board-dependencies";
import type { PullRequestDependencies } from "@/application/pull-request/pull-request-dependencies";

export const staleAfterMilliseconds = 2 * 60 * 1000;

export const refreshPullRequests =
  ({ pullRequests, links, now }: PullRequestDependencies) =>
  async (owner: BoardOwner): Promise<void> => {
    const syncedAt = now();
    const staleLinks = await links.listStaleOwnedBy(owner.id, new Date(syncedAt.getTime() - staleAfterMilliseconds));

    await Promise.all(
      staleLinks.map(async ({ taskId, ...reference }) => {
        const lookup = await pullRequests.find(owner.id, reference);
        if (lookup.status === "found") await links.refresh(taskId, lookup.pullRequest, syncedAt);
      }),
    );
  };
