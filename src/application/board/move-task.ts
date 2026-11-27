import type { BoardDependencies, BoardOwner } from "@/application/board/board-dependencies";
import { InvalidTaskMoveError } from "@/domain/board/invalid-task-move-error";
import { TaskNotFoundError } from "@/domain/board/task-not-found-error";
import { taskMoveSchema } from "@/domain/board/task-move";

export const moveTask =
  ({ tasks }: BoardDependencies) =>
  async (owner: BoardOwner, taskId: string, rawMove: { status: unknown; index?: unknown }): Promise<void> => {
    const move = taskMoveSchema.safeParse(rawMove);
    if (!move.success) throw new InvalidTaskMoveError();

    const moved = await tasks.moveOwnedBy(owner.id, taskId, move.data);
    if (!moved) throw new TaskNotFoundError(taskId);
  };
