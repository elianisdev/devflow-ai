import { createTask } from "@/application/board/create-task";
import { deleteTask } from "@/application/board/delete-task";
import { getBoard } from "@/application/board/get-board";
import { moveTask } from "@/application/board/move-task";
import { updateTask } from "@/application/board/update-task";
import { createPrismaBoardRepository } from "@/infrastructure/prisma/prisma-board-repository";
import { createPrismaTaskRepository } from "@/infrastructure/prisma/prisma-task-repository";
import { prisma } from "@/lib/prisma";

const dependencies = {
  boards: createPrismaBoardRepository(prisma),
  tasks: createPrismaTaskRepository(prisma),
};

export const boardUseCases = {
  getBoard: getBoard(dependencies),
  createTask: createTask(dependencies),
  updateTask: updateTask(dependencies),
  deleteTask: deleteTask(dependencies),
  moveTask: moveTask(dependencies),
};
