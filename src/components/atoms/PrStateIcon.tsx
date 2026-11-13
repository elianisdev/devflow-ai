import type { ReactNode } from "react";
import type { PrState } from "@/types/pull-request";

type PrStateIconProps = {
  state: PrState;
};

const iconPaths: Record<PrState, ReactNode> = {
  draft: <circle cx="8" cy="8" r="5.5" strokeDasharray="2.4 2.2" />,
  open: (
    <>
      <circle cx="8" cy="8" r="5.5" />
      <circle cx="8" cy="8" r="1.8" fill="currentColor" stroke="none" />
    </>
  ),
  merged: (
    <>
      <circle cx="4.5" cy="3.5" r="1.6" />
      <circle cx="4.5" cy="12.5" r="1.6" />
      <circle cx="11.5" cy="8" r="1.6" />
      <path d="M4.5 5.1v5.8M4.5 5.5c0 2.5 2.5 2.5 5.4 2.5" />
    </>
  ),
  closed: (
    <>
      <circle cx="8" cy="8" r="5.5" />
      <path d="M6 6l4 4M10 6l-4 4" />
    </>
  ),
};

export function PrStateIcon({ state }: PrStateIconProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      aria-hidden="true"
      className="size-3.5 shrink-0"
    >
      {iconPaths[state]}
    </svg>
  );
}
