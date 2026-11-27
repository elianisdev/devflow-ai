import type { ReactNode } from "react";

type BoardMetroLineProps = {
  isEmpty: boolean;
  children: ReactNode;
};

const segmentClassNames = [
  "left-6 bg-neutral-700",
  "left-[calc(1.5rem+(100%-3rem)/4)] bg-blue-700",
  "left-[calc(1.5rem+(100%-3rem)/2)] bg-warning-700",
];

export function BoardMetroLine({ isEmpty, children }: BoardMetroLineProps) {
  return (
    <div className="relative grid grid-cols-4 px-6">
      {isEmpty ? (
        <span
          aria-hidden="true"
          className="absolute top-3 left-6 w-[calc((100%-3rem)*0.75)] border-t-[3px] border-dashed border-neutral-500"
        />
      ) : (
        segmentClassNames.map((className) => (
          <span
            key={className}
            aria-hidden="true"
            className={`absolute top-[11px] h-1 w-[calc((100%-3rem)/4)] ${className}`}
          />
        ))
      )}
      {children}
    </div>
  );
}
