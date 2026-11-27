import { Suspense } from "react";
import { redirect } from "next/navigation";
import { CreateTaskButton } from "@/components/molecules/CreateTaskButton";
import type { TaskFormLabels } from "@/components/molecules/TaskForm";
import { UserMenu } from "@/components/molecules/UserMenu";
import { TaskBoard } from "@/components/organisms/TaskBoard";
import { getDictionary, getLocale } from "@/content/get-dictionary";
import { boardUseCases } from "@/infrastructure/board-use-cases";
import { pullRequestUseCases } from "@/infrastructure/pull-request-use-cases";
import { formatCount, formatMessage } from "@/lib/format-message";
import { getCurrentSession } from "@/lib/session";
import {
  createTaskAction,
  deleteTaskAction,
  linkPullRequestAction,
  moveTaskAction,
  unlinkPullRequestAction,
  updateTaskAction,
} from "./actions";

async function BoardContent() {
  const [locale, dictionary, session] = await Promise.all([getLocale(), getDictionary(), getCurrentSession()]);

  if (!session) redirect(`/${locale}`);

  const { user } = session;
  const { board, taskForm, deleteTask, auth, pullRequest, prStates } = dictionary;
  const owner = { id: user.id, login: user.login };
  await pullRequestUseCases.refreshPullRequests(owner);
  const { tasks } = await boardUseCases.getBoard(owner);

  const doneCount = tasks.filter((task) => task.status === "DONE").length;
  const summary = [
    [user.login, board.path].join(" / "),
    formatCount(tasks.length, board.taskCountOne, board.taskCountMany),
    ...(tasks.length > 0 ? [formatMessage(board.doneCount, { count: doneCount })] : []),
  ].join(" · ");

  const formLabels = {
    title: taskForm.title,
    description: taskForm.description,
    descriptionPlaceholder: taskForm.descriptionPlaceholder,
    cancel: taskForm.cancel,
    errors: taskForm.errors,
  };
  const createFormLabels: TaskFormLabels = { ...formLabels, submit: taskForm.create, pending: taskForm.creating };
  const editFormLabels: TaskFormLabels = { ...formLabels, submit: taskForm.save, pending: taskForm.saving };
  const createTaskProps = {
    action: createTaskAction,
    dialogTitle: taskForm.createTitle,
    dialogDescription: taskForm.createDescription,
    formLabels: createFormLabels,
  };

  return (
    <>
      <header className="flex items-center justify-between gap-4 border-b border-neutral-200 bg-neutral-0 px-6 py-3">
        <span className="text-heading-sm">{dictionary.metadata.title}</span>
        <UserMenu
          name={user.name}
          login={user.login}
          avatarUrl={user.image}
          label={board.userMenuLabel}
          signOutLabel={auth.signOut}
          homePath={`/${locale}`}
        />
      </header>
      <section
        aria-label={board.summaryLabel}
        className="flex flex-wrap items-end justify-between gap-4 bg-cyan-100 px-6 pt-6 pb-9 text-cyan-900"
      >
        <div className="flex flex-col gap-2">
          <p className="font-mono text-data">{summary}</p>
          <h1 className="text-heading-xl">{board.title.replace("{name}", user.name.split(" ")[0])}</h1>
        </div>
        <CreateTaskButton triggerLabel={board.newTask} {...createTaskProps} />
      </section>
      <div className="-mt-[13px] flex-1 overflow-x-auto">
        <div className="min-w-[880px]">
          <TaskBoard
            tasks={tasks.map(({ id, title, description, status, position, pullRequest }) => ({
              id,
              title,
              description,
              status,
              position,
              pullRequest,
            }))}
            locale={locale}
            labels={{
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
            }}
            todoEmptyAction={
              <CreateTaskButton
                key="todo-empty-action"
                triggerLabel={board.createFirst}
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
        </div>
      </div>
    </>
  );
}

export default function BoardPage() {
  return (
    <Suspense>
      <BoardContent />
    </Suspense>
  );
}
