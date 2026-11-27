import type { ReactNode } from "react";

type BoardSummaryBandProps = {
  label: string;
  summary: string;
  title: string;
  action: ReactNode;
};

export function BoardSummaryBand({ label, summary, title, action }: BoardSummaryBandProps) {
  return (
    <section
      aria-label={label}
      className="flex flex-wrap items-end justify-between gap-4 bg-cyan-100 px-6 pt-6 pb-9 text-cyan-900"
    >
      <div className="flex flex-col gap-2">
        <p className="font-mono text-data">{summary}</p>
        <h1 className="text-heading-xl">{title}</h1>
      </div>
      {action}
    </section>
  );
}
