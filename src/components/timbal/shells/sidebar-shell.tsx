"use client";

import { useState, type ReactNode } from "react";
import { RiMenuLine } from "@remixicon/react";
import { Outlet } from "react-router-dom";
import { IconButton } from "@/components/base/buttons/icon-button";
import { Sheet } from "@/components/timbal/overlays/sheet";
import { cx } from "@/utils/cx";
import { ShellBrandMark, ShellHeader, ShellSidebar } from "./shell-chrome";
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
 * SidebarShell — the default multi-page app frame: BoardUI's floating
 * sidebar (dashboard-template grammar) driven by react-router, a header row
 * in the dashboard-header grammar, and the page through `<Outlet />`.
 *
 * Mount it ONCE as a layout route; nav `path`s ARE the routes:
 *
 * ```tsx
 * <Route element={<SidebarShell brand={{ name: "Acme" }} nav={NAV} dock={<AssistantPill />} />}>
 *   <Route index element={<OverviewPage />} />
 *   <Route path="/invoices" element={<InvoicesPage />} />
 *   <Route path="/chat" element={<EmbeddedChat />} />
 * </Route>
 * ```
 *
 * - Active row = longest nav path matching the URL (`end` = exact only).
 * - A `bare` nav item (EmbeddedChat, canvases) gets no header and no dock.
 * - `md+`: in-flow sidebar with the built-in collapse to a 60px icon rail.
 * - `< md`: a brand bar with an opener; the sidebar becomes a floating left
 *   drawer (`Sheet`: focus-trapped, Escape/outside-press) that closes on
 *   navigation.
 * - Content sits directly on `bg-background-full` like the templates (cards
 *   bring their own surface), centred to 1300px with `SHELL_INSET_CLASS`.
 *   `bare` routes get the 12px frame inset instead, so a `ChatFrame` lines up
 *   with the floating rail.
 * - The frame owns the viewport (`h-dvh`); the content column is the only
 *   scroller, so a page that is `flex-1 min-h-0` (EmbeddedChat) fills the
 *   remaining height with its composer pinned.
 * - `user` omitted → the Timbal session user (if signed in) with `logout`.
 */

export interface SidebarShellProps {
  brand: ShellBrand;
  nav: ShellNavItem[];
  /** Footer group (Support / Settings style), above the account card. */
  secondaryNav?: ShellNavItem[];
  user?: ShellUser;
  /** Header above the page. Default: breadcrumb + title + `actions`; `false` hides it. */
  header?: ReactNode | false;
  /** Right side of the default header (buttons). */
  actions?: ReactNode;
  /** Floating chrome rendered once, e.g. `<AssistantPill />`. */
  dock?: ReactNode;
  /** Defaults to the router `<Outlet />`. */
  children?: ReactNode;
  className?: string;
}

export function SidebarShell({
  brand,
  nav,
  secondaryNav,
  user,
  header,
  actions,
  dock,
  children,
  className,
}: SidebarShellProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isDesktop = useMediaQuery(SHELL_DESKTOP_QUERY);
  const active = useActiveNavItem(nav, secondaryNav);
  const resolvedUser = useShellUser(user);
  const closeDrawer = () => setDrawerOpen(false);
  // A `bare` route (EmbeddedChat, canvases) owns its chrome: no header, no dock.
  const bare = active?.bare === true;

  const sidebarProps = { brand, nav, secondaryNav, user: resolvedUser };

  return (
    <div className={cx("flex h-dvh w-full bg-background-full text-text-primary", className)}>
      {/* Desktop rail (in-flow, floating panel) */}
      <div className="hidden shrink-0 py-3 pl-3 md:block">
        <ShellSidebar
          {...sidebarProps}
          collapsed={collapsed}
          onToggleCollapsed={() => setCollapsed((value) => !value)}
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Phone brand bar with the drawer opener */}
        <div className="flex h-14 shrink-0 items-center gap-2.5 overflow-visible px-3 md:hidden">
          <IconButton icon={RiMenuLine} size="small" aria-label="Open navigation" onClick={() => setDrawerOpen(true)} className="shrink-0" />
          <ShellBrandMark brand={brand} className="shrink-0" />
          <span className="min-w-0 truncate text-body-medium text-text-primary">{brand.name}</span>
        </div>

        {/* The ONLY scroller: pages scroll here, a min-h-0 page fills it. */}
        <main className="flex min-h-0 flex-1 flex-col overflow-y-auto overflow-x-hidden">
          <div
            className={cx(
              "mx-auto flex w-full flex-1 flex-col gap-2.5",
              bare ? SHELL_FRAME_INSET_CLASS : cx("max-w-[1300px]", SHELL_INSET_CLASS),
            )}
          >
            {header === false || bare
              ? null
              : (header ?? <ShellHeader brand={brand} nav={nav} secondaryNav={secondaryNav} actions={actions} />)}
            <div className="flex min-h-0 flex-1 flex-col">{children ?? <Outlet />}</div>
          </div>
        </main>
      </div>

      {bare ? null : dock}

      <Sheet
        isOpen={drawerOpen && !isDesktop}
        onOpenChange={setDrawerOpen}
        side="left"
        size="sm"
        aria-label="Navigation"
        backdropClassName="bg-black/10"
        className="border-border-button-white bg-background-secondary-default shadow-sidebar"
      >
        <ShellSidebar {...sidebarProps} mobile onClose={closeDrawer} onNavigate={closeDrawer} />
      </Sheet>
    </div>
  );
}
