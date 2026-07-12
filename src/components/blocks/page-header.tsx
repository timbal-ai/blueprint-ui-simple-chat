import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * PageHeader — the standard top-of-page band: eyebrow/breadcrumb slot,
 * title (medium weight — titles are never bold), description, and a
 * right-aligned actions cluster. Optional `tabs` slot renders flush under
 * the header for sectioned pages.
 *
 * Use on every screen instead of hand-rolling an h1 row, so page tops stay
 * identical across the app.
 */
function PageHeader({
  title,
  description,
  eyebrow,
  actions,
  tabs,
  className,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  /**
   * Slot above the title — breadcrumbs, a back link, a badge. Breadcrumb
   * rules: never start with the app/product name, and only render a trail
   * for nested paths (more than 2 levels) — at 1–2 levels the title alone
   * carries the location.
   */
  eyebrow?: React.ReactNode;
  /** Right-aligned cluster — primary action last. */
  actions?: React.ReactNode;
  /** Rendered flush under the header (e.g. a TabsList). */
  tabs?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col">
          {eyebrow ? (
            // Same text style as the description below the title.
            <div className="mb-2 flex items-center gap-1.5 text-sm text-muted-foreground">
              {eyebrow}
            </div>
          ) : null}
          {title ? (
            <h1 className="text-[1.6rem] leading-tight font-medium tracking-tight text-foreground">
              {title}
            </h1>
          ) : null}
          {description ? (
            <p className="mt-1.5 max-w-prose text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
        {actions ? (
          <div className="flex shrink-0 items-center gap-2">{actions}</div>
        ) : null}
      </div>
      {tabs}
    </div>
  );
}

export { PageHeader };
