import type { ReactNode } from "react";

export function BoardViewport({ children }: { children: ReactNode }) {
  return (
    <div className="-mt-[13px] flex-1 overflow-x-auto">
      <div className="min-w-[880px]">{children}</div>
    </div>
  );
}
