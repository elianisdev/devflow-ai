import type { RawTaskInput } from "@/application/board/board-dependencies";

export const readTaskInput = (formData: FormData): RawTaskInput => ({
  title: formData.get("title"),
  description: formData.get("description"),
});

export const readChangedStatus = (formData: FormData, currentStatus: string) => {
  const status = formData.get("status");
  return status && status !== currentStatus ? status : null;
};
