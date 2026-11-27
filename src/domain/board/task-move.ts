import { z } from "zod";
import { taskStatuses } from "@/domain/board/task";

export const taskMoveSchema = z.object({
  status: z.enum(taskStatuses),
  index: z.number().int().min(0).optional(),
});

export type TaskMove = z.infer<typeof taskMoveSchema>;

export const placeInOrder = (orderedIds: string[], taskId: string, index?: number): string[] => {
  const others = orderedIds.filter((id) => id !== taskId);
  const position = Math.min(index ?? others.length, others.length);
  return [...others.slice(0, position), taskId, ...others.slice(position)];
};
