"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowDown01Icon,
  CrownIcon,
  Logout01Icon,
  Settings01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { isProPlan } from "@/features/payments/utils/is-pro-plan";
import { openStripeBillingPortal } from "@/features/payments/utils/open-stripe-hosted-page";
import { openUpgradeDialog } from "@/features/payments/utils/open-upgrade-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { appRoutes } from "@/lib/routes";
import { useAuthSelector } from "@/lib/store/hooks";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

type AccountMenuProps = {
  accountLabel: string;
  avatarUrl?: string | null;
};

/** Account avatar trigger with profile, settings, billing, and logout actions. */
export function AccountMenu({ accountLabel, avatarUrl }: AccountMenuProps) {
  const { logout } = useAuth();
  const { entitlement } = useAuthSelector();
  const showProBadge = isProPlan(entitlement?.planCode);
  const [isBillingPending, setIsBillingPending] = useState(false);

  async function handleManagePlan() {
    if (isBillingPending) {
      return;
    }

    setIsBillingPending(true);
    const navigated = await openStripeBillingPortal();
    if (!navigated) {
      setIsBillingPending(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            className={cn(
              "relative flex items-center gap-2 outline-none hover:bg-muted/20! focus:bg-muted/50!",
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
            {showProBadge ? (
              <Badge
                variant="soft"
                className="absolute right-6 -bottom-2 h-4 px-1.5 text-[10px] font-semibold uppercase"
              >
                Pro
              </Badge>
            ) : null}
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
            {showProBadge ? (
              <DropdownMenuItem
                disabled={isBillingPending}
                onSelect={(event) => {
                  event.preventDefault();
                  void handleManagePlan();
                }}
              >
                <HugeiconsIcon icon={CrownIcon} strokeWidth={2} />
                {isBillingPending ? "Opening…" : "Manage plan"}
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem
                onSelect={() => {
                  openUpgradeDialog();
                }}
              >
                <HugeiconsIcon icon={CrownIcon} strokeWidth={2} />
                Upgrade
              </DropdownMenuItem>
            )}
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
    </div>
  );
}
