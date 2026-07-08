import * as React from "react";
import type { LucideIcon } from "lucide-react";

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
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

/**
 * AppShell — the canonical application frame: sidebar navigation + inset
 * content column with a sticky topbar.
 *
 * Compose screens INSIDE this shell; never hand-roll a rail, drawer, or
 * topbar. The sidebar collapses to icons on desktop and becomes a drawer on
 * mobile automatically (SidebarProvider owns that state). The `dock` slot is
 * the sanctioned place for floating chrome (e.g. the AI pill) — it reserves
 * space instead of overlapping content.
 */

interface AppShellNavItem {
  id: string;
  label: string;
  icon?: LucideIcon;
  /** Optional count/badge rendered at the row's end. */
  badge?: React.ReactNode;
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
  /** Topbar content next to the sidebar trigger — title, breadcrumbs, actions. */
  topbar?: React.ReactNode;
  /** Floating chrome docked bottom-right (AI pill). Reserved, never overlapping. */
  dock?: React.ReactNode;
  /** Forwarded to SidebarProvider — bound the shell's height for embeds/demos. */
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider className={className}>
      <Sidebar collapsible="icon">
        <SidebarHeader>{brand}</SidebarHeader>
        <SidebarContent>
          {nav.map((group, gi) => (
            <SidebarGroup key={group.label ?? gi}>
              {group.label ? (
                <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
              ) : null}
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        isActive={item.id === activeId}
                        onClick={() => onNavigate?.(item.id)}
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
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>
        {footer ? <SidebarFooter>{footer}</SidebarFooter> : null}
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 border-b border-border bg-background/80 px-4 backdrop-blur">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-1 h-4" />
          <div className="flex min-w-0 flex-1 items-center gap-2">{topbar}</div>
        </header>
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

export { AppShell };
export type { AppShellNavGroup, AppShellNavItem };
