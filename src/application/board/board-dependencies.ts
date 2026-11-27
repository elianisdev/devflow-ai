import type { BoardRepository, TaskRepository } from "@/domain/board/board-repositories";
import type { Task } from "@/domain/board/task";
import type { TaskInputErrors } from "@/domain/board/task-input";

export type BoardDependencies = {
  boards: BoardRepository;
  tasks: TaskRepository;
};

export type BoardOwner = {
  id: string;
  login: string;
};

export type RawTaskInput = {
  title: unknown;
  description: unknown;
};

export type TaskMutationResult =
  | { success: true; task: Task }
  | { success: false; errors: TaskInputErrors };
