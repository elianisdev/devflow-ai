"use client";

import { useRouter } from "next/navigation";
import { Avatar } from "@/components/atoms/Avatar";
import { Button } from "@/components/atoms/Button";
import { authClient } from "@/lib/auth-client";

type UserMenuProps = {
  name: string;
  login: string;
  avatarUrl?: string | null;
  label: string;
  signOutLabel: string;
  homePath: string;
};

export function UserMenu({ name, login, avatarUrl, label, signOutLabel, homePath }: UserMenuProps) {
  const router = useRouter();

  const signOut = async () => {
    await authClient.signOut();
    router.replace(homePath);
    router.refresh();
  };

  return (
    <nav aria-label={label} className="flex items-center gap-3">
      {avatarUrl && <Avatar src={avatarUrl} alt="" />}
      <div className="flex flex-col">
        <span className="text-body-sm font-semibold">{name}</span>
        <span className="font-mono text-data text-neutral-600">@{login}</span>
      </div>
      <Button variant="secondary" onClick={signOut}>
        {signOutLabel}
      </Button>
    </nav>
  );
}
