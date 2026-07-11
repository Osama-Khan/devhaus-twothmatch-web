"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Briefcase07Icon,
  Calendar03Icon,
  CrownIcon,
  Home01Icon,
  UserStar01Icon,
} from "@hugeicons/core-free-icons";
import { appRoutes } from "@/lib/routes";
import { APP_NAME } from "@/lib/constants/app";
import { useAuthSelector } from "@/lib/store/hooks";
import { cn } from "@/lib/utils";
import { NotificationsButton } from "./notifications-button";
import { AccountMenu } from "./account-menu";
import Image from "next/image";
import { Separator } from "../ui/separator";

type NavItem = {
  href: string;
  label: string;
  icon: typeof Home01Icon;
};

const NAV_ITEMS: NavItem[] = [
  { href: appRoutes.nav.home._self.path, label: "Home", icon: Home01Icon },
  {
    href: appRoutes.nav.matches._self.path,
    label: "Matches",
    icon: CrownIcon,
  },
  {
    href: appRoutes.nav.myJobs._self.path,
    label: "My Jobs",
    icon: Briefcase07Icon,
  },
  { href: appRoutes.nav.invites._self.path, label: "Invites", icon: UserStar01Icon },
  {
    href: appRoutes.nav.events._self.path,
    label: "Events",
    icon: Calendar03Icon,
  },
];

/** Returns whether a nav href matches the current pathname. */
function isNavActive(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href;
}

type HeaderNavLinkProps = {
  item: NavItem;
  isActive: boolean;
};

/** Single header nav item with icon and label. */
function HeaderNavLink({ item, isActive }: HeaderNavLinkProps) {
  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-1 text-sm transition-colors",
        isActive
          ? "font-semibold text-primary"
          : "font-medium text-muted-foreground hover:text-foreground"
      )}
    >
      <HugeiconsIcon
        icon={item.icon}
        strokeWidth={2}
        className={cn("size-6 shrink-0", isActive ? "text-primary" : "text-muted-foreground")}
      />
      <span>{item.label}</span>
    </Link>
  );
}

/** Top navigation bar for authenticated app routes */
export function AppHeader() {
  const pathname = usePathname();
  const { user } = useAuthSelector();
  const accountLabel = user?.fullName ?? user?.email ?? "Account";

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card">
      <div className="mx-auto mt-10 mb-6 flex max-w-7xl items-center px-4">
        <div className="flex flex-1 justify-start">
          <Link
            href={appRoutes.home._self.path}
            className="text-sm font-semibold tracking-tight"
          >
            <Image src="/img/logo-wd.svg" alt={APP_NAME} height={42} width={192} />
          </Link>
        </div>

        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-10 lg:flex"
        >
          {NAV_ITEMS.map((item) => (
            <HeaderNavLink
              key={item.href}
              item={item}
              isActive={isNavActive(pathname, item.href)}
            />
          ))}
        </nav>

        <div className="flex flex-1 items-center justify-end gap-3">
          <NotificationsButton />
          <Separator orientation="vertical" className="ml-2" />
          <AccountMenu
            accountLabel={accountLabel}
            avatarUrl={user?.avatarUrl}
          />
        </div>
      </div>
    </header>
  );
}
