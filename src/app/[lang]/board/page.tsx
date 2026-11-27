import { Suspense } from "react";
import { redirect } from "next/navigation";
import { BoardStation } from "@/components/molecules/BoardStation";
import { ColumnEmptyState } from "@/components/molecules/ColumnEmptyState";
import { CreateTaskButton } from "@/components/molecules/CreateTaskButton";
import { TaskCard } from "@/components/molecules/TaskCard";
import type { TaskFormLabels } from "@/components/molecules/TaskForm";
import { UserMenu } from "@/components/molecules/UserMenu";
import { BoardMetroLine } from "@/components/organisms/BoardMetroLine";
import { getDictionary, getLocale } from "@/content/get-dictionary";
import { taskStatuses } from "@/domain/board/task";
import { boardUseCases } from "@/infrastructure/board-use-cases";
import { getCurrentSession } from "@/lib/session";
import { createTaskAction, deleteTaskAction, updateTaskAction } from "./actions";

async function BoardContent() {
  const [locale, dictionary, session] = await Promise.all([getLocale(), getDictionary(), getCurrentSession()]);

  if (!session) redirect(`/${locale}`);

  const { user } = session;
  const { board, taskForm, deleteTask, auth } = dictionary;
  const { tasks } = await boardUseCases.getBoard({ id: user.id, login: user.login });

  const tasksByStatus = Object.fromEntries(
    taskStatuses.map((status) => [status, tasks.filter((task) => task.status === status)]),
  ) as Record<(typeof taskStatuses)[number], typeof tasks>;
  const doneCount = tasksByStatus.DONE.length;
  const summary = [user.login, board.path].join(" / ");
  const counts = tasks.length > 0 ? [board.taskCount(tasks.length), board.doneCount(doneCount)] : [board.taskCount(0)];

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
          <p className="font-mono text-data">{[summary, ...counts].join(" · ")}</p>
          <h1 className="text-heading-xl">{board.title.replace("{name}", user.name.split(" ")[0])}</h1>
        </div>
        <CreateTaskButton triggerLabel={board.newTask} {...createTaskProps} />
      </section>
      <div className="-mt-[13px] flex-1 overflow-x-auto">
        <div className="min-w-[880px]">
          <BoardMetroLine isEmpty={tasks.length === 0}>
            {taskStatuses.map((status) => (
              <BoardStation
                key={status}
                status={status}
                title={board.columns[status].title}
                countLabel={
                  tasksByStatus[status].length > 0 ? board.taskCount(tasksByStatus[status].length) : board.stationEmpty
                }
                hasTasks={tasksByStatus[status].length > 0}
              />
            ))}
          </BoardMetroLine>
          <main className="grid grid-cols-4 items-start px-6 pt-5 pb-6">
            {taskStatuses.map((status) => {
              const column = board.columns[status];
              const columnTasks = tasksByStatus[status];

              return (
                <ul key={status} aria-label={column.title} className="flex flex-col gap-2.5 pr-5 last:pr-0">
                  {columnTasks.length === 0 ? (
                    <li>
                      <ColumnEmptyState title={column.emptyTitle} text={column.emptyText}>
                        {status === "TODO" && (
                          <CreateTaskButton
                            triggerLabel={board.createFirst}
                            triggerVariant="ghost"
                            triggerClassName="-ml-3.5"
                            {...createTaskProps}
                          />
                        )}
                      </ColumnEmptyState>
                    </li>
                  ) : (
                    columnTasks.map((task) => (
                      <li key={task.id}>
                        <TaskCard
                          title={task.title}
                          description={task.description}
                          columnTitle={column.title}
                          noPullRequestLabel={board.noPullRequest}
                          detailTitle={taskForm.detailTitle}
                          closeLabel={taskForm.close}
                          formLabels={editFormLabels}
                          deleteLabels={deleteTask}
                          updateAction={updateTaskAction.bind(null, task.id)}
                          deleteAction={deleteTaskAction.bind(null, task.id)}
                        />
                      </li>
                    ))
                  )}
                </ul>
              );
            })}
          </main>
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
