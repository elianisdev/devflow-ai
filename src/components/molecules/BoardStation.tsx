import type { TaskStatus } from "@/domain/board/task";

type BoardStationProps = {
  status: TaskStatus;
  title: string;
  countLabel: string;
  hasTasks: boolean;
};

const stationToneClassNames: Record<TaskStatus, { border: string; text: string }> = {
  TODO: { border: "border-neutral-600", text: "text-neutral-700" },
  IN_PROGRESS: { border: "border-cyan-700", text: "text-cyan-700" },
  IN_REVIEW: { border: "border-open-700", text: "text-open-700" },
  DONE: { border: "border-merged-700", text: "text-merged-700" },
};

export function BoardStation({ status, title, countLabel, hasTasks }: BoardStationProps) {
  const tone = stationToneClassNames[status];
  const markerClassName = hasTasks ? "border-[6px] bg-neutral-0" : "border-[3px] border-dashed bg-neutral-50";

  return (
    <div className="relative flex flex-col gap-2.5 pr-5">
      <span aria-hidden="true" className={`size-[26px] rounded-full ${markerClassName} ${tone.border}`} />
      <h2 className="text-heading-lg">{title}</h2>
      <span className={`font-mono text-data ${tone.text}`}>{countLabel}</span>
    </div>
  );
}
