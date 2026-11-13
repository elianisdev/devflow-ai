type FieldMessageProps = {
  id: string;
  hint?: string;
  error?: string;
};

export function FieldMessage({ id, hint, error }: FieldMessageProps) {
  if (error) {
    return (
      <p id={id} className="text-caption text-closed-700">
        {error}
      </p>
    );
  }

  if (hint) {
    return (
      <p id={id} className="text-caption text-neutral-600">
        {hint}
      </p>
    );
  }

  return null;
}
