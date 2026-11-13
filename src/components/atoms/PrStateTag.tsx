import type { PrState } from "@/types/pull-request";
import { PrStateIcon } from "./PrStateIcon";

type PrStateTagProps = {
  state: PrState;
};

const stateLabels: Record<PrState, string> = {
  draft: "Draft",
  open: "Open",
  merged: "Merged",
  closed: "Closed",
};

const stateClassNames: Record<PrState, string> = {
  draft: "bg-neutral-100 text-neutral-700",
  open: "bg-open-50 text-open-700",
  merged: "bg-merged-50 text-merged-700",
  closed: "bg-closed-50 text-closed-700",
};

export function PrStateTag({ state }: PrStateTagProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-sm py-0.5 pr-2 pl-1.5 text-caption font-semibold ${stateClassNames[state]}`}
    >
      <PrStateIcon state={state} />
      {stateLabels[state]}
    </span>
  );
}
