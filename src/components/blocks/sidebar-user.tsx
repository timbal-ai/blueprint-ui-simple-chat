import * as React from "react";
import {
  ChevronsUpDownIcon,
  HelpCircleIcon,
  LogOutIcon,
  SettingsIcon,
  UserIcon,
  type IconComponent,
} from "@/components/icons";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

/**
 * SidebarUser — the account row that lives in `AppShell`'s `footer` slot.
 *
 * Real avatar + name/email. Pass `menu` when the app has account actions;
 * without it you get a static identity row (no dropdown). When a menu is
 * provided, it works in every sidebar state: expanded shows the full row,
 * collapsed (icon rail) shows just the avatar, and the menu opens to the
 * side so it never clips. On mobile the menu opens upward inside the sheet.
 */

interface SidebarUserMenuItem {
  id: string;
  label: string;
  icon?: IconComponent;
  /** Render tinted red and separated — sign out, delete account. */
  destructive?: boolean;
}

/** Optional preset — opt in via `menu={SIDEBAR_USER_MENU_PRESET}` when needed. */
const SIDEBAR_USER_MENU_PRESET: SidebarUserMenuItem[] = [
  { id: "profile", label: "Profile", icon: UserIcon },
  { id: "settings", label: "Settings", icon: SettingsIcon },
  { id: "help", label: "Help center", icon: HelpCircleIcon },
  { id: "sign-out", label: "Sign out", icon: LogOutIcon, destructive: true },
];

function SidebarUser({
  name,
  email,
  avatarSrc,
  menu = [],
  onSelect,
}: {
  name: string;
  /** Secondary line under the name (email, role, plan). */
  email?: string;
  /** Avatar image URL — initials fall back automatically. */
  avatarSrc?: string;
  /** Menu entries; `destructive` items are separated + tinted. */
  menu?: SidebarUserMenuItem[];
  onSelect?: (id: string) => void;
}) {
  const { isMobile } = useSidebar();
  const initials = name
    .split(/\s+/)
    .map((part) => part.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const hasMenu = menu.length > 0;
  const regular = menu.filter((item) => !item.destructive);
  const destructive = menu.filter((item) => item.destructive);

  const avatar = (
    <Avatar className="size-7 rounded-lg">
      {avatarSrc ? <AvatarImage src={avatarSrc} alt={name} /> : null}
      <AvatarFallback className="rounded-lg text-[10px]">
        {initials}
      </AvatarFallback>
    </Avatar>
  );

  const identity = (
    <>
      {avatar}
      <div className="grid min-w-0 flex-1 text-left leading-tight">
        <span className="truncate text-sm text-foreground">{name}</span>
        {email ? (
          <span className="truncate text-xs text-muted-foreground">{email}</span>
        ) : null}
      </div>
    </>
  );

  if (!hasMenu) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" className="cursor-default hover:bg-transparent">
            {identity}
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              {identity}
              <ChevronsUpDownIcon className="ml-auto size-3.5 shrink-0 text-muted-foreground" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-56 rounded-xl"
            side={isMobile ? "top" : "right"}
            align="end"
            sideOffset={6}
          >
            <DropdownMenuLabel className="flex items-center gap-2 font-normal">
              {identity}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {regular.map((item) => (
                <DropdownMenuItem
                  key={item.id}
                  onSelect={() => onSelect?.(item.id)}
                >
                  {item.icon ? <item.icon /> : null}
                  {item.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            {destructive.length > 0 ? (
              <>
                <DropdownMenuSeparator />
                {destructive.map((item) => (
                  <DropdownMenuItem
                    key={item.id}
                    variant="destructive"
                    onSelect={() => onSelect?.(item.id)}
                  >
                    {item.icon ? <item.icon /> : null}
                    {item.label}
                  </DropdownMenuItem>
                ))}
              </>
            ) : null}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

export { SidebarUser, SIDEBAR_USER_MENU_PRESET };
export type { SidebarUserMenuItem };
