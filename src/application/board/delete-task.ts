import type { BoardDependencies, BoardOwner } from "@/application/board/board-dependencies";
import { TaskNotFoundError } from "@/domain/board/task-not-found-error";

export const deleteTask =
  ({ tasks }: BoardDependencies) =>
  async (owner: BoardOwner, taskId: string): Promise<void> => {
    const deleted = await tasks.deleteOwnedBy(owner.id, taskId);
    if (!deleted) throw new TaskNotFoundError(taskId);
  };
