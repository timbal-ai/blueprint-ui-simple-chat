"use client";

import { useState, type ReactNode } from "react";
import { RiMenuLine } from "@remixicon/react";
import { Link, Outlet } from "react-router-dom";
import { ThemeToggle } from "@/components/application/theme/theme-toggle";
import { Badge } from "@/components/base/badges/badge";
import { IconButton } from "@/components/base/buttons/icon-button";
import { Sheet } from "@/components/timbal/overlays/sheet";
import { cx } from "@/utils/cx";
import { ShellBrandMark, ShellSidebar, ShellUserMenu } from "./shell-chrome";
import {
  SHELL_DESKTOP_QUERY,
  SHELL_FRAME_INSET_CLASS,
  SHELL_INSET_CLASS,
  useActiveNavItem,
  useMediaQuery,
  useShellUser,
  type ShellBrand,
  type ShellNavItem,
  type ShellUser,
} from "./shell-nav";

/**
 * TopbarShell — the frame for consumer / marketing-style products that
 * shouldn't all get a left rail: a sticky 56px bar (brand, inline nav pills,
 * `actions`, theme toggle, account menu) over a centred `max-w-6xl` column.
 *
 * Same contract as `SidebarShell` minus `secondaryNav`; mount it as a layout
 * route and render pages through `<Outlet />`. Below `md` the nav collapses
 * into a menu button that opens the same sidebar panel as a left drawer
 * (`Sheet`), closing on navigation.
 */

export interface TopbarShellProps {
  brand: ShellBrand;
  nav: ShellNavItem[];
  user?: ShellUser;
  /** Row above the page. Default: the active page's title; `false` hides it. */
  header?: ReactNode | false;
  /** Right side of the bar, before the theme toggle and account menu. */
  actions?: ReactNode;
  /** Floating chrome rendered once, e.g. `<AssistantPill />`. */
  dock?: ReactNode;
  /** Defaults to the router `<Outlet />`. */
  children?: ReactNode;
  className?: string;
}

function TopbarNavLink({ item, isSelected }: { item: ShellNavItem; isSelected: boolean }) {
  const Icon = item.icon;
  return (
    <Link
      to={item.path}
      aria-current={isSelected ? "page" : undefined}
      className={cx(
        "inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full px-3 text-body-medium whitespace-nowrap outline-none",
        "transition-colors duration-150 ease focus-visible:ring-2 focus-visible:ring-border-focus-ring",
        isSelected
          ? "bg-background-tertiary-default text-text-primary"
          : "text-text-secondary hover:bg-background-primary-hover hover:text-text-primary",
      )}
    >
      <Icon className="size-4 shrink-0" aria-hidden />
      {item.label}
      {item.badge !== undefined ? <Badge color="neutral">{item.badge}</Badge> : null}
    </Link>
  );
}

export function TopbarShell({ brand, nav, user, header, actions, dock, children, className }: TopbarShellProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const isDesktop = useMediaQuery(SHELL_DESKTOP_QUERY);
  const active = useActiveNavItem(nav);
  const resolvedUser = useShellUser(user);
  const homePath = nav[0]?.path ?? "/";
  const closeMenu = () => setMenuOpen(false);
  // A `bare` route (EmbeddedChat, canvases) owns its chrome: no header, no dock.
  const bare = active?.bare === true;

  return (
    <div className={cx("flex h-dvh w-full flex-col bg-background-full text-text-primary", className)}>
      <header className="flex h-14 shrink-0 items-center gap-2 border-b border-separator-border px-3 sm:gap-3 sm:px-6">
        <IconButton
          icon={RiMenuLine}
          size="small"
          aria-label="Open navigation"
          onClick={() => setMenuOpen(true)}
          className="md:hidden"
        />
        <Link
          to={homePath}
          className="flex min-w-0 items-center gap-2 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring focus-visible:ring-offset-2"
        >
          <ShellBrandMark brand={brand} />
          <span className="truncate text-body-medium text-text-primary">{brand.name}</span>
        </Link>

        <nav aria-label="Primary" className="ml-4 hidden min-w-0 items-center gap-1 overflow-x-auto md:flex">
          {nav.map((item) => (
            <TopbarNavLink key={item.path} item={item} isSelected={active?.path === item.path} />
          ))}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          {actions}
          <ThemeToggle appearance="segmented" className="hidden sm:inline-flex" />
          {resolvedUser ? <ShellUserMenu user={resolvedUser} variant="topbar" placement="bottom end" /> : null}
        </div>
      </header>

      {/* The ONLY scroller: pages scroll here, a min-h-0 page fills it. */}
      <main className="flex min-h-0 flex-1 flex-col overflow-y-auto overflow-x-hidden">
        <div
          className={cx(
            "mx-auto flex w-full flex-1 flex-col gap-4",
            bare ? SHELL_FRAME_INSET_CLASS : cx("max-w-6xl", SHELL_INSET_CLASS),
          )}
        >
          {header === false || bare
            ? null
            : (header ?? (active ? <h1 className="text-title-2-medium text-text-primary">{active.label}</h1> : null))}
          <div className="flex min-h-0 flex-1 flex-col">{children ?? <Outlet />}</div>
        </div>
      </main>

      {bare ? null : dock}

      <Sheet
        isOpen={menuOpen && !isDesktop}
        onOpenChange={setMenuOpen}
        side="left"
        size="sm"
        aria-label="Navigation"
        backdropClassName="bg-black/10"
        className="border-border-button-white bg-background-secondary-default shadow-sidebar"
      >
        <ShellSidebar brand={brand} nav={nav} user={resolvedUser} mobile onClose={closeMenu} onNavigate={closeMenu} />
      </Sheet>
    </div>
  );
}
