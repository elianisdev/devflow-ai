import type { PullRequestDependencies } from "@/application/pull-request/pull-request-dependencies";
import type { PullRequest, PullRequestReference } from "@/domain/pull-request/pull-request";
import type { PullRequestLookup } from "@/domain/pull-request/pull-request-ports";
import type { InMemoryBoardDependencies } from "@/infrastructure/memory/in-memory-board-repositories";
import { createInMemoryPullRequestLinkRepository } from "@/infrastructure/memory/in-memory-pull-request-link-repository";

const referenceKey = ({ owner, repo, number }: PullRequestReference) => `${owner}/${repo}#${number}`.toLowerCase();

export const createInMemoryPullRequestDependencies = (board: InMemoryBoardDependencies) => {
  const gitHub = new Map<string, PullRequest>();
  const clock = { current: new Date("2026-11-27T12:00:00Z") };
  const status = { isAvailable: true };
  const lookups: PullRequestReference[] = [];

  const dependencies: PullRequestDependencies = {
    now: () => clock.current,
    pullRequests: {
      find: async (_userId, reference): Promise<PullRequestLookup> => {
        lookups.push(reference);
        if (!status.isAvailable) return { status: "unavailable" };
        const pullRequest = gitHub.get(referenceKey(reference));
        return pullRequest ? { status: "found", pullRequest } : { status: "notFound" };
      },
    },
    links: createInMemoryPullRequestLinkRepository(board),
  };

  return {
    dependencies,
    clock,
    status,
    lookups,
    publish: (pullRequest: PullRequest) => gitHub.set(referenceKey(pullRequest), pullRequest),
  };
};
