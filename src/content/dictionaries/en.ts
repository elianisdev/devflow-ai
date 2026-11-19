import type { PrState } from "@/types/pull-request";

export const en = {
  metadata: {
    title: "DevFlow AI",
    description:
      "A task board for development teams where every task is linked to its GitHub pull request.",
  },
  home: {
    status: "devflow-ai · v0.1 in progress",
    title: "Every task, linked to its pull request.",
    description:
      "DevFlow AI is a task board for development teams. Each card shows the real state of its GitHub pull request, so nobody has to switch tools to know what is in review or already merged.",
    prStatesTitle: "Pull request states",
  },
  prStates: {
    draft: "Draft",
    open: "Open",
    merged: "Merged",
    closed: "Closed",
  } satisfies Record<PrState, string>,
};
