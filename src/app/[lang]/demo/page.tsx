import Link from "next/link";
import { SignInButton } from "@/components/molecules/SignInButton";
import { DemoBoard } from "@/components/organisms/DemoBoard";
import { getDemoTasks } from "@/content/get-demo-tasks";
import { getDictionary, getLocale } from "@/content/get-dictionary";
import { buildTaskBoardLabels } from "@/lib/task-board-labels";

export default async function DemoPage() {
  const locale = await getLocale();
  const [dictionary, demoTasks] = await Promise.all([getDictionary(), getDemoTasks(locale)]);
  const { demo, board, auth, metadata } = dictionary;
  const { boardLabels, createTaskTexts, summaryLabels } = buildTaskBoardLabels(dictionary);
  const signInProps = {
    label: demo.useGitHub,
    pendingLabel: auth.signingIn,
    callbackURL: `/${locale}/board`,
    errorCallbackURL: `/${locale}`,
  };

  return (
    <>
      <header className="flex items-center justify-between gap-4 border-b border-neutral-200 bg-neutral-0 px-6 py-3">
        <Link href={`/${locale}`} aria-label={demo.homeLabel} className="text-heading-sm text-neutral-900">
          {metadata.title}
        </Link>
        <SignInButton {...signInProps} />
      </header>
      <p className="flex items-center gap-3 bg-neutral-900 px-6 py-2.5 font-mono text-data text-neutral-0">
        <span className="rounded-sm border border-cyan-200 px-2 py-0.5 font-medium text-cyan-200 uppercase">
          {demo.badge}
        </span>
        <span>{demo.note}</span>
      </p>
      <DemoBoard
        demoTasks={demoTasks}
        locale={locale}
        ownerLogin={demo.owner}
        title={demo.title}
        summaryLabel={board.summaryLabel}
        newTaskLabel={board.newTask}
        createFirstLabel={board.createFirst}
        boardLabels={boardLabels}
        summaryLabels={summaryLabels}
        createTaskTexts={createTaskTexts}
        pullRequestLinkNotice={
          <div className="flex flex-col items-start gap-2">
            <p className="text-body-sm text-neutral-700">{demo.linkNotice}</p>
            <SignInButton {...signInProps} variant="secondary" />
          </div>
        }
      />
    </>
  );
}
