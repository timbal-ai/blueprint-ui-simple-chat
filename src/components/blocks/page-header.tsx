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
  /** Small slot above the title — breadcrumbs, a back link, a badge. */
  eyebrow?: React.ReactNode;
  /** Right-aligned cluster — primary action last. */
  actions?: React.ReactNode;
  /** Rendered flush under the header (e.g. a TabsList). */
  tabs?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-1">
          {eyebrow ? (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              {eyebrow}
            </div>
          ) : null}
          <h1 className="text-2xl font-medium tracking-tight text-foreground">
            {title}
          </h1>
          {description ? (
            <p className="max-w-prose text-sm text-muted-foreground">
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
