import { z } from "zod";

export const taskTitleMaxLength = 120;

export const taskInputErrorCodes = ["titleRequired", "titleTooLong"] as const;

export type TaskInputErrorCode = (typeof taskInputErrorCodes)[number];

export const taskInputSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "titleRequired" satisfies TaskInputErrorCode)
    .max(taskTitleMaxLength, "titleTooLong" satisfies TaskInputErrorCode),
  description: z
    .string()
    .trim()
    .transform((value) => value || null),
});

export type TaskInput = z.infer<typeof taskInputSchema>;

export type TaskInputErrors = Partial<Record<keyof TaskInput, TaskInputErrorCode>>;

export type TaskInputResult =
  | { success: true; data: TaskInput }
  | { success: false; errors: TaskInputErrors };

export const parseTaskInput = (raw: { title: unknown; description: unknown }): TaskInputResult => {
  const result = taskInputSchema.safeParse({
    title: raw.title ?? "",
    description: raw.description ?? "",
  });

  if (result.success) return { success: true, data: result.data };

  const errors: TaskInputErrors = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0] as keyof TaskInput;
    errors[field] ??= issue.message as TaskInputErrorCode;
  }
  return { success: false, errors };
};
