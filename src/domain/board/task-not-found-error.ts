export class TaskNotFoundError extends Error {
  constructor(taskId: string) {
    super(`Task ${taskId} was not found for the current user`);
    this.name = "TaskNotFoundError";
  }
}
