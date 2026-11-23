"use client";

import { useSearchParams } from "next/navigation";

type SignInMessageProps = {
  cancelledMessage: string;
  failedMessage: string;
};

const cancelledError = "access_denied";

const toneClassNames = {
  cancelled: "border-warning-700 bg-warning-50 text-warning-700",
  failed: "border-closed-700 bg-closed-50 text-closed-700",
};

export function SignInMessage({ cancelledMessage, failedMessage }: SignInMessageProps) {
  const error = useSearchParams().get("error");

  if (!error) return null;

  const isCancelled = error === cancelledError;

  return (
    <p
      role="alert"
      className={`rounded-md border p-3 text-body-sm ${toneClassNames[isCancelled ? "cancelled" : "failed"]}`}
    >
      {isCancelled ? cancelledMessage : failedMessage}
    </p>
  );
}
