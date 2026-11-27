import type { Board, Task, TaskStatus } from "@/domain/board/task";
import type { TaskInput } from "@/domain/board/task-input";

export interface BoardRepository {
  findOrCreateForUser(userId: string, name: string): Promise<Board>;
}

export interface TaskRepository {
  listByBoard(boardId: string): Promise<Task[]>;
  nextPosition(boardId: string, status: TaskStatus): Promise<number>;
  create(task: TaskInput & { boardId: string; status: TaskStatus; position: number }): Promise<Task>;
  updateOwnedBy(userId: string, taskId: string, input: TaskInput): Promise<Task | null>;
  deleteOwnedBy(userId: string, taskId: string): Promise<boolean>;
}
