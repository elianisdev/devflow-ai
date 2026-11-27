"use client";

import { useCallback, useId, useState, type CSSProperties, type HTMLAttributes, type ReactNode } from "react";
import { Button } from "@/components/atoms/Button";
import { Dialog } from "@/components/atoms/Dialog";
import { DeleteTaskDialog, type DeleteTaskLabels } from "@/components/molecules/DeleteTaskDialog";
import { TaskCardFace, type CardPullRequest, type TaskCardFaceLabels } from "@/components/molecules/TaskCardFace";
import { TaskForm, type TaskFormLabels, type TaskStatusField } from "@/components/molecules/TaskForm";
import type { TaskFormAction } from "@/types/task-form";

type TaskCardProps = {
  title: string;
  description: string | null;
  columnTitle: string;
  pullRequest: CardPullRequest | null;
  faceLabels: TaskCardFaceLabels;
  pullRequestSection: ReactNode;
  detailTitle: string;
  closeLabel: string;
  formLabels: TaskFormLabels;
  deleteLabels: DeleteTaskLabels;
  updateAction: TaskFormAction;
  deleteAction: () => Promise<void>;
  statusField: TaskStatusField;
  cardId?: string;
  cardRef?: (node: HTMLElement | null) => void;
  dragProps?: HTMLAttributes<HTMLButtonElement>;
  cardStyle?: CSSProperties;
  placeholderClassName?: string;
  shouldIgnoreClick?: () => boolean;
};

type OpenDialog = "none" | "detail" | "delete";

export function TaskCard({
  title,
  description,
  columnTitle,
  pullRequest,
  faceLabels,
  pullRequestSection,
  detailTitle,
  closeLabel,
  formLabels,
  deleteLabels,
  updateAction,
  deleteAction,
  statusField,
  cardId,
  cardRef,
  dragProps,
  cardStyle,
  placeholderClassName,
  shouldIgnoreClick,
}: TaskCardProps) {
  const [openDialog, setOpenDialog] = useState<OpenDialog>("none");
  const [formKey, setFormKey] = useState(0);
  const titleId = useId();

  const openDetail = () => {
    setFormKey((key) => key + 1);
    setOpenDialog("detail");
  };
  const handleCardClick = () => {
    if (shouldIgnoreClick?.()) return;
    openDetail();
  };
  const close = useCallback(() => setOpenDialog("none"), []);

  return (
    <>
      <button
        ref={cardRef}
        id={cardId}
        type="button"
        style={cardStyle}
        {...dragProps}
        onClick={handleCardClick}
        className={
          placeholderClassName
            ? `flex w-full flex-col gap-2 rounded-md border-2 border-dashed p-3.5 text-left [&>*]:invisible ${placeholderClassName}`
            : "flex w-full touch-manipulation flex-col gap-2 rounded-md border border-neutral-200 bg-neutral-0 p-3.5 text-left transition-colors hover:border-neutral-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-700 motion-reduce:transition-none"
        }
      >
        <TaskCardFace title={title} description={description} pullRequest={pullRequest} labels={faceLabels} />
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
              statusField={statusField}
              afterDescription={pullRequestSection}
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
