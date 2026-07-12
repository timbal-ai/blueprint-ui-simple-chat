import * as React from "react";
import {
  ChevronsUpDownIcon,
  LogOutIcon,
  type IconComponent,
} from "@/components/icons";

import { SURFACE_SHADOW } from "@/lib/control-surface";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
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
 * Real avatar + name/email. The dropdown opens with the identity card as a
 * BUTTON at the top (selects `"account"`), followed by whatever `menu`
 * entries the app defines, and always ends with a destructive "Sign out"
 * entry (fires `onSignOut`, falling back to `onSelect("sign-out")`) —
 * wire it to the real session teardown when building. Beyond that there
 * is deliberately NO default menu — account actions are app-specific, so
 * define them per app (profile, billing, …) instead of shipping
 * placeholder options.
 *
 * Works in every sidebar state: expanded shows the full row, collapsed
 * (icon rail) shows just the avatar, and the menu opens to the side so it
 * never clips. On mobile the menu opens upward inside the sheet.
 */

interface SidebarUserMenuItem {
  id: string;
  label: string;
  icon?: IconComponent;
  /** Render tinted red and separated — sign out, delete account. */
  destructive?: boolean;
}

function SidebarUser({
  name,
  email,
  avatarSrc,
  menu = [],
  onSelect,
  onSignOut,
}: {
  name: string;
  /** Secondary line under the name (email, role, plan). */
  email?: string;
  /** Avatar image URL — initials fall back automatically. */
  avatarSrc?: string;
  /**
   * App-specific menu entries — empty by default (define per app);
   * `destructive` items are separated + tinted.
   */
  menu?: SidebarUserMenuItem[];
  /** Fires with the item id — the identity card at the top fires "account". */
  onSelect?: (id: string) => void;
  /**
   * Sign-out handler — wire this to the real session teardown.
   * Falls back to `onSelect("sign-out")` when omitted.
   */
  onSignOut?: () => void;
}) {
  const { isMobile } = useSidebar();
  const initials = name
    .split(/\s+/)
    .map((part) => part.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();

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

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className={cn(
                // Reads as a white BUTTON on the gray sidebar — same border +
                // surface shadow as every white control (house contract).
                "rounded-lg border border-border bg-card",
                SURFACE_SHADOW,
                "hover:bg-ghost-fill-hover active:bg-ghost-fill-active",
                "data-[state=open]:bg-ghost-fill-hover",
              )}
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
            {/* Identity card as a BUTTON — the account entry point. */}
            <DropdownMenuItem
              className="gap-2 p-2"
              onSelect={() => onSelect?.("account")}
            >
              {identity}
            </DropdownMenuItem>
            {regular.length > 0 ? (
              <>
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
              </>
            ) : null}
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
            {/* Always present — agents wire onSignOut to the real teardown. */}
            <DropdownMenuItem
              variant="destructive"
              onSelect={() => (onSignOut ? onSignOut() : onSelect?.("sign-out"))}
            >
              <LogOutIcon />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

export { SidebarUser };
export type { SidebarUserMenuItem };
