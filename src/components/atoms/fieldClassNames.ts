export const fieldLabelClassName = "text-body-sm font-medium text-neutral-900";

export const fieldControlClassName =
  "w-full rounded-md border bg-neutral-0 px-3 py-2 text-body text-neutral-900 placeholder:text-neutral-500 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-cyan-700 disabled:cursor-not-allowed disabled:bg-neutral-100";

export function getFieldBorderClassName(hasError: boolean) {
  return hasError ? "border-closed-700" : "border-neutral-300";
}

export function getFieldMessageId(id: string, hint?: string, error?: string) {
  return hint || error ? `${id}-message` : undefined;
}
