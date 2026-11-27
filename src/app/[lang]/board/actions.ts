"use server";

import { revalidatePath } from "next/cache";
import type { BoardOwner, RawTaskInput } from "@/application/board/board-dependencies";
import { boardUseCases } from "@/infrastructure/board-use-cases";
import { getCurrentSession } from "@/lib/session";
import type { TaskFormState } from "@/types/task-form";

const getOwner = async (): Promise<BoardOwner> => {
  const session = await getCurrentSession();
  if (!session) throw new Error("A session is required to change the board");
  return { id: session.user.id, login: session.user.login };
};

const readTaskInput = (formData: FormData): RawTaskInput => ({
  title: formData.get("title"),
  description: formData.get("description"),
});

const refreshBoard = () => revalidatePath("/[lang]/board", "page");

export async function createTaskAction(_state: TaskFormState, formData: FormData): Promise<TaskFormState> {
  const result = await boardUseCases.createTask(await getOwner(), readTaskInput(formData));
  if (!result.success) return { errors: result.errors };
  refreshBoard();
  return { success: true };
}

export async function updateTaskAction(
  taskId: string,
  _state: TaskFormState,
  formData: FormData,
): Promise<TaskFormState> {
  const result = await boardUseCases.updateTask(await getOwner(), taskId, readTaskInput(formData));
  if (!result.success) return { errors: result.errors };
  refreshBoard();
  return { success: true };
}

export async function deleteTaskAction(taskId: string): Promise<void> {
  await boardUseCases.deleteTask(await getOwner(), taskId);
  refreshBoard();
}
