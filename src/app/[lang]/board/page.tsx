import { Suspense } from "react";
import { redirect } from "next/navigation";
import { CreateTaskButton } from "@/components/molecules/CreateTaskButton";
import { UserMenu } from "@/components/molecules/UserMenu";
import { BoardSummaryBand } from "@/components/organisms/BoardSummaryBand";
import { BoardViewport } from "@/components/organisms/BoardViewport";
import { TaskBoard } from "@/components/organisms/TaskBoard";
import { getDictionary, getLocale } from "@/content/get-dictionary";
import { boardUseCases } from "@/infrastructure/board-use-cases";
import { pullRequestUseCases } from "@/infrastructure/pull-request-use-cases";
import { formatMessage } from "@/lib/format-message";
import { getCurrentSession } from "@/lib/session";
import { buildTaskBoardLabels, summarizeBoard } from "@/lib/task-board-labels";
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
  const { board, auth } = dictionary;
  const owner = { id: user.id, login: user.login };
  await pullRequestUseCases.refreshPullRequests(owner);
  const { tasks } = await boardUseCases.getBoard(owner);

  const { boardLabels, createTaskTexts, summaryLabels } = buildTaskBoardLabels(dictionary);
  const createTaskProps = { action: createTaskAction, ...createTaskTexts };

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
      <BoardSummaryBand
        label={board.summaryLabel}
        summary={summarizeBoard(user.login, tasks, summaryLabels)}
        title={formatMessage(board.title, { name: user.name.split(" ")[0] })}
        action={<CreateTaskButton triggerLabel={board.newTask} {...createTaskProps} />}
      />
      <BoardViewport>
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
          labels={boardLabels}
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
      </BoardViewport>
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
