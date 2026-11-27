import { suggestColumn } from "@/domain/board/suggested-column";

describe("suggestColumn", () => {
  it("suggests the column that matches the pull request state", () => {
    expect(suggestColumn("TODO", "draft")).toBe("IN_PROGRESS");
    expect(suggestColumn("IN_PROGRESS", "open")).toBe("IN_REVIEW");
    expect(suggestColumn("IN_REVIEW", "merged")).toBe("DONE");
  });

  it("only suggests moving forward, never back", () => {
    expect(suggestColumn("DONE", "open")).toBeNull();
    expect(suggestColumn("IN_REVIEW", "draft")).toBeNull();
  });

  it("suggests nothing when the task is already there or the pull request was closed without merging", () => {
    expect(suggestColumn("DONE", "merged")).toBeNull();
    expect(suggestColumn("TODO", "closed")).toBeNull();
  });
});
