import { resolvePullRequestState } from "@/domain/pull-request/pull-request";

describe("resolvePullRequestState", () => {
  it("returns merged before closed, because a merged pull request is also closed", () => {
    expect(resolvePullRequestState({ isClosed: true, isDraft: false, isMerged: true })).toBe("merged");
  });

  it("returns closed when it was closed without merging", () => {
    expect(resolvePullRequestState({ isClosed: true, isDraft: true, isMerged: false })).toBe("closed");
  });

  it("tells a draft apart from an open pull request", () => {
    expect(resolvePullRequestState({ isClosed: false, isDraft: true, isMerged: false })).toBe("draft");
    expect(resolvePullRequestState({ isClosed: false, isDraft: false, isMerged: false })).toBe("open");
  });
});
