import type { InputHTMLAttributes } from "react";
import { FieldMessage } from "./FieldMessage";
import {
  fieldControlClassName,
  fieldLabelClassName,
  getFieldBorderClassName,
  getFieldMessageId,
} from "./fieldClassNames";

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: string;
  hint?: string;
  error?: string;
};

export function TextField({ id, label, hint, error, type = "text", ...props }: TextFieldProps) {
  const messageId = getFieldMessageId(id, hint, error);

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className={fieldLabelClassName}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        aria-invalid={error ? true : undefined}
        aria-describedby={messageId}
        className={`${fieldControlClassName} ${getFieldBorderClassName(Boolean(error))}`}
        {...props}
      />
      {messageId && <FieldMessage id={messageId} hint={hint} error={error} />}
    </div>
  );
}
