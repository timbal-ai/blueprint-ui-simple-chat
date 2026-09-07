"use client";

import { useState, type ReactNode } from "react";
import { RiCloseLine, RiLogoutBoxRLine, RiSideBarFill } from "@remixicon/react";
import { Link, useLocation } from "react-router-dom";
import { ThemeToggle } from "@/components/application/theme/theme-toggle";
import { Avatar } from "@/components/base/avatar/avatar";
import { Badge } from "@/components/base/badges/badge";
import { Breadcrumb, BreadcrumbItem } from "@/components/base/breadcrumb/breadcrumb";
import {
  Dropdown,
  DropdownDivider,
  DropdownGroup,
  DropdownItem,
  DropdownPopover,
  DropdownTrigger,
  type DropdownPopoverProps,
} from "@/components/base/dropdown/dropdown";
import { ChevronDownSmall } from "@/components/foundations/icons/chevrons";
import { cx } from "@/utils/cx";
import {
  initialsOf,
  normalizeNavPath,
  resolveHomeNavItem,
  resolveNavTrail,
  useActiveNavItem,
  type ShellBrand,
  type ShellNavItem,
  type ShellUser,
} from "./shell-nav";

/**
 * Shell chrome — the BoardUI dashboard-sidebar grammar re-composed with
 * props. The vendored `DashboardSidebar` hardcodes its identity ("Board team",
 * "Mertcan Esmergul", Support/Settings → the demo SettingsModal) and renders
 * its rows as plain `<a href>` — so the shells rebuild the same recipe here,
 * class for class (floating 24px-radius panel, 260 ↔ 60px morph, accent
 * gradient on the selected row, blur-collapsing labels, sidebar-segmented
 * theme toggle, team-card account trigger) from the BoardUI base primitives,
 * with react-router `Link`s and real brand / user / nav data.
 */

/* ------------------------------------------------------------ collapsible */

/**
 * Label/badge slot that blurs + fades + shrinks away as the rail collapses.
 * Icons and rows stay pinned — only these slots animate.
 */
export function Collapsible({
  collapsed,
  children,
  className,
}: {
  collapsed: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cx(
        "flex min-w-0 items-center overflow-hidden transition-[max-width,opacity,filter] duration-300 ease-in-out",
        collapsed ? "max-w-0 opacity-0 blur-[3px]" : "max-w-full opacity-100 blur-0",
        className,
      )}
    >
      {children}
    </span>
  );
}

/* ------------------------------------------------------------- brand mark */

const MARK_SIZE = { xs: "size-5", sm: "size-6", md: "size-8" } as const;

/** The brand's mark: `brand.logo` in a fixed box, else an initials avatar. */
export function ShellBrandMark({
  brand,
  size = "md",
  className,
}: {
  brand: ShellBrand;
  size?: keyof typeof MARK_SIZE;
  className?: string;
}) {
  if (brand.logo) {
    return (
      <span
        aria-hidden
        className={cx(
          "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full [&>img]:size-full [&>img]:object-cover [&>svg]:size-full",
          MARK_SIZE[size],
          className,
        )}
      >
        {brand.logo}
      </span>
    );
  }
  return <Avatar size={size} color="blue" initials={initialsOf(brand.name)} aria-hidden className={className} />;
}

/* ---------------------------------------------------------------- nav row */

/** One sidebar row: the DashboardSidebar `NavItem` recipe on a router `Link`. */
export function ShellNavRow({
  item,
  isSelected,
  collapsed = false,
  onNavigate,
}: {
  item: ShellNavItem;
  isSelected: boolean;
  collapsed?: boolean;
  /** Fired on click (the drawers close themselves with it). */
  onNavigate?: () => void;
}) {
  const Icon = item.icon;
  return (
    <Link
      to={item.path}
      onClick={onNavigate}
      aria-current={isSelected ? "page" : undefined}
      aria-label={item.label}
      title={collapsed ? item.label : undefined}
      className={cx(
        "flex items-center justify-between overflow-hidden rounded-2lg p-2 outline-none",
        "transition-[width,background-color] duration-300 ease-in-out",
        "focus-visible:ring-2 focus-visible:ring-border-focus-ring",
        collapsed ? "w-9" : "w-full",
        isSelected
          ? "bg-linear-to-b from-accent-500 to-accent-600 shadow-nav-selected"
          : "hover:bg-background-secondary-hover",
      )}
    >
      <span className="flex min-w-0 items-center gap-2">
        <Icon
          className={cx("size-5 shrink-0", isSelected ? "text-text-white" : "text-foreground-icon-secondary")}
          aria-hidden
        />
        <Collapsible collapsed={collapsed}>
          <span
            className={cx(
              "text-body-medium whitespace-nowrap",
              isSelected ? "text-text-white" : "text-text-secondary",
            )}
          >
            {item.label}
          </span>
        </Collapsible>
      </span>
      {item.badge !== undefined ? (
        <Collapsible collapsed={collapsed}>
          <Badge color={isSelected ? "primary" : "neutral"}>{item.badge}</Badge>
        </Collapsible>
      ) : null}
    </Link>
  );
}

/* -------------------------------------------------------------- user menu */

function UserIdentity({ user, className }: { user: ShellUser; className?: string }) {
  return (
    <span className={cx("flex min-w-0 flex-col items-start justify-center", className)}>
      <span className="max-w-full truncate text-body-medium text-text-primary">{user.name}</span>
      {user.email ? (
        <span className="max-w-full truncate text-body-regular text-text-secondary">{user.email}</span>
      ) : null}
    </span>
  );
}

function UserAvatar({ user, className }: { user: ShellUser; className?: string }) {
  return (
    <Avatar
      size="md"
      color="neutral"
      src={user.avatarUrl}
      alt=""
      initials={initialsOf(user.name)}
      className={className}
    />
  );
}

export interface ShellUserMenuProps {
  user: ShellUser;
  /** `sidebar` = the team-card trigger (full row, collapses to the avatar); `topbar` = avatar + name pill. */
  variant?: "sidebar" | "topbar";
  collapsed?: boolean;
  /** Where the menu opens relative to the trigger. */
  placement?: DropdownPopoverProps["placement"];
  className?: string;
}

/**
 * Account trigger + menu (name/email header, destructive Sign out). Without
 * `onSignOut` there is nothing to do, so it renders as a static identity card.
 */
export function ShellUserMenu({
  user,
  variant = "sidebar",
  collapsed = false,
  placement = "right bottom",
  className,
}: ShellUserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const interactive = Boolean(user.onSignOut);

  const sidebarTriggerClass = cx(
    "flex items-center overflow-hidden outline-none",
    "border-2 border-transparent",
    "transition-[width,background-color,border-color,padding] duration-300 ease-in-out",
    collapsed
      ? "size-9 justify-center rounded-full bg-transparent p-0"
      : "w-full justify-between rounded-xl bg-background-tertiary-default py-2 pr-4 pl-2.5",
    interactive && "cursor-pointer hover:border-border-button-hover focus-visible:ring-2 focus-visible:ring-border-focus-ring focus-visible:ring-offset-2",
    className,
  );

  const sidebarTriggerContent = (
    <>
      <span className="flex min-w-0 items-center gap-2">
        <UserAvatar user={user} />
        <Collapsible collapsed={collapsed}>
          <UserIdentity user={user} />
        </Collapsible>
      </span>
      {interactive ? (
        <Collapsible collapsed={collapsed}>
          <span className="flex size-4 shrink-0 items-center justify-center rounded-[3px] bg-background-tertiary-hover">
            <ChevronDownSmall
              className={cx("size-4 text-text-secondary transition-transform duration-200 ease", isOpen && "rotate-180")}
            />
          </span>
        </Collapsible>
      ) : null}
    </>
  );

  if (!interactive) {
    return (
      <div className={sidebarTriggerClass} title={collapsed ? user.name : undefined}>
        {sidebarTriggerContent}
      </div>
    );
  }

  return (
    <Dropdown isOpen={isOpen} onOpenChange={setIsOpen}>
      {variant === "topbar" ? (
        <DropdownTrigger
          aria-label={`Account: ${user.name}`}
          className={cx(
            "flex shrink-0 items-center gap-1.5 rounded-full p-0.5 sm:pr-2",
            "transition-colors duration-150 ease hover:bg-background-primary-hover",
            "focus-visible:ring-offset-2",
            className,
          )}
        >
          <UserAvatar user={user} />
          <span className="hidden max-w-32 truncate text-body-medium text-text-primary sm:inline">{user.name}</span>
          <ChevronDownSmall
            className={cx(
              "hidden size-4 shrink-0 text-foreground-icon-tertiary transition-transform duration-200 ease sm:block",
              isOpen && "rotate-180",
            )}
          />
        </DropdownTrigger>
      ) : (
        <DropdownTrigger aria-label={`Account: ${user.name}`} className={sidebarTriggerClass}>
          {sidebarTriggerContent}
        </DropdownTrigger>
      )}

      <DropdownPopover aria-label="Account menu" placement={placement} offset={8} dialogClassName="gap-[7px]">
        <div className="flex w-full items-center gap-2 px-2 pt-1">
          <UserAvatar user={user} />
          <UserIdentity user={user} />
        </div>
        <DropdownDivider />
        <DropdownGroup>
          <DropdownItem
            className="text-text-error-primary"
            onSelect={() => {
              setIsOpen(false);
              user.onSignOut?.();
            }}
          >
            <RiLogoutBoxRLine className="size-5 shrink-0" aria-hidden />
            <span className="text-body-medium">Sign out</span>
          </DropdownItem>
        </DropdownGroup>
      </DropdownPopover>
    </Dropdown>
  );
}

/* ---------------------------------------------------------- sidebar panel */

export interface ShellSidebarProps {
  brand: ShellBrand;
  nav: ShellNavItem[];
  secondaryNav?: ShellNavItem[];
  user?: ShellUser;
  /** Collapsed 60px icon rail (desktop only). */
  collapsed?: boolean;
  onToggleCollapsed?: () => void;
  /** Rendered inside the phone drawer: always expanded, close control instead of collapse. */
  mobile?: boolean;
  onClose?: () => void;
  /** Fired when a nav row is clicked (drawers close on it). */
  onNavigate?: () => void;
  className?: string;
}

/**
 * The sidebar panel: brand + collapse control, primary rows, then theme
 * toggle, secondary rows and the account card pinned to the bottom. Desktop
 * renders it as the floating rail; the shells' phone drawer renders it
 * `mobile` inside a `Sheet` that supplies the panel surface.
 */
export function ShellSidebar({
  brand,
  nav,
  secondaryNav,
  user,
  collapsed: collapsedProp = false,
  onToggleCollapsed,
  mobile = false,
  onClose,
  onNavigate,
  className,
}: ShellSidebarProps) {
  const collapsed = mobile ? false : collapsedProp;
  const active = useActiveNavItem(nav, secondaryNav);
  const navClass = cx("flex w-full flex-col gap-1", !collapsed && "px-0.5");

  return (
    <aside
      className={cx(
        "flex h-full shrink-0 flex-col justify-between overflow-hidden",
        "transition-[width] duration-300 ease-in-out",
        mobile
          ? "w-full p-3"
          : cx(
              "rounded-3xl border border-border-button-white bg-background-secondary-default shadow-sidebar",
              // Collapsed rail keeps the 60px spec: 1px border + 11px padding
              // per side leaves exactly 36px for the w-9 icon rows.
              collapsed ? "w-[60px] px-[11px] py-3" : "w-[260px] p-3",
            ),
        className,
      )}
    >
      {/* Padding + matching negative margin give focus rings and the
          selected row's 1px ring room inside the scroller's clip. */}
      <div className="-m-2 flex min-h-0 w-[calc(100%+16px)] flex-col gap-3 overflow-y-auto p-2 [scrollbar-width:none]">
        <div
          className={cx(
            "flex w-full transition-[gap] duration-300 ease-in-out",
            collapsed ? "flex-col-reverse items-center justify-center gap-2.5" : "flex-row items-center justify-between",
          )}
        >
          <div className={cx("flex min-w-0 items-center gap-2", collapsed ? "w-9 justify-center" : "overflow-hidden")}>
            <ShellBrandMark brand={brand} />
            <Collapsible collapsed={collapsed}>
              <span className="flex min-w-0 flex-col items-start justify-center">
                <span className="max-w-full truncate text-body-medium text-text-primary">{brand.name}</span>
                {brand.subtitle ? (
                  <span className="max-w-full truncate text-body-regular text-text-secondary">{brand.subtitle}</span>
                ) : null}
              </span>
            </Collapsible>
          </div>
          {mobile ? (
            <button
              type="button"
              aria-label="Close navigation"
              onClick={onClose}
              className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-2lg text-foreground-icon-secondary outline-none transition-colors duration-150 ease hover:bg-background-secondary-hover focus-visible:ring-2 focus-visible:ring-border-focus-ring"
            >
              <RiCloseLine className="size-5" aria-hidden />
            </button>
          ) : (
            <button
              type="button"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              aria-expanded={!collapsed}
              onClick={onToggleCollapsed}
              className={cx(
                "flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-2lg text-foreground-icon-secondary outline-none",
                "transition-colors duration-150 ease hover:bg-background-secondary-hover focus-visible:ring-2 focus-visible:ring-border-focus-ring",
              )}
            >
              <RiSideBarFill
                className={cx("size-5 transition-transform duration-300 ease-in-out", !collapsed && "-scale-x-100")}
                aria-hidden
              />
            </button>
          )}
        </div>

        <nav aria-label="Primary" className={navClass}>
          {nav.map((item) => (
            <ShellNavRow
              key={item.path}
              item={item}
              isSelected={active?.path === item.path}
              collapsed={collapsed}
              onNavigate={onNavigate}
            />
          ))}
        </nav>
      </div>

      <div className="flex w-full shrink-0 flex-col gap-3">
        {collapsed ? <ThemeToggle collapsed /> : <ThemeToggle appearance="sidebar-segmented" />}
        {secondaryNav?.length ? (
          <nav aria-label="Secondary" className={navClass}>
            {secondaryNav.map((item) => (
              <ShellNavRow
                key={item.path}
                item={item}
                isSelected={active?.path === item.path}
                collapsed={collapsed}
                onNavigate={onNavigate}
              />
            ))}
          </nav>
        ) : null}
        {user ? (
          <ShellUserMenu
            user={user}
            variant="sidebar"
            collapsed={collapsed}
            placement={mobile ? "top start" : "right bottom"}
          />
        ) : null}
      </div>
    </aside>
  );
}

/* ----------------------------------------------------------------- header */

/**
 * Default page header — DashboardHeader grammar: a real location trail
 * (home › section › here), then the title row with `actions` on the right.
 * The first crumb is the home *nav item*, not the product name (that's already
 * in the sidebar). `"/"` is never treated as a parent of sibling routes.
 */
export function ShellHeader({
  brand,
  nav,
  secondaryNav,
  actions,
  className,
}: {
  brand: ShellBrand;
  nav: ShellNavItem[];
  secondaryNav?: ShellNavItem[];
  actions?: ReactNode;
  className?: string;
}) {
  const { pathname } = useLocation();
  const items = [...nav, ...(secondaryNav ?? [])];
  const home = resolveHomeNavItem(items);
  const trail = resolveNavTrail(items, pathname);
  const current = trail.at(-1);
  const homePath = home ? normalizeNavPath(home.path) : "/";
  const onHome = Boolean(home && current && normalizeNavPath(current.path) === homePath);
  const ancestors = trail
    .slice(0, -1)
    .filter((item) => normalizeNavPath(item.path) !== homePath);

  return (
    <header className={cx("flex w-full flex-col gap-2", className)}>
      <Breadcrumb>
        {home ? (
          <BreadcrumbItem href={onHome ? undefined : home.path} current={onHome}>
            <ShellBrandMark brand={brand} size="xs" />
            {home.label}
          </BreadcrumbItem>
        ) : (
          <BreadcrumbItem current>
            <ShellBrandMark brand={brand} size="xs" />
            {brand.name}
          </BreadcrumbItem>
        )}
        {ancestors.map((item) => (
          <BreadcrumbItem key={item.path} href={item.path} icon={item.icon}>
            {item.label}
          </BreadcrumbItem>
        ))}
        {current && !onHome ? (
          <BreadcrumbItem current icon={current.icon}>
            {current.label}
          </BreadcrumbItem>
        ) : null}
      </Breadcrumb>
      <div className="flex w-full flex-wrap items-end justify-between gap-2">
        <h1 className="px-1 text-title-2-medium whitespace-nowrap text-text-primary">
          {current?.label ?? brand.name}
        </h1>
        {actions ? <div className="flex flex-wrap items-center justify-end gap-2.5">{actions}</div> : null}
      </div>
    </header>
  );
}
