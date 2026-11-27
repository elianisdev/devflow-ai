import type { PrState } from "@/types/pull-request";
import { PrStateIcon } from "./PrStateIcon";
import { prStateToneClassNames } from "./prStateTones";

type PrStateLabelProps = {
  state: PrState;
  label: string;
};

export function PrStateLabel({ state, label }: PrStateLabelProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 font-mono text-data font-medium ${prStateToneClassNames[state].text}`}
    >
      <PrStateIcon state={state} />
      {label}
    </span>
  );
}
