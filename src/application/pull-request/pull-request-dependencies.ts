import type { PullRequestGateway, PullRequestLinkRepository } from "@/domain/pull-request/pull-request-ports";

export type PullRequestDependencies = {
  pullRequests: PullRequestGateway;
  links: PullRequestLinkRepository;
  now: () => Date;
};
