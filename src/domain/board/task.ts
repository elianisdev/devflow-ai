import type { LinkedPullRequest } from "@/domain/pull-request/pull-request";

export const taskStatuses = ["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"] as const;

export type TaskStatus = (typeof taskStatuses)[number];

export type Task = {
  id: string;
  boardId: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  position: number;
  createdAt: Date;
  updatedAt: Date;
};

export type Board = {
  id: string;
  userId: string;
  name: string;
};

export type BoardTask = Task & {
  pullRequest: LinkedPullRequest | null;
};
