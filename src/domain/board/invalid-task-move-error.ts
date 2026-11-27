export class InvalidTaskMoveError extends Error {
  constructor() {
    super("The task move has an invalid column or position");
    this.name = "InvalidTaskMoveError";
  }
}
