import type { Board, BoardTask, Task, TaskStatus } from "@/domain/board/task";
import type { TaskInput } from "@/domain/board/task-input";
import type { TaskMove } from "@/domain/board/task-move";

export interface BoardRepository {
  findOrCreateForUser(userId: string, name: string): Promise<Board>;
}

export interface TaskRepository {
  listByBoard(boardId: string): Promise<BoardTask[]>;
  nextPosition(boardId: string, status: TaskStatus): Promise<number>;
  create(task: TaskInput & { boardId: string; status: TaskStatus; position: number }): Promise<Task>;
  updateOwnedBy(userId: string, taskId: string, input: TaskInput): Promise<Task | null>;
  deleteOwnedBy(userId: string, taskId: string): Promise<boolean>;
  moveOwnedBy(userId: string, taskId: string, move: TaskMove): Promise<boolean>;
}
