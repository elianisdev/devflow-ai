import { arrayMove } from "@dnd-kit/sortable";
import { taskStatuses, type TaskStatus } from "@/domain/board/task";

export type BoardColumns = Record<TaskStatus, string[]>;

export type TaskLocation = {
  status: TaskStatus;
  index: number;
  total: number;
};

const isTaskStatus = (id: string): id is TaskStatus => (taskStatuses as readonly string[]).includes(id);

export const groupTaskIds = (tasks: { id: string; status: TaskStatus; position: number }[]): BoardColumns =>
  Object.fromEntries(
    taskStatuses.map((status) => [
      status,
      tasks
        .filter((task) => task.status === status)
        .sort((first, second) => first.position - second.position)
        .map((task) => task.id),
    ]),
  ) as BoardColumns;

export const findColumnOf = (columns: BoardColumns, id: string): TaskStatus | undefined =>
  isTaskStatus(id) ? id : taskStatuses.find((status) => columns[status].includes(id));

export const locateTask = (columns: BoardColumns, taskId: string): TaskLocation | undefined => {
  const status = findColumnOf(columns, taskId);
  if (!status) return undefined;
  return { status, index: columns[status].indexOf(taskId), total: columns[status].length };
};

export const moveToColumnOf = (columns: BoardColumns, activeId: string, overId: string): BoardColumns => {
  const source = findColumnOf(columns, activeId);
  const target = findColumnOf(columns, overId);
  if (!source || !target || source === target) return columns;

  const targetIds = columns[target];
  const overIndex = targetIds.indexOf(overId);
  const insertAt = overIndex === -1 ? targetIds.length : overIndex;

  return {
    ...columns,
    [source]: columns[source].filter((id) => id !== activeId),
    [target]: [...targetIds.slice(0, insertAt), activeId, ...targetIds.slice(insertAt)],
  };
};

export const reorderInColumn = (columns: BoardColumns, activeId: string, overId: string): BoardColumns => {
  const status = findColumnOf(columns, activeId);
  if (!status || findColumnOf(columns, overId) !== status) return columns;

  const ids = columns[status];
  const from = ids.indexOf(activeId);
  const to = isTaskStatus(overId) ? ids.length - 1 : ids.indexOf(overId);
  if (from === to) return columns;

  return { ...columns, [status]: arrayMove(ids, from, to) };
};
