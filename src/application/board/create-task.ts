import type {
  BoardDependencies,
  BoardOwner,
  RawTaskInput,
  TaskMutationResult,
} from "@/application/board/board-dependencies";
import { parseTaskInput } from "@/domain/board/task-input";

const newTaskStatus = "TODO";

export const createTask =
  ({ boards, tasks }: BoardDependencies) =>
  async (owner: BoardOwner, raw: RawTaskInput): Promise<TaskMutationResult> => {
    const input = parseTaskInput(raw);
    if (!input.success) return input;

    const board = await boards.findOrCreateForUser(owner.id, owner.login);
    const position = await tasks.nextPosition(board.id, newTaskStatus);
    const task = await tasks.create({ ...input.data, boardId: board.id, status: newTaskStatus, position });

    return { success: true, task };
  };
