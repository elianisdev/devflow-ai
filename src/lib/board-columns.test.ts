import { groupTaskIds, locateTask, moveToColumnOf, reorderInColumn, type BoardColumns } from "@/lib/board-columns";

const columns: BoardColumns = {
  TODO: ["a", "b"],
  IN_PROGRESS: ["c"],
  IN_REVIEW: [],
  DONE: ["d"],
};

describe("board columns", () => {
  it("groups tasks by status in position order", () => {
    expect(
      groupTaskIds([
        { id: "b", status: "TODO", position: 1 },
        { id: "a", status: "TODO", position: 0 },
        { id: "c", status: "DONE", position: 0 },
      ]),
    ).toEqual({ TODO: ["a", "b"], IN_PROGRESS: [], IN_REVIEW: [], DONE: ["c"] });
  });

  it("locates a task with its position and the column size", () => {
    expect(locateTask(columns, "b")).toEqual({ status: "TODO", index: 1, total: 2 });
  });

  it("moves a task into an empty column when dropped on the column itself", () => {
    expect(moveToColumnOf(columns, "a", "IN_REVIEW")).toEqual({ ...columns, TODO: ["b"], IN_REVIEW: ["a"] });
  });

  it("moves a task before the card it is dropped on in another column", () => {
    expect(moveToColumnOf(columns, "a", "c")).toEqual({ ...columns, TODO: ["b"], IN_PROGRESS: ["a", "c"] });
  });

  it("keeps the columns when the task stays in the same column", () => {
    expect(moveToColumnOf(columns, "a", "b")).toBe(columns);
  });

  it("reorders a task inside its column", () => {
    expect(reorderInColumn(columns, "a", "b")).toEqual({ ...columns, TODO: ["b", "a"] });
  });
});
