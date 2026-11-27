import { PrStateLabel } from "@/components/atoms/PrStateLabel";
import type { PrState } from "@/types/pull-request";

export type CardPullRequest = {
  repo: string;
  number: number;
  state: PrState;
};

export type TaskCardFaceLabels = {
  noPullRequest: string;
  prStates: Record<PrState, string>;
};

type TaskCardFaceProps = {
  title: string;
  description: string | null;
  pullRequest: CardPullRequest | null;
  labels: TaskCardFaceLabels;
};

export function TaskCardFace({ title, description, pullRequest, labels }: TaskCardFaceProps) {
  return (
    <>
      <span className="text-body-sm font-semibold">{title}</span>
      {description && <span className="line-clamp-2 text-caption text-neutral-600">{description}</span>}
      <span className="mt-0.5 flex flex-wrap items-center gap-x-1.5 border-t border-neutral-100 pt-2 font-mono text-data text-neutral-600">
        {pullRequest ? (
          <>
            <PrStateLabel state={pullRequest.state} label={labels.prStates[pullRequest.state]} />
            <span aria-hidden="true">·</span>
            <span>
              {pullRequest.repo} #{pullRequest.number}
            </span>
          </>
        ) : (
          labels.noPullRequest
        )}
      </span>
    </>
  );
}
