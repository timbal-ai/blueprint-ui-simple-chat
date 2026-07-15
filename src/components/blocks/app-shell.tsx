import * as React from "react";
import { PanelLeftIcon, type IconComponent } from "@/components/icons";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/base/badges/badge";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { PAGE_INSET_CLASS } from "@/lib/page-inset";

/**
 * AppShell — the canonical application frame: sidebar navigation + content.
 *
 * Rebuilt on the BoardUI sidebar grammar (2026-07-14, fork of
 * `application/dashboard/dashboard-sidebar`): a floating rounded panel on the
 * gray canvas (white hairline border + the "Sidebar Elevation" shadow) that
 * morphs between 260px expanded and a 60px icon rail; the selected nav row
 * fills with the primary button gradient. Content renders as a white rounded
 * card beside it. On mobile the sidebar becomes a sheet drawer and the
 * content surface is plain white (house rule).
 *
 * Compose screens INSIDE this shell; never hand-roll a rail, drawer, or
 * topbar. Nav items may carry `children` (rendered as an indented sub-tree,
 * like Billing → Invoices). The `dock` slot is the sanctioned place for
 * floating chrome (e.g. the AI pill) — it reserves space instead of
 * overlapping.
 */

interface AppShellNavItem {
  id: string;
  label: string;
  icon?: IconComponent;
  /** Optional count/badge rendered at the row's end. */
  badge?: React.ReactNode;
  /** Sub-items rendered as an indented tree under this row. */
  children?: { id: string; label: string }[];
}

interface AppShellNavGroup {
  /** Group heading, e.g. "General" (or a node — label + chevron). Omit for an unlabeled group. */
  label?: React.ReactNode;
  items: AppShellNavItem[];
}

interface AppShellSidebarContextValue {
  isMobile: boolean;
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  openMobile: boolean;
  setOpenMobile: React.Dispatch<React.SetStateAction<boolean>>;
}

const AppShellSidebarContext =
  React.createContext<AppShellSidebarContextValue | null>(null);

/** Sidebar state for footer widgets (e.g. SidebarUser). Must render inside AppShell. */
function useAppShellSidebar() {
  const ctx = React.useContext(AppShellSidebarContext);
  if (!ctx) throw new Error("useAppShellSidebar must be used within AppShell");
  return ctx;
}

/**
 * Collapsible label/badge slot (BoardUI recipe): blurs + fades + shrinks away
 * when the rail closes. Icons/rows stay pinned — only these slots animate.
 */
function Collapsible({
  collapsed,
  children,
  className,
}: {
  collapsed: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "flex min-w-0 items-center overflow-hidden transition-[max-width,opacity,filter] duration-300 ease-in-out",
        collapsed ? "max-w-0 opacity-0 blur-[3px]" : "max-w-40 opacity-100 blur-0",
        className,
      )}
    >
      {children}
    </span>
  );
}

function AppShell({
  brand,
  nav,
  activeId,
  onNavigate,
  footer,
  topbar,
  dock,
  flush = false,
  className,
  children,
}: {
  /** Brand slot rendered in the sidebar header (mark + name). */
  brand: React.ReactNode;
  nav: AppShellNavGroup[];
  activeId?: string;
  onNavigate?: (id: string) => void;
  /** Sidebar footer slot — user menu, plan badge. */
  footer?: React.ReactNode;
  /** Optional sticky topbar (title, breadcrumbs, actions). Omit for pages that own their header. */
  topbar?: React.ReactNode;
  /** Floating chrome docked bottom-right (AI pill). Reserved, never overlapping. */
  dock?: React.ReactNode;
  /**
   * Skip the shell's default page inset (lateral + top/bottom breathing room).
   * Rare — only for pages that genuinely own edge-to-edge layout (canvas,
   * embedded chat with its own padding). Normal data pages must stay flush=false.
   */
  flush?: boolean;
  variant?: "default" | "inset";
  /** Merged onto the shell root — bound the shell's height for embeds/demos. */
  className?: string;
  children: React.ReactNode;
}) {
  const isMobile = useIsMobile();
  const [collapsed, setCollapsed] = React.useState(false);
  const [openMobile, setOpenMobile] = React.useState(false);

  const context = React.useMemo(
    () => ({ isMobile, collapsed: isMobile ? false : collapsed, setCollapsed, openMobile, setOpenMobile }),
    [isMobile, collapsed, openMobile],
  );

  const sidebarBody = (mobile: boolean) => (
    <SidebarPanelBody
      brand={brand}
      nav={nav}
      activeId={activeId}
      onNavigate={onNavigate}
      footer={footer}
      collapsed={mobile ? false : collapsed}
      mobile={mobile}
    />
  );

  return (
    <AppShellSidebarContext.Provider value={context}>
      <div
        className={cn(
          // Mobile: plain white surface. Desktop: BoardUI gray canvas with the
          // floating sidebar + white content card.
          "flex h-svh w-full min-h-0 flex-col bg-background-primary-default",
          "md:flex-row md:gap-3 md:bg-background-secondary-default md:p-3",
          className,
        )}
      >
        {/* Desktop sidebar — the floating BoardUI panel. */}
        <aside
          className={cn(
            "hidden shrink-0 flex-col justify-between overflow-hidden rounded-3xl md:flex",
            "border border-border-button-white bg-background-secondary-default shadow-sidebar",
            "transition-[width] duration-300 ease-in-out",
            // Collapsed rail keeps the 60px spec: 1px border + 11px padding on
            // each side leaves an exactly 36px column for the icon items.
            collapsed ? "w-[60px] px-[11px] py-3" : "w-[260px] p-3",
          )}
        >
          {sidebarBody(false)}
        </aside>

        {/* Mobile drawer + in-flow brand bar (opener never floats over titles). */}
        <Sheet open={openMobile} onOpenChange={setOpenMobile}>
          <div className="relative flex h-12 shrink-0 items-center gap-1 border-b border-border-button-default px-2 md:hidden">
            <SheetTrigger
              aria-label="Open sidebar"
              className="flex size-8 cursor-pointer items-center justify-center rounded-lg text-foreground-icon-secondary hover:bg-background-primary-hover"
            >
              <PanelLeftIcon className="size-4" />
            </SheetTrigger>
            <div className="flex min-w-0 flex-1 items-center">{brand}</div>
          </div>
          <SheetContent
            side="left"
            className="w-[280px] bg-background-secondary-default p-3"
          >
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            {sidebarBody(true)}
          </SheetContent>
        </Sheet>

        {/* Content card. */}
        <main
          className={cn(
            "flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-background-primary-default",
            "md:rounded-3xl md:border md:border-border-button-default md:shadow-card",
          )}
        >
          {topbar ? (
            <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 border-b border-border-button-default bg-background-primary-default/80 px-4 backdrop-blur">
              <div className="flex min-w-0 flex-1 items-center gap-2">{topbar}</div>
            </header>
          ) : null}
          <div
            className={cn(
              "relative flex min-h-0 flex-1 flex-col overflow-auto",
              !flush && PAGE_INSET_CLASS,
              dock && "pb-16",
            )}
          >
            {children}
            {dock ? (
              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 flex justify-end p-4">
                <div className="pointer-events-auto">{dock}</div>
              </div>
            ) : null}
          </div>
        </main>
      </div>
    </AppShellSidebarContext.Provider>
  );
}

/** Everything inside the sidebar panel — shared by the desktop rail and the mobile sheet. */
function SidebarPanelBody({
  brand,
  nav,
  activeId,
  onNavigate,
  footer,
  collapsed,
  mobile,
}: {
  brand: React.ReactNode;
  nav: AppShellNavGroup[];
  activeId?: string;
  onNavigate?: (id: string) => void;
  footer?: React.ReactNode;
  collapsed: boolean;
  mobile: boolean;
}) {
  const ctx = React.useContext(AppShellSidebarContext);
  const navigate = (id: string) => {
    if (mobile) ctx?.setOpenMobile(false);
    onNavigate?.(id);
  };

  return (
    <div className="flex h-full w-full flex-col gap-3">
      {/* Header row: brand + always-visible collapse toggle. */}
      <div
        className={cn(
          "flex w-full items-center gap-2 transition-[gap] duration-300 ease-in-out",
          collapsed ? "flex-col-reverse justify-center gap-2.5" : "flex-row justify-between",
        )}
      >
        <Collapsible collapsed={collapsed} className="min-w-0 flex-1">
          {brand}
        </Collapsible>
        {!mobile ? (
          <button
            type="button"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-expanded={!collapsed}
            onClick={() => ctx?.setCollapsed((c) => !c)}
            className={cn(
              "cursor-pointer text-foreground-icon-secondary transition-transform duration-300 ease-in-out hover:text-foreground-icon-primary",
              collapsed && "flex w-9 items-center justify-center",
            )}
          >
            <PanelLeftIcon className="size-4.5" aria-hidden />
          </button>
        ) : null}
      </div>

      {/* Nav groups — the ONLY scroll container in the panel. The brand row
          and footer stay in flow (never overlays); the scrollbar is hidden
          and a soft edge fade appears ONLY on the side that has rows scrolled
          out of view (no top fade at rest — it washed out the first group
          label; it fades in once you scroll down, and the bottom fade
          disappears when you reach the end). */}
      <NavScrollArea>
        {nav.map((group, gi) => (
          <div key={gi} className="flex w-full flex-col gap-1">
            {group.label ? (
              <Collapsible collapsed={collapsed}>
                <span className="px-2 pb-0.5 text-caption-1-medium whitespace-nowrap text-text-tertiary">
                  {group.label}
                </span>
              </Collapsible>
            ) : null}
            <nav className="flex w-full flex-col gap-1">
              {group.items.map((item) => {
                const childActive = item.children?.some((c) => c.id === activeId);
                const isSelected = item.id === activeId || childActive;
                return (
                  <React.Fragment key={item.id}>
                    <button
                      type="button"
                      aria-current={isSelected ? "page" : undefined}
                      aria-label={item.label}
                      title={collapsed ? item.label : undefined}
                      onClick={() => navigate(item.id)}
                      className={cn(
                        "flex cursor-pointer items-center justify-between overflow-hidden rounded-2lg p-2",
                        "outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring",
                        "transition-[width,background-color] duration-300 ease-in-out",
                        collapsed ? "w-9" : "w-full",
                        isSelected
                          ? "shadow-nav-selected [background-image:var(--gradient-button-primary-default)]"
                          : "hover:bg-background-secondary-hover",
                      )}
                    >
                      <span className="flex min-w-0 items-center gap-2">
                        {item.icon ? (
                          <item.icon
                            className={cn(
                              "size-4.5 shrink-0",
                              isSelected
                                ? "text-foreground-full"
                                : "text-foreground-icon-secondary",
                            )}
                            aria-hidden
                          />
                        ) : null}
                        <Collapsible collapsed={collapsed}>
                          <span
                            className={cn(
                              "text-body-medium whitespace-nowrap",
                              isSelected ? "text-foreground-full" : "text-text-secondary",
                            )}
                          >
                            {item.label}
                          </span>
                        </Collapsible>
                      </span>
                      {item.badge != null ? (
                        <Collapsible collapsed={collapsed}>
                          <Badge color={isSelected ? "primary" : "neutral"}>
                            {item.badge}
                          </Badge>
                        </Collapsible>
                      ) : null}
                    </button>
                    {item.children?.length && !collapsed ? (
                      <div className="flex w-full flex-col gap-0.5 py-0.5 pl-9">
                        {item.children.map((child) => {
                          const childSelected = child.id === activeId;
                          return (
                            <button
                              key={child.id}
                              type="button"
                              aria-current={childSelected ? "page" : undefined}
                              onClick={() => navigate(child.id)}
                              className={cn(
                                "flex w-full cursor-pointer items-center rounded-lg px-2 py-1.5 text-left",
                                "outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring",
                                "text-body-medium transition-colors",
                                childSelected
                                  ? "bg-background-tertiary-default text-text-primary"
                                  : "text-text-secondary hover:bg-background-secondary-hover hover:text-text-primary",
                              )}
                            >
                              {child.label}
                            </button>
                          );
                        })}
                      </div>
                    ) : null}
                  </React.Fragment>
                );
              })}
            </nav>
          </div>
        ))}
      </NavScrollArea>

      {footer ? <div className="flex w-full flex-col gap-1">{footer}</div> : null}
    </div>
  );
}

/**
 * Sidebar nav scroll container with scroll-aware edge fades: the 12px mask
 * fade only renders on an edge that has rows scrolled past it — flat at the
 * top until you scroll down, flat at the bottom once you've reached the end.
 */
function NavScrollArea({ children }: { children: React.ReactNode }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [edges, setEdges] = React.useState({ top: false, bottom: false });

  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      // 1px slack absorbs subpixel scroll positions at the extremes.
      const top = el.scrollTop > 1;
      const bottom = el.scrollTop + el.clientHeight < el.scrollHeight - 1;
      setEdges((prev) => (prev.top === top && prev.bottom === bottom ? prev : { top, bottom }));
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, []);

  const from = edges.top ? "transparent, black 12px" : "black";
  const to = edges.bottom ? "black calc(100% - 12px), transparent" : "black";
  const mask = `linear-gradient(to bottom, ${from}, ${to})`;

  return (
    <div
      ref={ref}
      style={{ maskImage: mask, WebkitMaskImage: mask }}
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto",
        "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
      )}
    >
      {children}
    </div>
  );
}

export { AppShell, useAppShellSidebar };
export type { AppShellNavGroup, AppShellNavItem };
