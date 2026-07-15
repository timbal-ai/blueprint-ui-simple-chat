"use client";

import { useState, type ComponentType, type ReactNode } from "react";
import {
  RiAsterisk,
  RiCalendarLine,
  RiCloseLine,
  RiCustomerServiceLine,
  RiFolder6Line,
  RiHomeLine,
  RiInbox2Line,
  RiPieChart2Line,
  RiSearchLine,
  RiSettings4Line,
  RiSideBarFill,
  RiUserSmileLine,
} from "@remixicon/react";
import { Announcement } from "@/components/base/announcement/announcement";
import { Badge } from "@/components/base/badges/badge";
import { Kbd } from "@/components/base/kbd/kbd";
import { cx } from "@/utils/cx";
import { DashboardTeamMenu } from "./dashboard-team-menu";
import { DashboardUserMenu } from "./dashboard-user-menu";

/**
 * Figma sources:
 *   expanded  → Board UI → dashboard 1 → Sidebar (node 3731:2934)
 *   collapsed → Board UI → Sidebar (node 3768:3382)
 *
 * Floating sidebar panel. Expanded: 260px wide, p 12, radius/3xl (24px),
 * white 1px border, "Background/Sidebar Elevation" shadow, bg
 * background/secondary. Collapsed: 60px wide (36px icon items + 12px
 * padding); collapse button sits centered above the workspace avatar, quick
 * search becomes a 36px neutral-200 square, nav items become icon-only
 * squares, the team card reduces to its avatar.
 *
 * The two states morph into each other: the panel width animates while
 * labels / badges / kbd collapse via max-width + opacity.
 */

type IconComponent = ComponentType<{
  className?: string;
  "aria-hidden"?: boolean | "true" | "false";
}>;

/**
 * Collapsible text/badge slot: blurs + fades + shrinks away when the rail
 * closes, and blurs back in on expand. The icons/rows themselves stay pinned in
 * place — only these label/badge slots animate — so nothing jumps to center.
 */
function Collapsible({ collapsed, children, className }: { collapsed: boolean; children: ReactNode; className?: string }) {
  return (
    <span
      className={cx(
        "flex min-w-0 items-center overflow-hidden transition-[max-width,opacity,filter] duration-300 ease-in-out",
        collapsed ? "max-w-0 opacity-0 blur-[3px]" : "max-w-40 opacity-100 blur-0",
        className,
      )}
    >
      {children}
    </span>
  );
}

function NavItem({
  icon: Icon,
  label,
  badge,
  isSelected = false,
  collapsed = false,
  href = "#",
}: {
  icon: IconComponent;
  label: string;
  badge?: ReactNode;
  isSelected?: boolean;
  collapsed?: boolean;
  href?: string;
}) {
  return (
    <a
      href={href}
      aria-current={isSelected ? "page" : undefined}
      aria-label={label}
      title={collapsed ? label : undefined}
      className={cx(
        "flex items-center justify-between overflow-hidden rounded-2lg p-2",
        "transition-[width,background-color] duration-300 ease-in-out",
        collapsed ? "w-9" : "w-full",
        isSelected
          ? "bg-linear-to-b from-blue-500 to-blue-600 shadow-nav-selected"
          : "hover:bg-background-secondary-hover",
      )}
    >
      <span className="flex min-w-0 items-center gap-2">
        <Icon
          className={cx("size-5 shrink-0", isSelected ? "text-white" : "text-foreground-icon-secondary")}
          aria-hidden
        />
        <Collapsible collapsed={collapsed}>
          <span
            className={cx(
              "text-body-medium whitespace-nowrap",
              isSelected ? "text-white" : "text-text-secondary",
            )}
          >
            {label}
          </span>
        </Collapsible>
      </span>
      {badge && <Collapsible collapsed={collapsed}>{badge}</Collapsible>}
    </a>
  );
}

export type DashboardNavKey =
  | "home"
  | "analytics"
  | "calendar"
  | "projects"
  | "inbox"
  | "medical"
  | "profile";

export function DashboardSidebar({
  mobile = false,
  onClose,
  fluid = false,
  selected = "home",
  className,
}: {
  /** Rendered inside the mobile drawer: always expanded, close button instead of collapse. */
  mobile?: boolean;
  onClose?: () => void;
  /** Expanded width fills its container below `lg` instead of the fixed
   *  260px (e.g. the landing page, where the sidebar isn't in a drawer).
   *  Collapsed width stays the fixed 60px rail at every breakpoint — the
   *  whole point of collapsing is to shrink, so it must never get
   *  overridden back to full width. */
  fluid?: boolean;
  /** Which nav item shows the selected (filled blue) state. */
  selected?: DashboardNavKey;
  className?: string;
} = {}) {
  const [collapsedState, setCollapsed] = useState(false);
  const collapsed = mobile ? false : collapsedState;

  return (
    <aside
      className={cx(
        "flex h-full shrink-0 flex-col justify-between overflow-hidden rounded-3xl",
        "border border-border-button-white bg-background-secondary-default shadow-sidebar",
        "transition-[width] duration-300 ease-in-out",
        // Collapsed rail keeps the 60px spec: 1px border + 11px padding on each
        // side leaves an exactly 36px column so the w-9 (36px) icon items center.
        collapsed
          ? "w-[60px] px-[11px] py-3"
          : fluid
            ? "w-full p-3 lg:w-[260px]"
            : "w-[260px] p-3",
        className,
      )}
    >
      <div className="flex w-full flex-col gap-3">
        {/* Workspace switcher / collapse control */}
        <div
          className={cx(
            "flex w-full transition-[gap] duration-300 ease-in-out",
            collapsed
              ? "flex-col-reverse items-start justify-center gap-2.5"
              : "flex-row items-center justify-between",
          )}
        >
          <DashboardUserMenu collapsed={collapsed} />
          {mobile ? (
            <button
              type="button"
              aria-label="Close sidebar"
              onClick={onClose}
              className="cursor-pointer text-foreground-icon-secondary"
            >
              <RiCloseLine className="size-5" aria-hidden />
            </button>
          ) : (
            <button
              type="button"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              aria-expanded={!collapsed}
              onClick={() => setCollapsed((c) => !c)}
              className={cx(
                "cursor-pointer text-foreground-icon-secondary transition-transform duration-300 ease-in-out",
                collapsed && "flex w-9 items-center justify-center",
              )}
            >
              <RiSideBarFill
                className={cx("size-5 transition-transform duration-300 ease-in-out", !collapsed && "-scale-x-100")}
                aria-hidden
              />
            </button>
          )}
        </div>

        <div className="flex w-full flex-col gap-3">
          {/* Quick search */}
          <button
            type="button"
            aria-label="Quick Search"
            title={collapsed ? "Quick Search" : undefined}
            className={cx(
              "flex cursor-pointer items-center gap-2 p-2",
              "transition-[width,border-radius,background-color] duration-300 ease-in-out",
              collapsed
                ? "w-9 rounded-full bg-background-tertiary-default"
                : "w-full rounded-full bg-background-tertiary-default",
            )}
          >
            <span className={cx("flex min-w-0 items-center gap-2", !collapsed && "flex-1")}>
              <RiSearchLine className="size-5 shrink-0 text-foreground-icon-secondary" aria-hidden />
              <Collapsible collapsed={collapsed}>
                <span className="text-body-medium whitespace-nowrap text-text-secondary">
                  Quick Search
                </span>
              </Collapsible>
            </span>
            <Collapsible collapsed={collapsed}>
              <Kbd>⌘L</Kbd>
            </Collapsible>
          </button>

          {/* Primary nav */}
          <nav className="flex w-full flex-col gap-1">
            <NavItem
              icon={RiHomeLine}
              label="Home"
              href="/templates/dashboard"
              isSelected={selected === "home"}
              collapsed={collapsed}
              badge={<Badge color={selected === "home" ? "primary" : "neutral"}>152</Badge>}
            />
            <NavItem
              icon={RiPieChart2Line}
              label="Analytics"
              isSelected={selected === "analytics"}
              collapsed={collapsed}
            />
            <NavItem
              icon={RiCalendarLine}
              label="Calendar"
              href="/templates/calendar"
              isSelected={selected === "calendar"}
              collapsed={collapsed}
            />
            <NavItem
              icon={RiFolder6Line}
              label="Projects"
              isSelected={selected === "projects"}
              collapsed={collapsed}
            />
            <NavItem
              icon={RiAsterisk}
              label="Medical Report"
              href="/templates/medical-profile"
              isSelected={selected === "medical"}
              collapsed={collapsed}
            />
            <NavItem
              icon={RiUserSmileLine}
              label="Profile"
              href="/templates/ai-profile"
              isSelected={selected === "profile"}
              collapsed={collapsed}
            />
            <NavItem
              icon={RiInbox2Line}
              label="Inbox"
              isSelected={selected === "inbox"}
              collapsed={collapsed}
              badge={<Badge color={selected === "inbox" ? "primary" : "neutral"}>91</Badge>}
            />
          </nav>
        </div>
      </div>

      <div className="flex w-full flex-col gap-3">
        {/* Announcement — fills the gap above the footer nav (hidden collapsed: needs room for text) */}
        {!collapsed && (
          <Announcement
            title="Setting up your account"
            description="Take the tour and learn how to use our product."
            actionLabel="Take the tour"
            dismissible
            introDelay={1}
          />
        )}

        {/* Secondary nav */}
        <nav className="flex w-full flex-col gap-1">
          <NavItem icon={RiCustomerServiceLine} label="Support" collapsed={collapsed} />
          <NavItem icon={RiSettings4Line} label="Settings" collapsed={collapsed} />
        </nav>

        {/* Team card → opens the profile menu next to the sidebar */}
        <DashboardTeamMenu collapsed={collapsed} />
      </div>
    </aside>
  );
}
