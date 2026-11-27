import type { PullRequestLinkRepository } from "@/domain/pull-request/pull-request-ports";
import type { InMemoryBoardDependencies } from "@/infrastructure/memory/in-memory-board-repositories";

export const createInMemoryPullRequestLinkRepository = ({
  taskList,
  linkList,
  isOwnedBy,
}: InMemoryBoardDependencies): PullRequestLinkRepository => {
  const ownsTask = (userId: string, taskId: string) =>
    taskList.some((task) => task.id === taskId && isOwnedBy(userId, task));

  return {
    saveForOwnedTask: async (userId, taskId, pullRequest, syncedAt) => {
      if (!ownsTask(userId, taskId)) return false;
      const link = { ...pullRequest, taskId, syncedAt };
      const index = linkList.findIndex((item) => item.taskId === taskId);
      if (index === -1) linkList.push(link);
      else linkList[index] = link;
      return true;
    },
    deleteForOwnedTask: async (userId, taskId) => {
      const index = linkList.findIndex((link) => link.taskId === taskId && ownsTask(userId, taskId));
      if (index === -1) return false;
      linkList.splice(index, 1);
      return true;
    },
    listStaleOwnedBy: async (userId, syncedBefore) =>
      linkList
        .filter((link) => link.syncedAt < syncedBefore && ownsTask(userId, link.taskId))
        .map(({ taskId, owner, repo, number }) => ({ taskId, owner, repo, number })),
    refresh: async (taskId, pullRequest, syncedAt) => {
      const link = linkList.find((item) => item.taskId === taskId);
      if (link) Object.assign(link, pullRequest, { syncedAt });
    },
  };
};
