import type { PullRequest, PullRequestReference } from "@/domain/pull-request/pull-request";

export type PullRequestLookup =
  | { status: "found"; pullRequest: PullRequest }
  | { status: "notFound" }
  | { status: "unauthorized" }
  | { status: "unavailable" };

export interface PullRequestGateway {
  find(userId: string, reference: PullRequestReference): Promise<PullRequestLookup>;
}

export type StaleLink = PullRequestReference & {
  taskId: string;
};

export interface PullRequestLinkRepository {
  saveForOwnedTask(userId: string, taskId: string, pullRequest: PullRequest, syncedAt: Date): Promise<boolean>;
  deleteForOwnedTask(userId: string, taskId: string): Promise<boolean>;
  listStaleOwnedBy(userId: string, syncedBefore: Date): Promise<StaleLink[]>;
  refresh(taskId: string, pullRequest: PullRequest, syncedAt: Date): Promise<void>;
}
