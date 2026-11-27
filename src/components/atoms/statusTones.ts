import type { TaskStatus } from "@/domain/board/task";

export const statusToneClassNames: Record<
  TaskStatus,
  { border: string; text: string; softBackground: string; outline: string }
> = {
  TODO: { border: "border-neutral-700", text: "text-neutral-700", softBackground: "bg-neutral-100", outline: "outline-neutral-100" },
  IN_PROGRESS: { border: "border-blue-700", text: "text-blue-700", softBackground: "bg-blue-50", outline: "outline-blue-50" },
  IN_REVIEW: { border: "border-warning-700", text: "text-warning-700", softBackground: "bg-warning-50", outline: "outline-warning-50" },
  DONE: { border: "border-merged-700", text: "text-merged-700", softBackground: "bg-merged-50", outline: "outline-merged-50" },
};
