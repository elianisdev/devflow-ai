import type { TaskFormLabels } from "@/components/molecules/TaskForm";
import type { TaskBoardLabels } from "@/components/organisms/TaskBoard";
import type { TaskStatus } from "@/domain/board/task";
import { formatCount, formatMessage } from "@/lib/format-message";
import type { Dictionary } from "@/types/dictionary";

export const buildTaskBoardLabels = ({ board, taskForm, deleteTask, pullRequest, prStates }: Dictionary) => {
  const formLabels = {
    title: taskForm.title,
    description: taskForm.description,
    descriptionPlaceholder: taskForm.descriptionPlaceholder,
    cancel: taskForm.cancel,
    errors: taskForm.errors,
  };
  const createFormLabels: TaskFormLabels = { ...formLabels, submit: taskForm.create, pending: taskForm.creating };
  const editFormLabels: TaskFormLabels = { ...formLabels, submit: taskForm.save, pending: taskForm.saving };

  const boardLabels: TaskBoardLabels = {
    columns: board.columns,
    stationEmpty: board.stationEmpty,
    taskCountOne: board.taskCountOne,
    taskCountMany: board.taskCountMany,
    card: { noPullRequest: board.noPullRequest, prStates },
    pullRequest: { ...pullRequest, prStates },
    suggestion: board.suggestion,
    detailTitle: taskForm.detailTitle,
    close: taskForm.close,
    statusLabel: taskForm.status,
    statusHint: taskForm.statusHint,
    editForm: editFormLabels,
    deleteTask,
    drag: board.drag,
  };

  return {
    boardLabels,
    createTaskTexts: {
      dialogTitle: taskForm.createTitle,
      dialogDescription: taskForm.createDescription,
      formLabels: createFormLabels,
    },
    summaryLabels: {
      path: board.path,
      taskCountOne: board.taskCountOne,
      taskCountMany: board.taskCountMany,
      doneCount: board.doneCount,
    },
  };
};

export type BoardSummaryLabels = ReturnType<typeof buildTaskBoardLabels>["summaryLabels"];

export const summarizeBoard = (ownerLogin: string, tasks: { status: TaskStatus }[], labels: BoardSummaryLabels) => {
  const doneCount = tasks.filter((task) => task.status === "DONE").length;
  return [
    [ownerLogin, labels.path].join(" / "),
    formatCount(tasks.length, labels.taskCountOne, labels.taskCountMany),
    ...(tasks.length > 0 ? [formatMessage(labels.doneCount, { count: doneCount })] : []),
  ].join(" · ");
};
