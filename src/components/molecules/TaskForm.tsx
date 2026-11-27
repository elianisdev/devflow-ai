"use client";

import { useActionState, useEffect, useId, useState, type ReactNode } from "react";
import { Button } from "@/components/atoms/Button";
import { TextField } from "@/components/atoms/TextField";
import { Textarea } from "@/components/atoms/Textarea";
import { taskTitleMaxLength, type TaskInputErrorCode } from "@/domain/board/task-input";
import type { TaskFormAction } from "@/types/task-form";

export type TaskFormLabels = {
  title: string;
  description: string;
  descriptionPlaceholder: string;
  cancel: string;
  submit: string;
  pending: string;
  errors: Record<TaskInputErrorCode, string>;
};

type TaskFormProps = {
  action: TaskFormAction;
  labels: TaskFormLabels;
  defaultTitle?: string;
  defaultDescription?: string;
  onCancel: () => void;
  onSuccess: () => void;
  secondaryAction?: ReactNode;
};

export function TaskForm({
  action,
  labels,
  defaultTitle = "",
  defaultDescription = "",
  onCancel,
  onSuccess,
  secondaryAction,
}: TaskFormProps) {
  const [state, formAction, isPending] = useActionState(action, {});
  const [title, setTitle] = useState(defaultTitle);
  const titleId = useId();
  const descriptionId = useId();
  const titleErrorCode = state.errors?.title;

  useEffect(() => {
    if (state.success) onSuccess();
  }, [state, onSuccess]);

  return (
    <form action={formAction} noValidate className="flex flex-col gap-5">
      <TextField
        id={titleId}
        name="title"
        label={labels.title}
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        maxLength={taskTitleMaxLength}
        error={titleErrorCode && labels.errors[titleErrorCode]}
        labelAside={
          <span aria-hidden="true" className="font-mono text-data text-neutral-600">
            {title.length}/{taskTitleMaxLength}
          </span>
        }
      />
      <Textarea
        id={descriptionId}
        name="description"
        label={labels.description}
        placeholder={labels.descriptionPlaceholder}
        defaultValue={defaultDescription}
      />
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-neutral-100 pt-4">
        <div>{secondaryAction}</div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={onCancel}>
            {labels.cancel}
          </Button>
          <Button type="submit" disabled={isPending} aria-busy={isPending}>
            {isPending ? labels.pending : labels.submit}
          </Button>
        </div>
      </div>
    </form>
  );
}
