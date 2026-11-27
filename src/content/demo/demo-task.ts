import type { TaskStatus } from "@/domain/board/task";
import type { PullRequestState } from "@/domain/pull-request/pull-request";

export type DemoTask = {
  title: string;
  description: string | null;
  status: TaskStatus;
  pullRequest: { number: number; title: string; state: PullRequestState } | null;
};

export const demoRepository = { owner: "elianisdev", repo: "devflow-ai" };

export const demoSnapshotDate = new Date("2026-11-27T15:00:00Z");

export const demoPullRequests = {
  pinNode: { number: 12, title: "fix: pin Node.js 24 for Vercel builds", state: "merged" },
  signIn: { number: 13, title: "feat: sign in with GitHub", state: "merged" },
  board: { number: 14, title: "feat: board with fixed columns and task CRUD", state: "merged" },
  dragAndDrop: { number: 15, title: "feat: accessible drag and drop for board tasks", state: "open" },
  linkPullRequests: { number: 16, title: "feat: link tasks to pull requests and suggest the next column", state: "draft" },
} satisfies Record<string, NonNullable<DemoTask["pullRequest"]>>;
