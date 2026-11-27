import type { TaskStatus } from "@/domain/board/task";
import type { TaskInputErrorCode } from "@/domain/board/task-input";
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
  auth: {
    signIn: "Continue with GitHub",
    signingIn: "Redirecting to GitHub…",
    signOut: "Sign out",
    signInCancelled: "You cancelled the sign-in on GitHub. You can try again whenever you want.",
    signInFailed: "We couldn't sign you in with GitHub. Please try again.",
  },
  board: {
    title: "{name}'s board",
    path: "board",
    summaryLabel: "Board summary",
    userMenuLabel: "User menu",
    newTask: "New task",
    createFirst: "+ Create the first one",
    noPullRequest: "No PR",
    stationEmpty: "No tasks",
    taskCount: (count: number) => (count === 1 ? "1 task" : `${count} tasks`),
    doneCount: (count: number) => `${count} done`,
    columns: {
      TODO: {
        title: "To do",
        emptyTitle: "Everything starts with a task",
        emptyText: "Write down what you are going to build. You can link it to its PR later.",
      },
      IN_PROGRESS: {
        title: "In progress",
        emptyTitle: "Nothing in motion yet",
        emptyText: "When you start a task, move it to this station so everyone sees what you are on.",
      },
      IN_REVIEW: {
        title: "In review",
        emptyTitle: "Nobody is waiting on your review",
        emptyText: "When you open a PR, its task stops at this station until it gets approved.",
      },
      DONE: {
        title: "Done",
        emptyTitle: "No merges yet",
        emptyText: "The first one is always the hardest.",
      },
    } satisfies Record<TaskStatus, { title: string; emptyTitle: string; emptyText: string }>,
  },
  taskForm: {
    createTitle: "New task",
    createDescription: "It lands in To do. You can link it to its PR later.",
    detailTitle: "Task details",
    close: "Close",
    title: "Title",
    description: "Description (optional)",
    descriptionPlaceholder: "What needs to be done and how you know it is finished.",
    cancel: "Cancel",
    create: "Create task",
    creating: "Creating…",
    save: "Save changes",
    saving: "Saving…",
    errors: {
      titleRequired: "Write a title for the task.",
      titleTooLong: "Use 120 characters or fewer.",
    } satisfies Record<TaskInputErrorCode, string>,
  },
  deleteTask: {
    open: "Delete task",
    title: "Delete this task?",
    description: "“{title}” will be removed from the board and cannot be recovered.",
    keep: "Keep it",
    confirm: "Yes, delete",
    pending: "Deleting…",
  },
  prStates: {
    draft: "Draft",
    open: "Open",
    merged: "Merged",
    closed: "Closed",
  } satisfies Record<PrState, string>,
};
