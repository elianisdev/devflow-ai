import { statusToneClassNames } from "@/components/atoms/statusTones";
import type { TaskStatus } from "@/domain/board/task";

type BoardStationProps = {
  status: TaskStatus;
  title: string;
  countLabel: string;
  hasTasks: boolean;
  isDropTarget?: boolean;
};

export function BoardStation({ status, title, countLabel, hasTasks, isDropTarget = false }: BoardStationProps) {
  const tone = statusToneClassNames[status];
  const markerClassName = isDropTarget
    ? `border-[6px] outline-[6px] outline-solid ${tone.softBackground} ${tone.outline}`
    : hasTasks
      ? "border-[6px] bg-neutral-0"
      : "border-[3px] border-dashed bg-neutral-50";

  return (
    <div className="relative flex flex-col gap-2.5 pr-5">
      <span aria-hidden="true" className={`size-[26px] rounded-full ${markerClassName} ${tone.border}`} />
      <h2 className={`text-heading-lg ${isDropTarget ? tone.text : ""}`}>{title}</h2>
      <span className={`font-mono text-data ${tone.text}`}>{countLabel}</span>
    </div>
  );
}
