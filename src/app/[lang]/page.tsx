import { Suspense } from "react";
import { Card } from "@/components/atoms/Card";
import { PrStateTag } from "@/components/atoms/PrStateTag";
import { SignInButton } from "@/components/molecules/SignInButton";
import { SignInMessage } from "@/components/molecules/SignInMessage";
import { getDictionary, getLocale } from "@/content/get-dictionary";
import type { PrState } from "@/types/pull-request";

const previewStates: PrState[] = ["draft", "open", "merged", "closed"];

export default async function Home() {
  const [locale, { home, auth, prStates }] = await Promise.all([getLocale(), getDictionary()]);

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center gap-6 px-4 py-16">
      <p className="font-mono text-data text-cyan-700">{home.status}</p>
      <h1 className="text-heading-xl text-balance">{home.title}</h1>
      <p className="text-neutral-600">{home.description}</p>
      <Suspense>
        <SignInMessage cancelledMessage={auth.signInCancelled} failedMessage={auth.signInFailed} />
      </Suspense>
      <div>
        <SignInButton
          label={auth.signIn}
          pendingLabel={auth.signingIn}
          callbackURL={`/${locale}/board`}
          errorCallbackURL={`/${locale}`}
        />
      </div>
      <Card className="flex flex-col gap-3">
        <span className="font-mono text-data text-neutral-600">{home.prStatesTitle}</span>
        <ul className="flex flex-wrap gap-2">
          {previewStates.map((state) => (
            <li key={state}>
              <PrStateTag state={state} label={prStates[state]} />
            </li>
          ))}
        </ul>
      </Card>
    </main>
  );
}
