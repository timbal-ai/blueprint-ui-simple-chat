import * as React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import {
  AppShell,
  type AppShellNavGroup,
} from "@/components/blocks/app-shell";
import { PageSkeleton } from "@/components/blocks/page-skeleton";

/**
 * RoutedAppShell — AppShell pre-wired to react-router. **The default frame
 * for every multi-page app.**
 *
 * The convention it enforces: **every page is a ROUTE, never a state-switched
 * view.** Nav item `id`s ARE route paths (`"/"`, `"/invoices"`,
 * `"/settings/billing"`); clicking navigates, the active row derives from the
 * URL (longest matching path wins, so `/settings/billing` lights up both the
 * parent and the child), and pages render through the router's `<Outlet />`.
 * Deep links, back/forward, and refresh all work for free — a `useState`
 * page-switcher gives you none of that and is a named mistake.
 *
 * Mount it once as a LAYOUT route and register one `<Route>` per page:
 *
 * ```tsx
 * <Route element={<RoutedAppShell brand={…} nav={NAV} footer={…} dock={<AssistantPill />} />}>
 *   <Route index element={<DashboardPage />} />
 *   <Route path="/invoices" element={<InvoicesPage />} />
 *   <Route path="/settings" element={<SettingsPage />} />
 * </Route>
 * ```
 *
 * All other AppShell props (brand, footer, topbar, dock, variant) pass
 * through unchanged. `children` (rarely needed) render after the `<Outlet />`
 * — e.g. shell-level chrome that isn't a page.
 */
function RoutedAppShell({
  nav,
  resolveActiveId,
  children,
  ...appShellProps
}: Omit<
  React.ComponentProps<typeof AppShell>,
  "activeId" | "onNavigate" | "children"
> & {
  /** Nav groups whose item `id`s are route paths (e.g. "/invoices"). */
  nav: AppShellNavGroup[];
  /** Override URL → active nav id (default: longest matching nav path). */
  resolveActiveId?: (pathname: string) => string | undefined;
  /** Optional extra shell-level chrome rendered after the routed page. */
  children?: React.ReactNode;
}) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const activeId = React.useMemo(() => {
    if (resolveActiveId) return resolveActiveId(pathname);
    const ids = nav.flatMap((group) =>
      group.items.flatMap((item) => [
        item.id,
        ...(item.children?.map((child) => child.id) ?? []),
      ]),
    );
    // Longest path that matches exactly or as a segment prefix, so
    // "/invoices/42" still lights up "/invoices" while "/" only matches home.
    return ids
      .filter(
        (id) =>
          pathname === id ||
          (id !== "/" && pathname.startsWith(id + "/")),
      )
      .sort((a, b) => b.length - a.length)[0];
  }, [nav, pathname, resolveActiveId]);

  return (
    <AppShell
      nav={nav}
      activeId={activeId}
      onNavigate={(id) => navigate(id)}
      {...appShellProps}
    >
      {/* Boundary INSIDE the shell: while a lazy page chunk loads, the
          sidebar + content card stay mounted and only the page area shows a
          page skeleton (skeletons are the house default for loading —
          never a spinner or "…" for page content). Without this boundary,
          the suspend bubbles to the route-level `Suspense fallback={null}`
          and the ENTIRE app goes blank — which reads as "this page is
          slow/broken" on every first visit. */}
      <React.Suspense fallback={<PageSkeleton />}>
        <Outlet />
      </React.Suspense>
      {children}
    </AppShell>
  );
}

export { RoutedAppShell };
