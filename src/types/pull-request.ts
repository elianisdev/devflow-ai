import type { LinkPullRequestErrorCode } from "@/application/pull-request/link-pull-request";

export type { PullRequestState as PrState } from "@/domain/pull-request/pull-request";

export type PullRequestFormState = {
  error?: LinkPullRequestErrorCode;
  success?: boolean;
};

export type PullRequestFormAction = (state: PullRequestFormState, formData: FormData) => Promise<PullRequestFormState>;
