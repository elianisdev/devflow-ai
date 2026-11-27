import type { PrState as PrismaPullRequestState } from "@/generated/prisma/client";
import type { PullRequestState } from "@/domain/pull-request/pull-request";

export const toPrismaPullRequestState = (state: PullRequestState) => state.toUpperCase() as PrismaPullRequestState;

export const fromPrismaPullRequestState = (state: PrismaPullRequestState) => state.toLowerCase() as PullRequestState;
