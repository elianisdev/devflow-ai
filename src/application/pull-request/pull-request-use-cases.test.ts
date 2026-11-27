import { createTask } from "@/application/board/create-task";
import { getBoard } from "@/application/board/get-board";
import { linkPullRequest } from "@/application/pull-request/link-pull-request";
import { refreshPullRequests, staleAfterMilliseconds } from "@/application/pull-request/refresh-pull-requests";
import { unlinkPullRequest } from "@/application/pull-request/unlink-pull-request";
import { TaskNotFoundError } from "@/domain/board/task-not-found-error";
import type { PullRequest } from "@/domain/pull-request/pull-request";
import { createInMemoryBoardDependencies } from "@/test/in-memory-board-repositories";
import { createInMemoryPullRequestDependencies } from "@/test/in-memory-pull-request-dependencies";

const owner = { id: "user-1", login: "elianisdev" };
const stranger = { id: "user-2", login: "someone" };

const dragAndDrop: PullRequest = {
  owner: "elianisdev",
  repo: "devflow-ai",
  number: 15,
  url: "https://github.com/elianisdev/devflow-ai/pull/15",
  title: "feat: accessible drag and drop for board tasks",
  state: "open",
};

const setup = async () => {
  const board = createInMemoryBoardDependencies();
  const gitHub = createInMemoryPullRequestDependencies(board);
  gitHub.publish(dragAndDrop);
  const created = await createTask(board)(owner, { title: "Drag and drop", description: "" });
  if (!created.success) throw new Error("Task should be created");

  return {
    gitHub,
    taskId: created.task.id,
    linkedPullRequestOf: async (taskId: string) =>
      (await getBoard(board)(owner)).tasks.find((task) => task.id === taskId)?.pullRequest,
    linkPullRequest: linkPullRequest(gitHub.dependencies),
    unlinkPullRequest: unlinkPullRequest(gitHub.dependencies),
    refreshPullRequests: refreshPullRequests(gitHub.dependencies),
  };
};

describe("linkPullRequest", () => {
  it("links the pull request with the data GitHub returns", async () => {
    const { gitHub, taskId, linkPullRequest, linkedPullRequestOf } = await setup();

    const result = await linkPullRequest(owner, taskId, " https://github.com/elianisdev/devflow-ai/pull/15 ");

    expect(result).toEqual({ success: true });
    expect(await linkedPullRequestOf(taskId)).toEqual({ ...dragAndDrop, syncedAt: gitHub.clock.current });
  });

  it("replaces the previous pull request, because a task has at most one", async () => {
    const { gitHub, taskId, linkPullRequest, linkedPullRequestOf } = await setup();
    gitHub.publish({ ...dragAndDrop, number: 16, title: "feat: link tasks to pull requests", state: "draft" });

    await linkPullRequest(owner, taskId, "https://github.com/elianisdev/devflow-ai/pull/15");
    await linkPullRequest(owner, taskId, "https://github.com/elianisdev/devflow-ai/pull/16");

    expect(await linkedPullRequestOf(taskId)).toMatchObject({ number: 16, state: "draft" });
  });

  it("explains why the pull request could not be linked", async () => {
    const { gitHub, taskId, linkPullRequest, linkedPullRequestOf } = await setup();

    expect(await linkPullRequest(owner, taskId, "https://github.com/elianisdev/devflow-ai/issues/15")).toEqual({
      success: false,
      error: "invalidUrl",
    });
    expect(await linkPullRequest(owner, taskId, "https://github.com/elianisdev/devflow-ai/pull/99")).toEqual({
      success: false,
      error: "notFound",
    });
    gitHub.status.isAvailable = false;
    expect(await linkPullRequest(owner, taskId, "https://github.com/elianisdev/devflow-ai/pull/15")).toEqual({
      success: false,
      error: "unavailable",
    });
    expect(await linkedPullRequestOf(taskId)).toBeNull();
  });

  it("does not call GitHub when the URL is not a pull request", async () => {
    const { gitHub, taskId, linkPullRequest } = await setup();

    await linkPullRequest(owner, taskId, "not a url");

    expect(gitHub.lookups).toHaveLength(0);
  });

  it("does not let another user link a pull request to the task", async () => {
    const { taskId, linkPullRequest, linkedPullRequestOf } = await setup();

    await expect(
      linkPullRequest(stranger, taskId, "https://github.com/elianisdev/devflow-ai/pull/15"),
    ).rejects.toThrow(TaskNotFoundError);
    expect(await linkedPullRequestOf(taskId)).toBeNull();
  });
});

describe("unlinkPullRequest", () => {
  it("removes the pull request from the task", async () => {
    const { taskId, linkPullRequest, unlinkPullRequest, linkedPullRequestOf } = await setup();
    await linkPullRequest(owner, taskId, dragAndDrop.url);

    await unlinkPullRequest(owner, taskId);

    expect(await linkedPullRequestOf(taskId)).toBeNull();
  });

  it("does not let another user unlink it", async () => {
    const { taskId, linkPullRequest, unlinkPullRequest, linkedPullRequestOf } = await setup();
    await linkPullRequest(owner, taskId, dragAndDrop.url);

    await expect(unlinkPullRequest(stranger, taskId)).rejects.toThrow(TaskNotFoundError);
    expect(await linkedPullRequestOf(taskId)).not.toBeNull();
  });
});

describe("refreshPullRequests", () => {
  const later = (date: Date, milliseconds: number) => new Date(date.getTime() + milliseconds);

  it("updates only the pull requests synced more than two minutes ago", async () => {
    const { gitHub, taskId, linkPullRequest, refreshPullRequests, linkedPullRequestOf } = await setup();
    await linkPullRequest(owner, taskId, dragAndDrop.url);
    gitHub.publish({ ...dragAndDrop, state: "merged" });
    gitHub.lookups.length = 0;

    gitHub.clock.current = later(gitHub.clock.current, staleAfterMilliseconds - 1000);
    await refreshPullRequests(owner);
    expect(gitHub.lookups).toHaveLength(0);

    gitHub.clock.current = later(gitHub.clock.current, 2000);
    await refreshPullRequests(owner);
    expect(await linkedPullRequestOf(taskId)).toMatchObject({ state: "merged", syncedAt: gitHub.clock.current });
  });

  it("keeps the last saved state when GitHub does not respond", async () => {
    const { gitHub, taskId, linkPullRequest, refreshPullRequests, linkedPullRequestOf } = await setup();
    await linkPullRequest(owner, taskId, dragAndDrop.url);
    const firstSync = gitHub.clock.current;
    gitHub.status.isAvailable = false;

    gitHub.clock.current = later(firstSync, staleAfterMilliseconds * 2);
    await refreshPullRequests(owner);

    expect(await linkedPullRequestOf(taskId)).toMatchObject({ state: "open", syncedAt: firstSync });
  });

  it("only refreshes the pull requests of the current user", async () => {
    const { gitHub, taskId, linkPullRequest, refreshPullRequests } = await setup();
    await linkPullRequest(owner, taskId, dragAndDrop.url);
    gitHub.lookups.length = 0;

    gitHub.clock.current = later(gitHub.clock.current, staleAfterMilliseconds * 2);
    await refreshPullRequests(stranger);

    expect(gitHub.lookups).toHaveLength(0);
  });
});
