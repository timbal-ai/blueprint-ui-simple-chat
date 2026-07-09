import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Page scaffold — owns the content column, header row, and vertical rhythm.
 * Fork freely: width, padding, and header layout are deliberate per-app
 * decisions, not fixed chrome.
 *
 * Use on standalone routes only. Inside AppShell/RoutedAppShell the shell
 * already applies page inset — compose PageBody + PageHeader instead so
 * padding is not doubled.
 */
function Page({
  title,
  description,
  actions,
  width = "boxed",
  fill = false,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  title?: string;
  description?: string;
  /** Slot for page-scoped actions (buttons, filters) in the header row. */
  actions?: React.ReactNode;
  /** boxed = readable max width; wide = dashboards; full = edge to edge. */
  width?: "narrow" | "boxed" | "wide" | "full";
  /** Fill the viewport height (chat, canvas, split panes). */
  fill?: boolean;
}) {
  return (
    <div
      data-slot="page"
      className={cn(
        "mx-auto flex w-full flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8",
        width === "narrow" && "max-w-3xl",
        width === "boxed" && "max-w-6xl",
        width === "wide" && "max-w-[96rem]",
        fill && "min-h-0 flex-1",
        className,
      )}
      {...props}
    >
      {(title || actions) && (
        <header data-slot="page-header" className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex min-w-0 flex-col gap-1">
            {title ? (
              <h1 className="text-xl text-foreground">{title}</h1>
            ) : null}
            {description ? (
              <p className="text-sm text-muted-foreground">{description}</p>
            ) : null}
          </div>
          {actions ? (
            <div className="flex shrink-0 items-center gap-2">{actions}</div>
          ) : null}
        </header>
      )}
      {children}
    </div>
  );
}

/**
 * Titled content group inside a Page. Spacing separates sections — don't
 * wrap each one in a Card unless the surface itself carries meaning.
 */
function Section({
  title,
  description,
  actions,
  className,
  children,
  ...props
}: React.ComponentProps<"section"> & {
  title?: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <section
      data-slot="section"
      className={cn("flex flex-col gap-3", className)}
      {...props}
    >
      {(title || actions) && (
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex min-w-0 flex-col gap-0.5">
            {title ? (
              <h2 className="text-sm font-medium text-foreground">{title}</h2>
            ) : null}
            {description ? (
              <p className="text-sm text-muted-foreground">{description}</p>
            ) : null}
          </div>
          {actions ? (
            <div className="flex shrink-0 items-center gap-2">{actions}</div>
          ) : null}
        </div>
      )}
      {children}
    </section>
  );
}

export { Page, Section };
