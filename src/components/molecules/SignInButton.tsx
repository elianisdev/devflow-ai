"use client";

import { useState } from "react";
import { Button } from "@/components/atoms/Button";
import { authClient } from "@/lib/auth-client";

type SignInButtonProps = {
  label: string;
  pendingLabel: string;
  callbackURL: string;
  errorCallbackURL: string;
};

export function SignInButton({ label, pendingLabel, callbackURL, errorCallbackURL }: SignInButtonProps) {
  const [isPending, setIsPending] = useState(false);

  const signIn = async () => {
    setIsPending(true);
    const { error } = await authClient.signIn.social({ provider: "github", callbackURL, errorCallbackURL });
    if (error) setIsPending(false);
  };

  return (
    <Button onClick={signIn} disabled={isPending} aria-busy={isPending}>
      {isPending ? pendingLabel : label}
    </Button>
  );
}
