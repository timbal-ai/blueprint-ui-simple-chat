import * as React from "react";

import { PAGE_INSET_CLASS } from "@/lib/page-inset";
import { cn } from "@/lib/utils";

/**
 * PageBody — vertical rhythm for a routed page's main column.
 *
 * Inside `AppShell` / `RoutedAppShell` the shell already owns lateral + top/bottom
 * inset — pass `inset={false}` (default) and only get the gap/scroll/fade.
 *
 * Standalone pages (no shell — centered forms, auth, marketing) MUST pass
 * `inset` so content never runs flush to the viewport/card edge.
 *
 * Entrance: direct children cascade in (40ms stagger, strong ease-out,
 * capped at 200ms) instead of one monolithic fade — header lands first,
 * then stats, then the table. Decorative only; never blocks interaction,
 * and reduced-motion collapses it to a pure fade.
 */
function PageBody({
  inset = false,
  className,
  children,
}: {
  /** When true, apply PAGE_INSET_CLASS (required outside AppShell). */
  inset?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      data-slot="page-body"
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-5 stagger-children",
        inset && PAGE_INSET_CLASS,
        className,
      )}
    >
      {children}
    </div>
  );
}

export { PageBody };
