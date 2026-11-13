import type { TextareaHTMLAttributes } from "react";
import { FieldMessage } from "./FieldMessage";
import {
  fieldControlClassName,
  fieldLabelClassName,
  getFieldBorderClassName,
  getFieldMessageId,
} from "./fieldClassNames";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  id: string;
  label: string;
  hint?: string;
  error?: string;
};

export function Textarea({ id, label, hint, error, rows = 4, ...props }: TextareaProps) {
  const messageId = getFieldMessageId(id, hint, error);

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className={fieldLabelClassName}>
        {label}
      </label>
      <textarea
        id={id}
        rows={rows}
        aria-invalid={error ? true : undefined}
        aria-describedby={messageId}
        className={`${fieldControlClassName} ${getFieldBorderClassName(Boolean(error))} resize-y`}
        {...props}
      />
      {messageId && <FieldMessage id={messageId} hint={hint} error={error} />}
    </div>
  );
}
