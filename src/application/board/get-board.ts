import type { BoardDependencies, BoardOwner } from "@/application/board/board-dependencies";

export const getBoard =
  ({ boards, tasks }: BoardDependencies) =>
  async (owner: BoardOwner) => {
    const board = await boards.findOrCreateForUser(owner.id, owner.login);
    return { board, tasks: await tasks.listByBoard(board.id) };
  };
