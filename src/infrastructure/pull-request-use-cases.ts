import { linkPullRequest } from "@/application/pull-request/link-pull-request";
import { refreshPullRequests } from "@/application/pull-request/refresh-pull-requests";
import { unlinkPullRequest } from "@/application/pull-request/unlink-pull-request";
import { createGitHubPullRequestGateway } from "@/infrastructure/github/github-pull-request-gateway";
import { createPrismaGitHubAccessTokenReader } from "@/infrastructure/prisma/prisma-github-access-token";
import { createPrismaPullRequestLinkRepository } from "@/infrastructure/prisma/prisma-pull-request-link-repository";
import { prisma } from "@/lib/prisma";

const dependencies = {
  pullRequests: createGitHubPullRequestGateway({ getAccessToken: createPrismaGitHubAccessTokenReader(prisma) }),
  links: createPrismaPullRequestLinkRepository(prisma),
  now: () => new Date(),
};

export const pullRequestUseCases = {
  linkPullRequest: linkPullRequest(dependencies),
  unlinkPullRequest: unlinkPullRequest(dependencies),
  refreshPullRequests: refreshPullRequests(dependencies),
};
