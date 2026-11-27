import type { RawTaskInput } from "@/application/board/board-dependencies";
import { createTask } from "@/application/board/create-task";
import { deleteTask } from "@/application/board/delete-task";
import { getBoard } from "@/application/board/get-board";
import { moveTask } from "@/application/board/move-task";
import { updateTask } from "@/application/board/update-task";
import { unlinkPullRequest } from "@/application/pull-request/unlink-pull-request";
import { demoRepository, demoSnapshotDate, type DemoTask } from "@/content/demo/demo-task";
import type { BoardTask } from "@/domain/board/task";
import type { PullRequestGateway } from "@/domain/pull-request/pull-request-ports";
import { createInMemoryBoardDependencies } from "@/infrastructure/memory/in-memory-board-repositories";
import { createInMemoryPullRequestLinkRepository } from "@/infrastructure/memory/in-memory-pull-request-link-repository";

const demoOwner = { id: "demo-user", login: "demo" };
const demoBoard = { id: "demo-board", userId: demoOwner.id, name: demoOwner.login };

const offlineGateway: PullRequestGateway = { find: async () => ({ status: "unavailable" }) };

const pullRequestUrl = (number: number) =>
  `https://github.com/${demoRepository.owner}/${demoRepository.repo}/pull/${number}`;

const toBoardTasks = (demoTasks: DemoTask[], snapshotDate: Date): BoardTask[] =>
  demoTasks.map(({ pullRequest, ...task }, index) => ({
    ...task,
    id: `demo-${index + 1}`,
    boardId: demoBoard.id,
    position: demoTasks.slice(0, index).filter((previous) => previous.status === task.status).length,
    createdAt: snapshotDate,
    updatedAt: snapshotDate,
    pullRequest: pullRequest && {
      ...pullRequest,
      ...demoRepository,
      url: pullRequestUrl(pullRequest.number),
      syncedAt: snapshotDate,
    },
  }));

export const createDemoUseCases = (demoTasks: DemoTask[]) => {
  const initialTasks = toBoardTasks(demoTasks, demoSnapshotDate);
  const board = createInMemoryBoardDependencies();
  board.boardList.push(demoBoard);
  for (const { pullRequest, ...task } of initialTasks) {
    board.taskList.push(task);
    if (pullRequest) board.linkList.push({ ...pullRequest, taskId: task.id });
  }
  const pullRequestDependencies = {
    pullRequests: offlineGateway,
    links: createInMemoryPullRequestLinkRepository(board),
    now: () => new Date(),
  };

  return {
    initialTasks,
    listTasks: async () => (await getBoard(board)(demoOwner)).tasks,
    createTask: (raw: RawTaskInput) => createTask(board)(demoOwner, raw),
    updateTask: (taskId: string, raw: RawTaskInput) => updateTask(board)(demoOwner, taskId, raw),
    deleteTask: (taskId: string) => deleteTask(board)(demoOwner, taskId),
    moveTask: (taskId: string, status: unknown, index?: number) =>
      moveTask(board)(demoOwner, taskId, { status, index }),
    unlinkPullRequest: (taskId: string) => unlinkPullRequest(pullRequestDependencies)(demoOwner, taskId),
  };
};
