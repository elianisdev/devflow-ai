"use client";

import { useCallback, useId, useState } from "react";
import { Button } from "@/components/atoms/Button";
import { Dialog } from "@/components/atoms/Dialog";
import { TaskForm, type TaskFormLabels } from "@/components/molecules/TaskForm";
import type { TaskFormAction } from "@/types/task-form";

type CreateTaskButtonProps = {
  action: TaskFormAction;
  triggerLabel: string;
  triggerVariant?: "primary" | "ghost";
  triggerClassName?: string;
  dialogTitle: string;
  dialogDescription: string;
  formLabels: TaskFormLabels;
};

export function CreateTaskButton({
  action,
  triggerLabel,
  triggerVariant = "primary",
  triggerClassName,
  dialogTitle,
  dialogDescription,
  formLabels,
}: CreateTaskButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const titleId = useId();
  const descriptionId = useId();

  const open = () => {
    setFormKey((key) => key + 1);
    setIsOpen(true);
  };
  const close = useCallback(() => setIsOpen(false), []);

  return (
    <>
      <Button variant={triggerVariant} onClick={open} className={triggerClassName}>
        {triggerLabel}
      </Button>
      <Dialog open={isOpen} onClose={close} labelledBy={titleId} describedBy={descriptionId} className="max-w-lg">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <h2 id={titleId} className="text-heading-sm">
              {dialogTitle}
            </h2>
            <p id={descriptionId} className="text-body-sm text-neutral-600">
              {dialogDescription}
            </p>
          </div>
          {isOpen && (
            <TaskForm key={formKey} action={action} labels={formLabels} onCancel={close} onSuccess={close} />
          )}
        </div>
      </Dialog>
    </>
  );
}
