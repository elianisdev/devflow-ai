import type { PrState } from "@/types/pull-request";

export const prStateToneClassNames: Record<PrState, { text: string; border: string }> = {
  draft: { text: "text-neutral-600", border: "border-l-neutral-500" },
  open: { text: "text-open-700", border: "border-l-open-700" },
  merged: { text: "text-merged-700", border: "border-l-merged-700" },
  closed: { text: "text-closed-700", border: "border-l-closed-700" },
};
