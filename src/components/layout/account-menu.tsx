"use client";

import Link from "next/link";
import {
  ArrowDown01Icon,
  Logout01Icon,
  Settings01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { appRoutes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

type AccountMenuProps = {
  accountLabel: string;
  avatarUrl?: string | null;
};

/** Account avatar trigger with profile, settings, and logout actions. */
export function AccountMenu({ accountLabel, avatarUrl }: AccountMenuProps) {
  const { logout } = useAuth();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          className={cn(
            "flex items-center gap-2 outline-none hover:bg-muted/20! focus:bg-muted/50!",
            "rounded-lg"
          )}
        >
          <Avatar>
            {avatarUrl ? <AvatarImage src={avatarUrl} alt="" /> : null}
            <AvatarFallback className="text-xs font-semibold">
              {accountLabel.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="hidden max-w-40 truncate text-sm font-semibold tracking-tight text-foreground sm:inline">
            {accountLabel}
          </span>
          <HugeiconsIcon
            icon={ArrowDown01Icon}
            strokeWidth={2}
            className="hidden size-2.5 shrink-0 text-foreground sm:block"
          />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href={appRoutes.profile._self.path}>
              <HugeiconsIcon icon={UserIcon} strokeWidth={2} />
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={appRoutes.settings._self.path}>
              <HugeiconsIcon icon={Settings01Icon} strokeWidth={2} />
              Settings
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          variant="destructive"
          onSelect={() => {
            void logout();
          }}
        >
          <HugeiconsIcon icon={Logout01Icon} strokeWidth={2} />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
