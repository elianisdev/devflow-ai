"use client";

import { useCallback, useId, useState } from "react";
import { Button } from "@/components/atoms/Button";
import { Dialog } from "@/components/atoms/Dialog";
import { DeleteTaskDialog, type DeleteTaskLabels } from "@/components/molecules/DeleteTaskDialog";
import { TaskForm, type TaskFormLabels } from "@/components/molecules/TaskForm";
import type { TaskFormAction } from "@/types/task-form";

type TaskCardProps = {
  title: string;
  description: string | null;
  columnTitle: string;
  noPullRequestLabel: string;
  detailTitle: string;
  closeLabel: string;
  formLabels: TaskFormLabels;
  deleteLabels: DeleteTaskLabels;
  updateAction: TaskFormAction;
  deleteAction: () => Promise<void>;
};

type OpenDialog = "none" | "detail" | "delete";

export function TaskCard({
  title,
  description,
  columnTitle,
  noPullRequestLabel,
  detailTitle,
  closeLabel,
  formLabels,
  deleteLabels,
  updateAction,
  deleteAction,
}: TaskCardProps) {
  const [openDialog, setOpenDialog] = useState<OpenDialog>("none");
  const [formKey, setFormKey] = useState(0);
  const titleId = useId();

  const openDetail = () => {
    setFormKey((key) => key + 1);
    setOpenDialog("detail");
  };
  const close = useCallback(() => setOpenDialog("none"), []);

  return (
    <>
      <button
        type="button"
        onClick={openDetail}
        className="flex w-full flex-col gap-2 rounded-md border border-neutral-200 bg-neutral-0 p-3.5 text-left transition-colors hover:border-neutral-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-700 motion-reduce:transition-none"
      >
        <span className="text-body-sm font-semibold">{title}</span>
        {description && <span className="line-clamp-2 text-caption text-neutral-600">{description}</span>}
        <span className="font-mono text-data text-neutral-600">{noPullRequestLabel}</span>
      </button>
      <Dialog open={openDialog === "detail"} onClose={close} labelledBy={titleId} className="max-w-lg">
        <div className="flex flex-col gap-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-1">
              <span className="font-mono text-data text-cyan-700">{columnTitle}</span>
              <h2 id={titleId} className="text-heading-sm">
                {detailTitle}
              </h2>
            </div>
            <Button variant="ghost" onClick={close} aria-label={closeLabel} className="size-11 px-0">
              <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
                <path d="M4 4l8 8M12 4l-8 8" />
              </svg>
            </Button>
          </div>
          {openDialog === "detail" && (
            <TaskForm
              key={formKey}
              action={updateAction}
              labels={formLabels}
              defaultTitle={title}
              defaultDescription={description ?? ""}
              onCancel={close}
              onSuccess={close}
              secondaryAction={
                <Button variant="dangerGhost" onClick={() => setOpenDialog("delete")}>
                  {deleteLabels.open}
                </Button>
              }
            />
          )}
        </div>
      </Dialog>
      <DeleteTaskDialog
        open={openDialog === "delete"}
        taskTitle={title}
        labels={deleteLabels}
        onDelete={deleteAction}
        onClose={openDetail}
        onDeleted={close}
      />
    </>
  );
}
