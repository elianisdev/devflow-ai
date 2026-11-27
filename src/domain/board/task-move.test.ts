import { placeInOrder } from "@/domain/board/task-move";

describe("placeInOrder", () => {
  it("inserts the task at the given index", () => {
    expect(placeInOrder(["a", "b", "c"], "x", 1)).toEqual(["a", "x", "b", "c"]);
  });

  it("moves a task that is already in the column", () => {
    expect(placeInOrder(["a", "b", "c"], "a", 2)).toEqual(["b", "c", "a"]);
  });

  it("appends the task when no index is given or the index is too large", () => {
    expect(placeInOrder(["a", "b"], "x")).toEqual(["a", "b", "x"]);
    expect(placeInOrder(["a", "b"], "x", 99)).toEqual(["a", "b", "x"]);
  });
});
