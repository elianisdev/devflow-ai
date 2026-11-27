import type { PrismaClient } from "@/generated/prisma/client";
import type { BoardRepository } from "@/domain/board/board-repositories";

export const createPrismaBoardRepository = (client: PrismaClient): BoardRepository => ({
  findOrCreateForUser: (userId, name) =>
    client.board.upsert({
      where: { userId },
      update: {},
      create: { userId, name },
      select: { id: true, userId: true, name: true },
    }),
});
