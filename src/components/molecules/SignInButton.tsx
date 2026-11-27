"use client";

import { useState } from "react";
import { Button } from "@/components/atoms/Button";
import { authClient } from "@/lib/auth-client";

type SignInButtonProps = {
  label: string;
  pendingLabel: string;
  callbackURL: string;
  errorCallbackURL: string;
  variant?: "primary" | "secondary";
};

export function SignInButton({
  label,
  pendingLabel,
  callbackURL,
  errorCallbackURL,
  variant = "primary",
}: SignInButtonProps) {
  const [isPending, setIsPending] = useState(false);

  const signIn = async () => {
    setIsPending(true);
    const { error } = await authClient.signIn.social({ provider: "github", callbackURL, errorCallbackURL });
    if (error) setIsPending(false);
  };

  return (
    <Button variant={variant} onClick={signIn} disabled={isPending} aria-busy={isPending}>
      {isPending ? pendingLabel : label}
    </Button>
  );
}
