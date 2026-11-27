import { demoPullRequests, type DemoTask } from "./demo-task";

export const en: DemoTask[] = [
  {
    title: "Demo mode",
    description: "A sample board without sign-in that never writes to the database.",
    status: "TODO",
    pullRequest: null,
  },
  { title: "E2E test and v0.1 release", description: null, status: "TODO", pullRequest: null },
  {
    title: "Link tasks to pull requests",
    description: "Paste the pull request URL and see its state on the card.",
    status: "IN_PROGRESS",
    pullRequest: demoPullRequests.linkPullRequests,
  },
  { title: "Pin Node 24 on Vercel", description: null, status: "IN_PROGRESS", pullRequest: demoPullRequests.pinNode },
  {
    title: "Accessible drag and drop",
    description: "Mouse, touch and keyboard, with screen reader announcements.",
    status: "IN_REVIEW",
    pullRequest: demoPullRequests.dragAndDrop,
  },
  { title: "Board with fixed columns", description: null, status: "DONE", pullRequest: demoPullRequests.board },
  { title: "Sign in with GitHub", description: null, status: "DONE", pullRequest: demoPullRequests.signIn },
];
