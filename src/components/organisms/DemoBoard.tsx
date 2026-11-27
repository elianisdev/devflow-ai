"use client";

import { useState, type ReactNode } from "react";
import { CreateTaskButton } from "@/components/molecules/CreateTaskButton";
import type { TaskFormLabels } from "@/components/molecules/TaskForm";
import { BoardSummaryBand } from "@/components/organisms/BoardSummaryBand";
import { BoardViewport } from "@/components/organisms/BoardViewport";
import { TaskBoard, type TaskBoardLabels } from "@/components/organisms/TaskBoard";
import type { DemoTask } from "@/content/demo/demo-task";
import type { TaskStatus } from "@/domain/board/task";
import { createDemoUseCases } from "@/infrastructure/demo-use-cases";
import { summarizeBoard, type BoardSummaryLabels } from "@/lib/task-board-labels";
import { readChangedStatus, readTaskInput } from "@/lib/task-form-data";
import type { PullRequestFormState } from "@/types/pull-request";
import type { TaskFormState } from "@/types/task-form";

type DemoBoardProps = {
  demoTasks: DemoTask[];
  locale: string;
  ownerLogin: string;
  title: string;
  summaryLabel: string;
  newTaskLabel: string;
  createFirstLabel: string;
  boardLabels: TaskBoardLabels;
  summaryLabels: BoardSummaryLabels;
  createTaskTexts: { dialogTitle: string; dialogDescription: string; formLabels: TaskFormLabels };
  pullRequestLinkNotice: ReactNode;
};

export function DemoBoard({
  demoTasks,
  locale,
  ownerLogin,
  title,
  summaryLabel,
  newTaskLabel,
  createFirstLabel,
  boardLabels,
  summaryLabels,
  createTaskTexts,
  pullRequestLinkNotice,
}: DemoBoardProps) {
  const [demo] = useState(() => createDemoUseCases(demoTasks));
  const [tasks, setTasks] = useState(demo.initialTasks);

  const refresh = async () => setTasks(await demo.listTasks());

  const createTaskAction = async (_state: TaskFormState, formData: FormData): Promise<TaskFormState> => {
    const result = await demo.createTask(readTaskInput(formData));
    if (!result.success) return { errors: result.errors };
    await refresh();
    return { success: true };
  };

  const updateTaskAction = async (
    taskId: string,
    currentStatus: TaskStatus,
    _state: TaskFormState,
    formData: FormData,
  ): Promise<TaskFormState> => {
    const result = await demo.updateTask(taskId, readTaskInput(formData));
    if (!result.success) return { errors: result.errors };
    const status = readChangedStatus(formData, currentStatus);
    if (status) await demo.moveTask(taskId, status);
    await refresh();
    return { success: true };
  };

  const deleteTaskAction = async (taskId: string) => {
    await demo.deleteTask(taskId);
    await refresh();
  };

  const moveTaskAction = async (taskId: string, status: TaskStatus, index: number) => {
    await demo.moveTask(taskId, status, index);
    await refresh();
  };

  const linkPullRequestAction = async (): Promise<PullRequestFormState> => ({ error: "unavailable" });

  const unlinkPullRequestAction = async (taskId: string) => {
    await demo.unlinkPullRequest(taskId);
    await refresh();
  };

  const createTaskProps = { action: createTaskAction, ...createTaskTexts };

  return (
    <>
      <BoardSummaryBand
        label={summaryLabel}
        summary={summarizeBoard(ownerLogin, tasks, summaryLabels)}
        title={title}
        action={<CreateTaskButton triggerLabel={newTaskLabel} {...createTaskProps} />}
      />
      <BoardViewport>
        <TaskBoard
          tasks={tasks}
          locale={locale}
          labels={boardLabels}
          pullRequestLinkNotice={pullRequestLinkNotice}
          todoEmptyAction={
            <CreateTaskButton
              triggerLabel={createFirstLabel}
              triggerVariant="ghost"
              triggerClassName="-ml-3.5"
              {...createTaskProps}
            />
          }
          updateTaskAction={updateTaskAction}
          deleteTaskAction={deleteTaskAction}
          moveTaskAction={moveTaskAction}
          linkPullRequestAction={linkPullRequestAction}
          unlinkPullRequestAction={unlinkPullRequestAction}
        />
      </BoardViewport>
    </>
  );
}
