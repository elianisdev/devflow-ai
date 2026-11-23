import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { UserMenu } from "@/components/molecules/UserMenu";
import { getDictionary, getLocale } from "@/content/get-dictionary";
import { auth } from "@/lib/auth";

async function BoardContent() {
  const [locale, dictionary, session] = await Promise.all([
    getLocale(),
    getDictionary(),
    auth.api.getSession({ headers: await headers() }),
  ]);

  if (!session) redirect(`/${locale}`);

  const { user } = session;

  return (
    <>
      <header className="flex items-center justify-between gap-4 border-b border-neutral-200 bg-neutral-0 px-4 py-3">
        <span className="text-heading-sm">{dictionary.metadata.title}</span>
        <UserMenu
          name={user.name}
          login={user.login}
          avatarUrl={user.image}
          label={dictionary.board.userMenuLabel}
          signOutLabel={dictionary.auth.signOut}
          homePath={`/${locale}`}
        />
      </header>
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-4 px-4 py-8">
        <h1 className="text-heading-lg">{dictionary.board.title}</h1>
        <p className="text-neutral-600">{dictionary.board.comingSoon}</p>
      </main>
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
