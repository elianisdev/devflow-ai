import type { PrismaClient } from "@/generated/prisma/client";
import type { PullRequest } from "@/domain/pull-request/pull-request";
import type { PullRequestLinkRepository } from "@/domain/pull-request/pull-request-ports";
import { toPrismaPullRequestState } from "@/infrastructure/prisma/prisma-pull-request-state";

const toLinkData = (pullRequest: PullRequest, syncedAt: Date) => ({
  owner: pullRequest.owner,
  repo: pullRequest.repo,
  number: pullRequest.number,
  url: pullRequest.url,
  title: pullRequest.title,
  state: toPrismaPullRequestState(pullRequest.state),
  syncedAt,
});

export const createPrismaPullRequestLinkRepository = (client: PrismaClient): PullRequestLinkRepository => ({
  saveForOwnedTask: async (userId, taskId, pullRequest, syncedAt) => {
    const task = await client.task.findFirst({ where: { id: taskId, board: { userId } }, select: { id: true } });
    if (!task) return false;

    const data = toLinkData(pullRequest, syncedAt);
    await client.pullRequestLink.upsert({ where: { taskId }, update: data, create: { ...data, taskId } });
    return true;
  },

  deleteForOwnedTask: async (userId, taskId) => {
    const { count } = await client.pullRequestLink.deleteMany({ where: { taskId, task: { board: { userId } } } });
    return count > 0;
  },

  listStaleOwnedBy: (userId, syncedBefore) =>
    client.pullRequestLink.findMany({
      where: { syncedAt: { lt: syncedBefore }, task: { board: { userId } } },
      select: { taskId: true, owner: true, repo: true, number: true },
    }),

  refresh: async (taskId, pullRequest, syncedAt) => {
    await client.pullRequestLink.updateMany({ where: { taskId }, data: toLinkData(pullRequest, syncedAt) });
  },
});
