import { Suspense } from "react";
import Link from "next/link";
import { getButtonClassName } from "@/components/atoms/Button";
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
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <SignInButton
            label={auth.signIn}
            pendingLabel={auth.signingIn}
            callbackURL={`/${locale}/board`}
            errorCallbackURL={`/${locale}`}
          />
          <Link href={`/${locale}/demo`} className={getButtonClassName("secondary")}>
            {home.viewDemo}
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 8h9M8.5 4.5L12 8l-3.5 3.5" />
            </svg>
          </Link>
        </div>
        <p className="text-caption text-neutral-600">{home.demoHint}</p>
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
