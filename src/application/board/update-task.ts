import type {
  BoardDependencies,
  BoardOwner,
  RawTaskInput,
  TaskMutationResult,
} from "@/application/board/board-dependencies";
import { parseTaskInput } from "@/domain/board/task-input";
import { TaskNotFoundError } from "@/domain/board/task-not-found-error";

export const updateTask =
  ({ tasks }: BoardDependencies) =>
  async (owner: BoardOwner, taskId: string, raw: RawTaskInput): Promise<TaskMutationResult> => {
    const input = parseTaskInput(raw);
    if (!input.success) return input;

    const task = await tasks.updateOwnedBy(owner.id, taskId, input.data);
    if (!task) throw new TaskNotFoundError(taskId);

    return { success: true, task };
  };
