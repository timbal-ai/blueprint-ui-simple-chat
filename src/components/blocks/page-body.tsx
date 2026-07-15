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
        // `grow shrink-0` (NOT `flex-1`): inside the shell's scroll container
        // the default shrink collapses a long page to the viewport height, so
        // its content overflows the box and spills past the scroller's bottom
        // inset (pages end flush at the card edge). shrink-0 keeps the body
        // content-sized (the scroller scrolls it), grow still stretches short
        // pages to fill. Fill-style pages that inner-scroll (invoice review)
        // opt back into the capped height with `flex-1 shrink`.
        "flex min-h-0 grow shrink-0 flex-col gap-5 stagger-children",
        inset && PAGE_INSET_CLASS,
        className,
      )}
    >
      {children}
    </div>
  );
}

export { PageBody };
