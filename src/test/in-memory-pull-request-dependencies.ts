import type { PullRequestDependencies } from "@/application/pull-request/pull-request-dependencies";
import type { PullRequest, PullRequestReference } from "@/domain/pull-request/pull-request";
import type { PullRequestLookup } from "@/domain/pull-request/pull-request-ports";
import type { InMemoryBoardDependencies } from "@/test/in-memory-board-repositories";

const referenceKey = ({ owner, repo, number }: PullRequestReference) => `${owner}/${repo}#${number}`.toLowerCase();

export const createInMemoryPullRequestDependencies = (board: InMemoryBoardDependencies) => {
  const gitHub = new Map<string, PullRequest>();
  const clock = { current: new Date("2026-11-27T12:00:00Z") };
  const status = { isAvailable: true };
  const lookups: PullRequestReference[] = [];

  const ownsTask = (userId: string, taskId: string) =>
    board.taskList.some((task) => task.id === taskId && board.isOwnedBy(userId, task));

  const dependencies: PullRequestDependencies = {
    now: () => clock.current,
    pullRequests: {
      find: async (_userId, reference): Promise<PullRequestLookup> => {
        lookups.push(reference);
        if (!status.isAvailable) return { status: "unavailable" };
        const pullRequest = gitHub.get(referenceKey(reference));
        return pullRequest ? { status: "found", pullRequest } : { status: "notFound" };
      },
    },
    links: {
      saveForOwnedTask: async (userId, taskId, pullRequest, syncedAt) => {
        if (!ownsTask(userId, taskId)) return false;
        const link = { ...pullRequest, taskId, syncedAt };
        const index = board.linkList.findIndex((item) => item.taskId === taskId);
        if (index === -1) board.linkList.push(link);
        else board.linkList[index] = link;
        return true;
      },
      deleteForOwnedTask: async (userId, taskId) => {
        const index = board.linkList.findIndex((link) => link.taskId === taskId && ownsTask(userId, taskId));
        if (index === -1) return false;
        board.linkList.splice(index, 1);
        return true;
      },
      listStaleOwnedBy: async (userId, syncedBefore) =>
        board.linkList
          .filter((link) => link.syncedAt < syncedBefore && ownsTask(userId, link.taskId))
          .map(({ taskId, owner, repo, number }) => ({ taskId, owner, repo, number })),
      refresh: async (taskId, pullRequest, syncedAt) => {
        const link = board.linkList.find((item) => item.taskId === taskId);
        if (link) Object.assign(link, pullRequest, { syncedAt });
      },
    },
  };

  return {
    dependencies,
    clock,
    status,
    lookups,
    publish: (pullRequest: PullRequest) => gitHub.set(referenceKey(pullRequest), pullRequest),
  };
};
