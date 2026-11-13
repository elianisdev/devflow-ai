import type { HTMLAttributes } from "react";

type CardProps = HTMLAttributes<HTMLDivElement>;

export function Card({ className = "", ...props }: CardProps) {
  return (
    <div
      className={`rounded-md border border-neutral-200 bg-neutral-0 p-3 ${className}`}
      {...props}
    />
  );
}
