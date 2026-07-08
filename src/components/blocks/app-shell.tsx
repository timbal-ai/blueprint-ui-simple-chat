import * as React from "react";
import type { IconComponent } from "@/components/icons";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

/**
 * AppShell — the canonical application frame: sidebar navigation + content.
 *
 * Compose screens INSIDE this shell; never hand-roll a rail, drawer, or
 * topbar. Two variants:
 *
 * - `variant="inset"` (the signature look): gray canvas, content floats as a
 *   flat white bordered card. No topbar by default — pages own their header.
 * - `variant="default"`: classic bordered sidebar + full-bleed content.
 *
 * Nav items may carry `children` (rendered as an indented sub-tree, like
 * Billing → Invoices). The `dock` slot is the sanctioned place for floating
 * chrome (e.g. the AI pill) — it reserves space instead of overlapping.
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
  /** Group heading, e.g. "General". Omit for an unlabeled group. */
  label?: string;
  items: AppShellNavItem[];
}

function AppShell({
  brand,
  nav,
  activeId,
  onNavigate,
  footer,
  topbar,
  dock,
  variant = "inset",
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
  /** Optional sticky topbar (title, breadcrumbs, actions). Omit for inset pages that own their header. */
  topbar?: React.ReactNode;
  /** Floating chrome docked bottom-right (AI pill). Reserved, never overlapping. */
  dock?: React.ReactNode;
  variant?: "default" | "inset";
  /** Forwarded to SidebarProvider — bound the shell's height for embeds/demos. */
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider className={className}>
      <Sidebar collapsible="icon" variant={variant === "inset" ? "inset" : "sidebar"}>
        {/* Header row: brand + always-visible collapse toggle (the reference
            keeps the toggle at the brand row's end, not in a topbar). */}
        <SidebarHeader>
          <div className="flex items-center justify-between gap-2 group-data-[collapsible=icon]:justify-center">
            <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
              {brand}
            </div>
            <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
          </div>
        </SidebarHeader>
        <SidebarContent>
          <ShellNav nav={nav} activeId={activeId} onNavigate={onNavigate} />
        </SidebarContent>
        {footer ? <SidebarFooter>{footer}</SidebarFooter> : null}
      </Sidebar>
      <SidebarInset>
        {topbar ? (
          <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 border-b border-border bg-background/80 px-4 backdrop-blur">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-1 h-4" />
            <div className="flex min-w-0 flex-1 items-center gap-2">{topbar}</div>
          </header>
        ) : null}
        {!topbar ? (
          // No topbar → mobile gets its own brand bar: the sidebar opener is
          // RELATIVE (in flow, never floating over titles) next to the brand.
          <div className="relative flex h-12 shrink-0 items-center gap-1 border-b border-border px-2 md:hidden">
            <SidebarTrigger />
            <div className="flex min-w-0 flex-1 items-center">{brand}</div>
          </div>
        ) : null}
        <div className={cn("relative flex min-h-0 flex-1 flex-col", dock && "pb-16")}>
          {children}
          {dock ? (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 flex justify-end p-4">
              <div className="pointer-events-auto">{dock}</div>
            </div>
          ) : null}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

/**
 * Nav tree. Lives inside the provider so it can reach the sidebar context:
 * on MOBILE, tapping any entry closes the drawer automatically — the user
 * should land on the page, not on the still-open sheet.
 */
function ShellNav({
  nav,
  activeId,
  onNavigate,
}: {
  nav: AppShellNavGroup[];
  activeId?: string;
  onNavigate?: (id: string) => void;
}) {
  const { isMobile, setOpenMobile } = useSidebar();
  const navigate = (id: string) => {
    if (isMobile) setOpenMobile(false);
    onNavigate?.(id);
  };

  return (
    <>
      {nav.map((group, gi) => (
        <SidebarGroup key={group.label ?? gi}>
          {group.label ? (
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
          ) : null}
          <SidebarGroupContent>
            <SidebarMenu>
              {group.items.map((item) => {
                const childActive = item.children?.some((c) => c.id === activeId);
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      isActive={item.id === activeId || childActive}
                      onClick={() => navigate(item.id)}
                      tooltip={item.label}
                    >
                      {item.icon ? <item.icon /> : null}
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                    {item.badge != null ? (
                      <SidebarMenuBadge>
                        <Badge variant="secondary" className="h-5 min-w-5 px-1.5">
                          {item.badge}
                        </Badge>
                      </SidebarMenuBadge>
                    ) : null}
                    {item.children?.length ? (
                      <SidebarMenuSub>
                        {item.children.map((child) => (
                          <SidebarMenuSubItem key={child.id}>
                            <SidebarMenuSubButton
                              isActive={child.id === activeId}
                              onClick={() => navigate(child.id)}
                            >
                              <span>{child.label}</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    ) : null}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </>
  );
}

export { AppShell };
export type { AppShellNavGroup, AppShellNavItem };
