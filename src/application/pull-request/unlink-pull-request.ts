import type { BoardOwner } from "@/application/board/board-dependencies";
import type { PullRequestDependencies } from "@/application/pull-request/pull-request-dependencies";
import { TaskNotFoundError } from "@/domain/board/task-not-found-error";

export const unlinkPullRequest =
  ({ links }: PullRequestDependencies) =>
  async (owner: BoardOwner, taskId: string): Promise<void> => {
    const deleted = await links.deleteForOwnedTask(owner.id, taskId);
    if (!deleted) throw new TaskNotFoundError(taskId);
  };
