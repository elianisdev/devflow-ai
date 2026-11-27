"use client";

import { useId, useTransition } from "react";
import { Button } from "@/components/atoms/Button";
import { Dialog } from "@/components/atoms/Dialog";

export type DeleteTaskLabels = {
  open: string;
  title: string;
  description: string;
  keep: string;
  confirm: string;
  pending: string;
};

type DeleteTaskDialogProps = {
  open: boolean;
  taskTitle: string;
  labels: DeleteTaskLabels;
  onDelete: () => Promise<void>;
  onClose: () => void;
  onDeleted: () => void;
};

export function DeleteTaskDialog({ open, taskTitle, labels, onDelete, onClose, onDeleted }: DeleteTaskDialogProps) {
  const [isPending, startTransition] = useTransition();
  const titleId = useId();
  const descriptionId = useId();

  const confirm = () =>
    startTransition(async () => {
      await onDelete();
      onDeleted();
    });

  return (
    <Dialog open={open} onClose={onClose} labelledBy={titleId} describedBy={descriptionId} isAlert className="max-w-md">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <h2 id={titleId} className="text-heading-sm">
            {labels.title}
          </h2>
          <p id={descriptionId} className="text-body-sm text-neutral-600">
            {labels.description.replace("{title}", taskTitle)}
          </p>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose} autoFocus>
            {labels.keep}
          </Button>
          <Button variant="danger" onClick={confirm} disabled={isPending} aria-busy={isPending}>
            {isPending ? labels.pending : labels.confirm}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
