"use client";

import { useActionState, useId, useState, useTransition } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/atoms/Button";
import { FieldMessage } from "@/components/atoms/FieldMessage";
import { PrStateLabel } from "@/components/atoms/PrStateLabel";
import { prStateToneClassNames } from "@/components/atoms/prStateTones";
import { TextField } from "@/components/atoms/TextField";
import type { LinkPullRequestErrorCode } from "@/application/pull-request/link-pull-request";
import { formatMessage } from "@/lib/format-message";
import { formatRelativeTime } from "@/lib/format-relative-time";
import type { PrState, PullRequestFormAction } from "@/types/pull-request";

export type SectionPullRequest = {
  owner: string;
  repo: string;
  number: number;
  url: string;
  title: string;
  state: PrState;
  syncedAt: Date;
};

export type PullRequestSectionLabels = {
  heading: string;
  url: string;
  urlPlaceholder: string;
  urlHint: string;
  link: string;
  linking: string;
  unlink: string;
  unlinking: string;
  unlinkFailed: string;
  opensInNewTab: string;
  syncedAt: string;
  errors: Record<LinkPullRequestErrorCode, string>;
  prStates: Record<PrState, string>;
};

type PullRequestSectionProps = {
  pullRequest: SectionPullRequest | null;
  labels: PullRequestSectionLabels;
  locale: string;
  linkAction: PullRequestFormAction;
  unlinkAction: () => Promise<void>;
};

function LinkPullRequestForm({ labels, linkAction }: Pick<PullRequestSectionProps, "labels" | "linkAction">) {
  const [state, formAction, isPending] = useActionState(linkAction, {});
  const [url, setUrl] = useState("");
  const urlId = useId();
  const formId = useId();

  return (
    <div className="flex flex-col gap-3">
      {createPortal(<form id={formId} action={formAction} noValidate />, document.body)}
      <TextField
        id={urlId}
        form={formId}
        name="url"
        value={url}
        onChange={(event) => setUrl(event.target.value)}
        type="url"
        inputMode="url"
        autoComplete="off"
        label={labels.url}
        placeholder={labels.urlPlaceholder}
        hint={labels.urlHint}
        error={state.error && labels.errors[state.error]}
      />
      <Button
        type="submit"
        form={formId}
        variant="secondary"
        disabled={isPending}
        aria-busy={isPending}
        className="self-end"
      >
        {isPending ? labels.linking : labels.link}
      </Button>
    </div>
  );
}

function LinkedPullRequest({
  pullRequest,
  labels,
  locale,
  unlinkAction,
}: Omit<PullRequestSectionProps, "linkAction" | "pullRequest"> & { pullRequest: SectionPullRequest }) {
  const [openedAt] = useState(() => Date.now());
  const [isPending, startTransition] = useTransition();
  const [hasFailed, setHasFailed] = useState(false);
  const errorId = useId();

  const unlink = () => {
    setHasFailed(false);
    startTransition(async () => {
      try {
        await unlinkAction();
      } catch {
        setHasFailed(true);
      }
    });
  };

  return (
    <>
      <div
        className={`flex flex-col gap-1.5 rounded-md border border-l-4 border-neutral-200 bg-neutral-0 px-3.5 py-3 ${prStateToneClassNames[pullRequest.state].border}`}
      >
        <PrStateLabel state={pullRequest.state} label={labels.prStates[pullRequest.state]} />
        <a
          href={pullRequest.url}
          target="_blank"
          rel="noreferrer"
          className="text-body-sm font-semibold text-neutral-900 underline underline-offset-3 hover:text-cyan-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-700"
        >
          {pullRequest.title}
          <span className="sr-only"> {labels.opensInNewTab}</span>
        </a>
        <span className="font-mono text-data text-neutral-600">
          {pullRequest.owner}/{pullRequest.repo} #{pullRequest.number}
        </span>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-mono text-data text-neutral-600">
          {formatMessage(labels.syncedAt, { time: formatRelativeTime(pullRequest.syncedAt, openedAt, locale) })}
        </span>
        <Button
          variant="secondary"
          onClick={unlink}
          disabled={isPending}
          aria-busy={isPending}
          aria-describedby={hasFailed ? errorId : undefined}
        >
          {isPending ? labels.unlinking : labels.unlink}
        </Button>
      </div>
      {hasFailed && <FieldMessage id={errorId} error={labels.unlinkFailed} />}
    </>
  );
}

export function PullRequestSection({ pullRequest, labels, locale, linkAction, unlinkAction }: PullRequestSectionProps) {
  const headingId = useId();

  return (
    <section aria-labelledby={headingId} className="flex flex-col gap-3 rounded-md bg-neutral-50 p-4">
      <h3 id={headingId} className="text-body-sm font-semibold">
        {labels.heading}
      </h3>
      {pullRequest ? (
        <LinkedPullRequest pullRequest={pullRequest} labels={labels} locale={locale} unlinkAction={unlinkAction} />
      ) : (
        <LinkPullRequestForm labels={labels} linkAction={linkAction} />
      )}
    </section>
  );
}
