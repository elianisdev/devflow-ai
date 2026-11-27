import type { PrismaClient } from "@/generated/prisma/client";
import type { TaskRepository } from "@/domain/board/board-repositories";
import type { TaskStatus } from "@/domain/board/task";
import { placeInOrder } from "@/domain/board/task-move";
import { fromPrismaPullRequestState } from "@/infrastructure/prisma/prisma-pull-request-state";

const taskFields = {
  id: true,
  boardId: true,
  title: true,
  description: true,
  status: true,
  position: true,
  createdAt: true,
  updatedAt: true,
} as const;

const linkedPullRequestFields = {
  owner: true,
  repo: true,
  number: true,
  url: true,
  title: true,
  state: true,
  syncedAt: true,
} as const;

type TransactionClient = Parameters<Parameters<PrismaClient["$transaction"]>[0]>[0];

const listColumnIds = async (tx: TransactionClient, boardId: string, status: TaskStatus) => {
  const tasks = await tx.task.findMany({ where: { boardId, status }, orderBy: { position: "asc" }, select: { id: true } });
  return tasks.map(({ id }) => id);
};

const saveColumnOrder = (tx: TransactionClient, orderedIds: string[], status: TaskStatus) =>
  Promise.all(orderedIds.map((id, position) => tx.task.update({ where: { id }, data: { status, position } })));

export const createPrismaTaskRepository = (client: PrismaClient): TaskRepository => ({
  listByBoard: async (boardId) => {
    const tasks = await client.task.findMany({
      where: { boardId },
      orderBy: [{ status: "asc" }, { position: "asc" }],
      select: { ...taskFields, pullRequestLink: { select: linkedPullRequestFields } },
    });
    return tasks.map(({ pullRequestLink, ...task }) => ({
      ...task,
      pullRequest: pullRequestLink && {
        ...pullRequestLink,
        state: fromPrismaPullRequestState(pullRequestLink.state),
      },
    }));
  },

  nextPosition: async (boardId, status) => {
    const { _max } = await client.task.aggregate({ where: { boardId, status }, _max: { position: true } });
    return (_max.position ?? -1) + 1;
  },

  create: (task) => client.task.create({ data: task, select: taskFields }),

  updateOwnedBy: async (userId, taskId, input) => {
    const { count } = await client.task.updateMany({ where: { id: taskId, board: { userId } }, data: input });
    if (count === 0) return null;
    return client.task.findUnique({ where: { id: taskId }, select: taskFields });
  },

  deleteOwnedBy: async (userId, taskId) => {
    const { count } = await client.task.deleteMany({ where: { id: taskId, board: { userId } } });
    return count > 0;
  },

  moveOwnedBy: (userId, taskId, { status, index }) =>
    client.$transaction(async (tx) => {
      const task = await tx.task.findFirst({
        where: { id: taskId, board: { userId } },
        select: { boardId: true, status: true },
      });
      if (!task) return false;

      const targetIds = await listColumnIds(tx, task.boardId, status);
      await saveColumnOrder(tx, placeInOrder(targetIds, taskId, index), status);

      if (task.status !== status) {
        const sourceIds = await listColumnIds(tx, task.boardId, task.status);
        await saveColumnOrder(tx, sourceIds, task.status);
      }
      return true;
    }),
});
