import type { BoardDependencies } from "@/application/board/board-dependencies";
import type { Board, Task } from "@/domain/board/task";
import { placeInOrder } from "@/domain/board/task-move";

export const createInMemoryBoardDependencies = (): BoardDependencies & { boardList: Board[]; taskList: Task[] } => {
  const boardList: Board[] = [];
  const taskList: Task[] = [];
  const isOwnedBy = (userId: string, task: Task) =>
    boardList.some((board) => board.id === task.boardId && board.userId === userId);

  return {
    boardList,
    taskList,
    boards: {
      findOrCreateForUser: async (userId, name) => {
        const existing = boardList.find((board) => board.userId === userId);
        if (existing) return existing;
        const board = { id: `board-${boardList.length + 1}`, userId, name };
        boardList.push(board);
        return board;
      },
    },
    tasks: {
      listByBoard: async (boardId) => taskList.filter((task) => task.boardId === boardId),
      nextPosition: async (boardId, status) =>
        taskList.filter((task) => task.boardId === boardId && task.status === status).length,
      create: async (input) => {
        const now = new Date();
        const task = { ...input, id: `task-${taskList.length + 1}`, createdAt: now, updatedAt: now };
        taskList.push(task);
        return task;
      },
      updateOwnedBy: async (userId, taskId, input) => {
        const task = taskList.find((item) => item.id === taskId);
        if (!task || !isOwnedBy(userId, task)) return null;
        Object.assign(task, input, { updatedAt: new Date() });
        return task;
      },
      deleteOwnedBy: async (userId, taskId) => {
        const index = taskList.findIndex((item) => item.id === taskId && isOwnedBy(userId, item));
        if (index === -1) return false;
        taskList.splice(index, 1);
        return true;
      },
      moveOwnedBy: async (userId, taskId, { status, index }) => {
        const task = taskList.find((item) => item.id === taskId);
        if (!task || !isOwnedBy(userId, task)) return false;

        const columnIds = (columnStatus: Task["status"]) =>
          taskList
            .filter((item) => item.boardId === task.boardId && item.status === columnStatus)
            .sort((first, second) => first.position - second.position)
            .map((item) => item.id);
        const renumber = (orderedIds: string[], columnStatus: Task["status"]) =>
          orderedIds.forEach((id, position) => {
            Object.assign(taskList.find((item) => item.id === id) as Task, { status: columnStatus, position });
          });

        const sourceStatus = task.status;
        renumber(placeInOrder(columnIds(status), taskId, index), status);
        if (sourceStatus !== status) renumber(columnIds(sourceStatus), sourceStatus);
        return true;
      },
    },
  };
};
