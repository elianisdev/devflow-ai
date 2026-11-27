import { createTask } from "@/application/board/create-task";
import { moveTask } from "@/application/board/move-task";
import { InvalidTaskMoveError } from "@/domain/board/invalid-task-move-error";
import { TaskNotFoundError } from "@/domain/board/task-not-found-error";
import { createInMemoryBoardDependencies } from "@/infrastructure/memory/in-memory-board-repositories";

const owner = { id: "user-1", login: "elianisdev" };
const stranger = { id: "user-2", login: "someone" };

const setup = async () => {
  const dependencies = createInMemoryBoardDependencies();
  const create = createTask(dependencies);
  const ids: string[] = [];
  for (const title of ["First", "Second", "Third"]) {
    const result = await create(owner, { title, description: "" });
    if (!result.success) throw new Error("Task should be created");
    ids.push(result.task.id);
  }
  return { dependencies, moveTask: moveTask(dependencies), ids };
};

const column = (taskList: { title: string; status: string; position: number }[], status: string) =>
  taskList
    .filter((task) => task.status === status)
    .sort((first, second) => first.position - second.position)
    .map((task) => task.title);

describe("moveTask", () => {
  it("moves a task to another column at the given position and closes the gap it left", async () => {
    const { dependencies, moveTask, ids } = await setup();

    await moveTask(owner, ids[0], { status: "IN_REVIEW", index: 0 });
    await moveTask(owner, ids[2], { status: "IN_REVIEW", index: 0 });

    expect(column(dependencies.taskList, "IN_REVIEW")).toEqual(["Third", "First"]);
    expect(column(dependencies.taskList, "TODO")).toEqual(["Second"]);
    expect(dependencies.taskList.find((task) => task.id === ids[1])?.position).toBe(0);
  });

  it("reorders a task inside its own column", async () => {
    const { dependencies, moveTask, ids } = await setup();

    await moveTask(owner, ids[2], { status: "TODO", index: 0 });

    expect(column(dependencies.taskList, "TODO")).toEqual(["Third", "First", "Second"]);
  });

  it("sends the task to the end of the column when no position is given", async () => {
    const { dependencies, moveTask, ids } = await setup();

    await moveTask(owner, ids[0], { status: "DONE" });
    await moveTask(owner, ids[1], { status: "DONE" });

    expect(column(dependencies.taskList, "DONE")).toEqual(["First", "Second"]);
  });

  it("rejects an unknown column or a negative position", async () => {
    const { moveTask, ids } = await setup();

    await expect(moveTask(owner, ids[0], { status: "ARCHIVED" })).rejects.toThrow(InvalidTaskMoveError);
    await expect(moveTask(owner, ids[0], { status: "DONE", index: -1 })).rejects.toThrow(InvalidTaskMoveError);
  });

  it("does not let another user move the task", async () => {
    const { dependencies, moveTask, ids } = await setup();

    await expect(moveTask(stranger, ids[0], { status: "DONE" })).rejects.toThrow(TaskNotFoundError);
    expect(column(dependencies.taskList, "TODO")).toEqual(["First", "Second", "Third"]);
  });
});
