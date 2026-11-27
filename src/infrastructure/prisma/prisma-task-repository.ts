import type { PrismaClient } from "@/generated/prisma/client";
import type { TaskRepository } from "@/domain/board/board-repositories";

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

export const createPrismaTaskRepository = (client: PrismaClient): TaskRepository => ({
  listByBoard: (boardId) =>
    client.task.findMany({
      where: { boardId },
      orderBy: [{ status: "asc" }, { position: "asc" }],
      select: taskFields,
    }),

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
});
