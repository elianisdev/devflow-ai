import type { ReactNode } from "react";

type ColumnEmptyStateProps = {
  title: string;
  text: string;
  children?: ReactNode;
};

export function ColumnEmptyState({ title, text, children }: ColumnEmptyStateProps) {
  return (
    <div className="flex flex-col items-start gap-2 pt-1.5">
      <p className="text-body-sm font-semibold">{title}</p>
      <p className="text-caption text-neutral-600">{text}</p>
      {children}
    </div>
  );
}
