"use client";

import { useEffect, useRef, type ReactNode } from "react";

type DialogProps = {
  open: boolean;
  onClose: () => void;
  labelledBy: string;
  describedBy?: string;
  isAlert?: boolean;
  className?: string;
  children: ReactNode;
};

export function Dialog({ open, onClose, labelledBy, describedBy, isAlert = false, className = "", children }: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      role={isAlert ? "alertdialog" : undefined}
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      className={`m-auto w-[calc(100%-2rem)] rounded-lg border border-neutral-200 bg-neutral-0 p-6 text-neutral-900 backdrop:bg-neutral-900/45 ${className}`}
    >
      {children}
    </dialog>
  );
}
