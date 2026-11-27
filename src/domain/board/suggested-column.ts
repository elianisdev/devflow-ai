import { taskStatuses, type TaskStatus } from "@/domain/board/task";
import type { PullRequestState } from "@/domain/pull-request/pull-request";

const columnForState: Record<PullRequestState, TaskStatus | null> = {
  draft: "IN_PROGRESS",
  open: "IN_REVIEW",
  merged: "DONE",
  closed: null,
};

export const suggestColumn = (status: TaskStatus, pullRequestState: PullRequestState): TaskStatus | null => {
  const target = columnForState[pullRequestState];
  if (!target) return null;
  return taskStatuses.indexOf(target) > taskStatuses.indexOf(status) ? target : null;
};
