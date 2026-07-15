import * as React from "react";
import {
  ChevronsUpDownIcon,
  LogOutIcon,
  type IconComponent,
} from "@/components/icons";

import { cn } from "@/lib/utils";
import { Avatar } from "@/components/base/avatar/avatar";
import {
  Dropdown,
  DropdownDivider,
  DropdownItem,
  DropdownPopover,
  DropdownTrigger,
} from "@/components/base/dropdown/dropdown";
import { useAppShellSidebar } from "@/components/blocks/app-shell";

/**
 * SidebarUser — the account row that lives in `AppShell`'s `footer` slot.
 *
 * Rebuilt on the BoardUI dropdown recipe (2026-07-14): the trigger is a
 * white bordered row on the gray sidebar panel, the menu is the BoardUI
 * panel surface (radius 16, shadow/dropdown, blur-in animation) opening to
 * the sidebar's right on desktop and upward on mobile.
 *
 * The dropdown opens with the identity card as a BUTTON at the top (selects
 * `"account"`), followed by whatever `menu` entries the app defines, and
 * always ends with a destructive "Sign out" entry (fires `onSignOut`,
 * falling back to `onSelect("sign-out")`) — wire it to the real session
 * teardown when building. Beyond that there is deliberately NO default menu
 * — account actions are app-specific.
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
  const { isMobile, collapsed } = useAppShellSidebar();
  const [isOpen, setIsOpen] = React.useState(false);
  const initials = name
    .split(/\s+/)
    .map((part) => part.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const regular = menu.filter((item) => !item.destructive);
  const destructive = menu.filter((item) => item.destructive);

  const pick = (fn: () => void) => {
    setIsOpen(false);
    fn();
  };

  const identity = (
    <>
      <Avatar size="sm" color="neutral" initials={initials} src={avatarSrc} alt={name} />
      <span className="grid min-w-0 flex-1 text-left leading-tight">
        <span className="truncate text-body-medium text-text-primary">{name}</span>
        {email ? (
          <span className="truncate text-caption-1-regular text-text-tertiary">
            {email}
          </span>
        ) : null}
      </span>
    </>
  );

  return (
    <Dropdown isOpen={isOpen} onOpenChange={setIsOpen}>
      <DropdownTrigger
        aria-label={`Account: ${name}`}
        className={cn(
          "flex w-full items-center gap-2 overflow-hidden rounded-2lg p-2",
          "transition-colors duration-150",
          collapsed
            ? "w-9 justify-center border border-transparent"
            : "border border-border-button-default bg-background-primary-default shadow-card hover:bg-background-primary-hover",
        )}
      >
        {collapsed ? (
          <Avatar size="sm" color="neutral" initials={initials} src={avatarSrc} alt={name} />
        ) : (
          <>
            {identity}
            <ChevronsUpDownIcon className="size-3.5 shrink-0 text-foreground-icon-tertiary" />
          </>
        )}
      </DropdownTrigger>
      <DropdownPopover
        aria-label="Account menu"
        placement={isMobile ? "top start" : "right bottom"}
        className="w-56"
      >
        {/* Identity card as a BUTTON — the account entry point. */}
        <DropdownItem onSelect={() => pick(() => onSelect?.("account"))}>
          {identity}
        </DropdownItem>
        {regular.length > 0 ? (
          <>
            <DropdownDivider />
            {regular.map((item) => (
              <DropdownItem
                key={item.id}
                onSelect={() => pick(() => onSelect?.(item.id))}
                className="px-2 py-1.5"
              >
                {item.icon ? (
                  <item.icon className="size-4 shrink-0 text-foreground-icon-secondary" />
                ) : null}
                <span className="text-body-medium text-text-primary">{item.label}</span>
              </DropdownItem>
            ))}
          </>
        ) : null}
        <DropdownDivider />
        {destructive.map((item) => (
          <DropdownItem
            key={item.id}
            onSelect={() => pick(() => onSelect?.(item.id))}
            className="px-2 py-1.5 hover:bg-background-tertiary-error focus-visible:bg-background-tertiary-error"
          >
            {item.icon ? (
              <item.icon className="size-4 shrink-0 text-foreground-icon-error" />
            ) : null}
            <span className="text-body-medium text-text-error-primary">{item.label}</span>
          </DropdownItem>
        ))}
        {/* Always present — apps wire onSignOut to the real teardown. */}
        <DropdownItem
          onSelect={() =>
            pick(() => (onSignOut ? onSignOut() : onSelect?.("sign-out")))
          }
          className="px-2 py-1.5 hover:bg-background-tertiary-error focus-visible:bg-background-tertiary-error"
        >
          <LogOutIcon className="size-4 shrink-0 text-foreground-icon-error" />
          <span className="text-body-medium text-text-error-primary">Sign out</span>
        </DropdownItem>
      </DropdownPopover>
    </Dropdown>
  );
}

export { SidebarUser };
export type { SidebarUserMenuItem };
