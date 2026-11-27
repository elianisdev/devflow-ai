export const pullRequestStates = ["draft", "open", "merged", "closed"] as const;

export type PullRequestState = (typeof pullRequestStates)[number];

export type PullRequestReference = {
  owner: string;
  repo: string;
  number: number;
};

export type PullRequest = PullRequestReference & {
  url: string;
  title: string;
  state: PullRequestState;
};

export type LinkedPullRequest = PullRequest & {
  syncedAt: Date;
};

export const resolvePullRequestState = ({
  isClosed,
  isDraft,
  isMerged,
}: {
  isClosed: boolean;
  isDraft: boolean;
  isMerged: boolean;
}): PullRequestState => {
  if (isMerged) return "merged";
  if (isClosed) return "closed";
  if (isDraft) return "draft";
  return "open";
};
