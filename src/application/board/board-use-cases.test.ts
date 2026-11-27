import { createTask } from "@/application/board/create-task";
import { deleteTask } from "@/application/board/delete-task";
import { getBoard } from "@/application/board/get-board";
import { updateTask } from "@/application/board/update-task";
import { TaskNotFoundError } from "@/domain/board/task-not-found-error";
import { createInMemoryBoardDependencies } from "@/test/in-memory-board-repositories";

const owner = { id: "user-1", login: "elianisdev" };
const stranger = { id: "user-2", login: "someone" };

const setup = () => {
  const dependencies = createInMemoryBoardDependencies();
  return {
    dependencies,
    getBoard: getBoard(dependencies),
    createTask: createTask(dependencies),
    updateTask: updateTask(dependencies),
    deleteTask: deleteTask(dependencies),
  };
};

describe("getBoard", () => {
  it("creates the board the first time and reuses it afterwards", async () => {
    const { getBoard, dependencies } = setup();

    const first = await getBoard(owner);
    const second = await getBoard(owner);

    expect(first.board.id).toBe(second.board.id);
    expect(first.tasks).toEqual([]);
    expect(dependencies.boardList).toHaveLength(1);
  });
});

describe("createTask", () => {
  it("adds the task to To do at the end of the column", async () => {
    const { createTask } = setup();

    await createTask(owner, { title: "First", description: "" });
    const result = await createTask(owner, { title: "Second", description: "Details" });

    expect(result).toMatchObject({
      success: true,
      task: { title: "Second", description: "Details", status: "TODO", position: 1 },
    });
  });

  it("returns the validation errors without saving", async () => {
    const { createTask, dependencies } = setup();

    const result = await createTask(owner, { title: "", description: "" });

    expect(result).toEqual({ success: false, errors: { title: "titleRequired" } });
    expect(dependencies.taskList).toHaveLength(0);
  });
});

describe("updateTask", () => {
  it("updates the title and description of an owned task", async () => {
    const { createTask, updateTask } = setup();
    const created = await createTask(owner, { title: "Draft", description: "" });
    if (!created.success) throw new Error("Task should be created");

    const result = await updateTask(owner, created.task.id, { title: "Final", description: "Done right" });

    expect(result).toMatchObject({ success: true, task: { title: "Final", description: "Done right" } });
  });

  it("does not let another user update the task", async () => {
    const { createTask, updateTask } = setup();
    const created = await createTask(owner, { title: "Mine", description: "" });
    if (!created.success) throw new Error("Task should be created");

    await expect(updateTask(stranger, created.task.id, { title: "Hacked", description: "" })).rejects.toThrow(
      TaskNotFoundError,
    );
  });
});

describe("deleteTask", () => {
  it("removes an owned task", async () => {
    const { createTask, deleteTask, dependencies } = setup();
    const created = await createTask(owner, { title: "Temporary", description: "" });
    if (!created.success) throw new Error("Task should be created");

    await deleteTask(owner, created.task.id);

    expect(dependencies.taskList).toHaveLength(0);
  });

  it("does not let another user delete the task", async () => {
    const { createTask, deleteTask, dependencies } = setup();
    const created = await createTask(owner, { title: "Mine", description: "" });
    if (!created.success) throw new Error("Task should be created");

    await expect(deleteTask(stranger, created.task.id)).rejects.toThrow(TaskNotFoundError);
    expect(dependencies.taskList).toHaveLength(1);
  });
});
