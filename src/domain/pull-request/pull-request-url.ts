import type { PullRequestReference } from "@/domain/pull-request/pull-request";

const pullRequestUrlPattern =
  /^(?:https?:\/\/)?(?:www\.)?github\.com\/([A-Za-z0-9-]{1,39})\/([A-Za-z0-9._-]{1,100})\/pull\/([1-9]\d{0,9})(?:\/[A-Za-z]*)?\/?(?:[?#].*)?$/;

export const parsePullRequestUrl = (raw: unknown): PullRequestReference | null => {
  if (typeof raw !== "string") return null;

  const match = pullRequestUrlPattern.exec(raw.trim());
  if (!match) return null;

  const [, owner, repo, number] = match;
  return { owner, repo, number: Number(number) };
};
