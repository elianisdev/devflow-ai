import type { SelectHTMLAttributes } from "react";
import { FieldMessage } from "./FieldMessage";
import {
  fieldControlClassName,
  fieldLabelClassName,
  getFieldBorderClassName,
  getFieldMessageId,
} from "./fieldClassNames";

type SelectOption = {
  value: string;
  label: string;
};

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  id: string;
  label: string;
  options: SelectOption[];
  hint?: string;
  error?: string;
};

export function Select({ id, label, options, hint, error, ...props }: SelectProps) {
  const messageId = getFieldMessageId(id, hint, error);

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className={fieldLabelClassName}>
        {label}
      </label>
      <select
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={messageId}
        className={`${fieldControlClassName} ${getFieldBorderClassName(Boolean(error))}`}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {messageId && <FieldMessage id={messageId} hint={hint} error={error} />}
    </div>
  );
}
