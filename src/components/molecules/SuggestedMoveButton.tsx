import { statusToneClassNames } from "@/components/atoms/statusTones";
import type { TaskStatus } from "@/domain/board/task";

type SuggestedMoveButtonProps = {
  status: TaskStatus;
  label: string;
  accessibleLabel: string;
  onMove: () => void;
};

export function SuggestedMoveButton({ status, label, accessibleLabel, onMove }: SuggestedMoveButtonProps) {
  const tone = statusToneClassNames[status];

  return (
    <button
      type="button"
      onClick={onMove}
      aria-label={accessibleLabel}
      className={`-ml-2 mt-1 inline-flex min-h-8 items-center gap-1.5 self-start rounded-sm px-2 font-mono text-data font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-700 motion-reduce:transition-none ${tone.text} ${tone.hoverBackground}`}
    >
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 8h9M8.5 4.5L12 8l-3.5 3.5" />
      </svg>
      {label}
    </button>
  );
}
