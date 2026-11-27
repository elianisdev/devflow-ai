import { parseTaskInput, taskTitleMaxLength } from "@/domain/board/task-input";

describe("parseTaskInput", () => {
  it("trims the title and turns an empty description into null", () => {
    expect(parseTaskInput({ title: "  Ship the board  ", description: "   " })).toEqual({
      success: true,
      data: { title: "Ship the board", description: null },
    });
  });

  it("rejects a blank title", () => {
    expect(parseTaskInput({ title: "   ", description: "" })).toEqual({
      success: false,
      errors: { title: "titleRequired" },
    });
  });

  it("rejects a title longer than the limit", () => {
    expect(parseTaskInput({ title: "a".repeat(taskTitleMaxLength + 1), description: "" })).toEqual({
      success: false,
      errors: { title: "titleTooLong" },
    });
  });

  it("accepts a title at the limit", () => {
    expect(parseTaskInput({ title: "a".repeat(taskTitleMaxLength), description: null }).success).toBe(true);
  });
});
