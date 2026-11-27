import type { TaskInputErrors } from "@/domain/board/task-input";

export type TaskFormState = {
  errors?: TaskInputErrors;
  success?: boolean;
};

export type TaskFormAction = (state: TaskFormState, formData: FormData) => Promise<TaskFormState>;
