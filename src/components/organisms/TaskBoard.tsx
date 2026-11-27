"use client";

import { useId, useRef, useState, useTransition, type ReactNode } from "react";
import {
  closestCorners,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useDroppable,
  useSensor,
  useSensors,
  type Announcements,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/atoms/Button";
import { statusToneClassNames } from "@/components/atoms/statusTones";
import { BoardStation } from "@/components/molecules/BoardStation";
import { ColumnEmptyState } from "@/components/molecules/ColumnEmptyState";
import type { DeleteTaskLabels } from "@/components/molecules/DeleteTaskDialog";
import { TaskCard } from "@/components/molecules/TaskCard";
import { TaskCardFace } from "@/components/molecules/TaskCardFace";
import type { TaskFormLabels } from "@/components/molecules/TaskForm";
import { BoardMetroLine } from "@/components/organisms/BoardMetroLine";
import { taskStatuses, type TaskStatus } from "@/domain/board/task";
import {
  findColumnOf,
  groupTaskIds,
  locateTask,
  moveToColumnOf,
  reorderInColumn,
  type BoardColumns,
} from "@/lib/board-columns";
import { formatCount, formatMessage } from "@/lib/format-message";
import type { TaskFormState } from "@/types/task-form";

type BoardTask = {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  position: number;
};

export type TaskBoardLabels = {
  columns: Record<TaskStatus, { title: string; emptyTitle: string; emptyText: string }>;
  stationEmpty: string;
  taskCountOne: string;
  taskCountMany: string;
  noPullRequest: string;
  detailTitle: string;
  close: string;
  statusLabel: string;
  statusHint: string;
  editForm: TaskFormLabels;
  deleteTask: DeleteTaskLabels;
  drag: {
    roleDescription: string;
    instructions: string;
    pickedUp: string;
    movedTo: string;
    droppedIn: string;
    cancelled: string;
    dropHere: string;
    position: string;
    shortcutsMove: string;
    shortcutsDrop: string;
    shortcutsCancel: string;
    moveFailed: string;
    closeNotice: string;
  };
};

type TaskBoardProps = {
  tasks: BoardTask[];
  labels: TaskBoardLabels;
  todoEmptyAction: ReactNode;
  updateTaskAction: (taskId: string, currentStatus: TaskStatus, state: TaskFormState, formData: FormData) => Promise<TaskFormState>;
  deleteTaskAction: (taskId: string) => Promise<void>;
  moveTaskAction: (taskId: string, status: TaskStatus, index: number) => Promise<void>;
};

type MoveNotice = {
  title: string;
  column: string;
};

const clickGuardMilliseconds = 300;

function ColumnDropZone({ status, label, children }: { status: TaskStatus; label: string; children: ReactNode }) {
  const { setNodeRef } = useDroppable({ id: status });

  return (
    <ul ref={setNodeRef} aria-label={label} className="flex min-h-24 flex-col gap-2.5 pr-5 last:pr-0">
      {children}
    </ul>
  );
}

function SortableTask({
  task,
  status,
  labels,
  shouldIgnoreClick,
  updateTaskAction,
  deleteTaskAction,
}: {
  task: BoardTask;
  status: TaskStatus;
  labels: TaskBoardLabels;
  shouldIgnoreClick: () => boolean;
  updateTaskAction: TaskBoardProps["updateTaskAction"];
  deleteTaskAction: TaskBoardProps["deleteTaskAction"];
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    attributes: { roleDescription: labels.drag.roleDescription },
  });
  const tone = statusToneClassNames[status];

  return (
    <li>
      <TaskCard
        title={task.title}
        description={task.description}
        columnTitle={labels.columns[status].title}
        noPullRequestLabel={labels.noPullRequest}
        detailTitle={labels.detailTitle}
        closeLabel={labels.close}
        formLabels={labels.editForm}
        deleteLabels={labels.deleteTask}
        updateAction={updateTaskAction.bind(null, task.id, status)}
        deleteAction={deleteTaskAction.bind(null, task.id)}
        statusField={{
          label: labels.statusLabel,
          hint: labels.statusHint,
          defaultValue: status,
          options: taskStatuses.map((value) => ({ value, label: labels.columns[value].title })),
        }}
        cardRef={setNodeRef}
        dragProps={{ ...attributes, ...listeners }}
        cardStyle={{ transform: CSS.Transform.toString(transform), transition }}
        placeholderClassName={isDragging ? `${tone.border} ${tone.softBackground}` : undefined}
        shouldIgnoreClick={shouldIgnoreClick}
      />
    </li>
  );
}

export function TaskBoard({
  tasks,
  labels,
  todoEmptyAction,
  updateTaskAction,
  deleteTaskAction,
  moveTaskAction,
}: TaskBoardProps) {
  const [serverTasks, setServerTasks] = useState(tasks);
  const [columns, setColumns] = useState<BoardColumns>(() => groupTaskIds(tasks));
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overStatus, setOverStatus] = useState<TaskStatus | null>(null);
  const [isKeyboardDrag, setIsKeyboardDrag] = useState(false);
  const [moveNotice, setMoveNotice] = useState<MoveNotice | null>(null);
  const [, startTransition] = useTransition();
  const dndContextId = useId();
  const columnsBeforeDrag = useRef<BoardColumns>(columns);
  const ignoreClicksUntil = useRef(0);

  if (tasks !== serverTasks) {
    setServerTasks(tasks);
    setColumns(groupTaskIds(tasks));
  }

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 6 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
      keyboardCodes: { start: ["Space"], cancel: ["Escape"], end: ["Space", "Enter"] },
    }),
  );

  const tasksById = new Map(tasks.map((task) => [task.id, task]));
  const titleOf = (id: string | number) => tasksById.get(String(id))?.title ?? "";
  const describeLocation = (template: string, id: string | number, currentColumns: BoardColumns) => {
    const location = locateTask(currentColumns, String(id));
    if (!location) return "";
    return formatMessage(template, {
      title: titleOf(id),
      column: labels.columns[location.status].title,
      position: location.index + 1,
      total: location.total,
    });
  };

  const projectMove = (activeTaskId: string | number, overId: string | number) => {
    const moved = moveToColumnOf(columns, String(activeTaskId), String(overId));
    return reorderInColumn(moved, String(activeTaskId), String(overId));
  };

  const announcements: Announcements = {
    onDragStart: ({ active }) => describeLocation(labels.drag.pickedUp, active.id, columns),
    onDragOver: ({ active, over }) =>
      over ? describeLocation(labels.drag.movedTo, active.id, projectMove(active.id, over.id)) : undefined,
    onDragEnd: ({ active, over }) =>
      over
        ? describeLocation(labels.drag.droppedIn, active.id, projectMove(active.id, over.id))
        : describeLocation(labels.drag.cancelled, active.id, columnsBeforeDrag.current),
    onDragCancel: ({ active }) => describeLocation(labels.drag.cancelled, active.id, columnsBeforeDrag.current),
  };

  const finishDrag = () => {
    ignoreClicksUntil.current = Date.now() + clickGuardMilliseconds;
    setActiveId(null);
    setOverStatus(null);
    setIsKeyboardDrag(false);
  };

  const handleDragStart = ({ active, activatorEvent }: DragStartEvent) => {
    columnsBeforeDrag.current = columns;
    setActiveId(String(active.id));
    setOverStatus(findColumnOf(columns, String(active.id)) ?? null);
    setIsKeyboardDrag(activatorEvent instanceof KeyboardEvent);
    setMoveNotice(null);
  };

  const handleDragOver = ({ active, over }: DragOverEvent) => {
    if (!over) return;
    setColumns((current) => moveToColumnOf(current, String(active.id), String(over.id)));
    setOverStatus(findColumnOf(columns, String(over.id)) ?? null);
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    finishDrag();
    const taskId = String(active.id);
    const previous = columnsBeforeDrag.current;

    if (!over) {
      setColumns(previous);
      return;
    }

    const next = reorderInColumn(columns, taskId, String(over.id));
    const before = locateTask(previous, taskId);
    const after = locateTask(next, taskId);
    setColumns(next);
    if (!before || !after || (before.status === after.status && before.index === after.index)) return;

    startTransition(async () => {
      try {
        await moveTaskAction(taskId, after.status, after.index);
      } catch {
        setColumns(previous);
        setMoveNotice({ title: titleOf(taskId), column: labels.columns[before.status].title });
      }
    });
  };

  const handleDragCancel = () => {
    finishDrag();
    setColumns(columnsBeforeDrag.current);
  };

  const shouldIgnoreClick = () => activeId !== null || Date.now() < ignoreClicksUntil.current;
  const activeTask = activeId ? tasksById.get(activeId) : undefined;
  const overlayTone = statusToneClassNames[overStatus ?? "TODO"];
  const totalTasks = taskStatuses.reduce((total, status) => total + columns[status].length, 0);

  const stationLabel = (status: TaskStatus) => {
    if (activeId && overStatus === status) {
      if (!isKeyboardDrag) return labels.drag.dropHere;
      const location = locateTask(columns, activeId);
      return location
        ? formatMessage(labels.drag.position, { position: location.index + 1, total: location.total })
        : labels.drag.dropHere;
    }
    const count = columns[status].length;
    return count > 0 ? formatCount(count, labels.taskCountOne, labels.taskCountMany) : labels.stationEmpty;
  };

  return (
    <DndContext
      id={dndContextId}
      sensors={sensors}
      collisionDetection={closestCorners}
      accessibility={{ announcements, screenReaderInstructions: { draggable: labels.drag.instructions } }}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <BoardMetroLine isEmpty={totalTasks === 0}>
        {taskStatuses.map((status) => (
          <BoardStation
            key={status}
            status={status}
            title={labels.columns[status].title}
            countLabel={stationLabel(status)}
            hasTasks={columns[status].length > 0}
            isDropTarget={activeId !== null && overStatus === status}
          />
        ))}
      </BoardMetroLine>
      {moveNotice && (
        <div className="px-6 pt-5">
          <div
            role="alert"
            className="flex items-center justify-between gap-4 rounded-md border border-warning-700 bg-warning-50 py-1 pr-1 pl-4 text-warning-700"
          >
            <p className="text-body-sm">{formatMessage(labels.drag.moveFailed, { ...moveNotice })}</p>
            <Button
              variant="ghost"
              onClick={() => setMoveNotice(null)}
              aria-label={labels.drag.closeNotice}
              className="size-11 px-0 text-warning-700 hover:bg-warning-50"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
                <path d="M4 4l8 8M12 4l-8 8" />
              </svg>
            </Button>
          </div>
        </div>
      )}
      <main className="grid grid-cols-4 items-start px-6 pt-5 pb-6">
        {taskStatuses.map((status) => {
          const column = labels.columns[status];
          const columnTaskIds = columns[status];

          return (
            <SortableContext key={status} id={status} items={columnTaskIds} strategy={verticalListSortingStrategy}>
              <ColumnDropZone status={status} label={column.title}>
                {columnTaskIds.length === 0 ? (
                  <li>
                    <ColumnEmptyState title={column.emptyTitle} text={column.emptyText}>
                      {status === "TODO" && todoEmptyAction}
                    </ColumnEmptyState>
                  </li>
                ) : (
                  columnTaskIds.map((taskId) => {
                    const task = tasksById.get(taskId);
                    if (!task) return null;
                    return (
                      <SortableTask
                        key={taskId}
                        task={task}
                        status={status}
                        labels={labels}
                        shouldIgnoreClick={shouldIgnoreClick}
                        updateTaskAction={updateTaskAction}
                        deleteTaskAction={deleteTaskAction}
                      />
                    );
                  })
                )}
              </ColumnDropZone>
            </SortableContext>
          );
        })}
      </main>
      <DragOverlay>
        {activeTask && (
          <div
            className={`flex w-full flex-col gap-2 rounded-md border-2 bg-neutral-0 p-3.5 shadow-lg ${overlayTone.border}`}
          >
            <TaskCardFace
              title={activeTask.title}
              description={activeTask.description}
              noPullRequestLabel={labels.noPullRequest}
            />
          </div>
        )}
      </DragOverlay>
      {isKeyboardDrag && activeId && (
        <div
          aria-hidden="true"
          className="fixed bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-4 rounded-md bg-neutral-900 px-4 py-2.5 font-mono text-data text-neutral-0"
        >
          <span>{labels.drag.shortcutsMove}</span>
          <span className="text-neutral-300">·</span>
          <span>{labels.drag.shortcutsDrop}</span>
          <span className="text-neutral-300">·</span>
          <span>{labels.drag.shortcutsCancel}</span>
        </div>
      )}
    </DndContext>
  );
}
