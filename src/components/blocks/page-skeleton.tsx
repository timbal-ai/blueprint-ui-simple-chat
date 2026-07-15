import { PageBody } from "@/components/blocks/page-body";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/**
 * Page-loading skeletons — **the house default for every loading state.**
 *
 * While a page's data (or its route chunk) loads, the screen shows a
 * skeleton of the page grammar it is about to render — NEVER text
 * placeholders ("…", "Loading…"), and never a bare spinner for page/section
 * content. Spinners are reserved for chat runtime bootstrap and inline
 * button-level actions.
 *
 * - `PageSkeleton` — a whole page while its data loads: header band →
 *   KPI tiles → table card. Also the Suspense fallback RoutedAppShell uses
 *   for lazy route chunks. Tune `stats`/`tableRows` to the page you're
 *   gating (0 hides a band).
 * - `PageHeaderSkeleton` / `StatGridSkeleton` / `TableSkeleton` /
 *   `CardSkeleton` — per-band pieces when only part of a page is async.
 *
 * Tables inside `FilteredTable` already skeleton themselves — pass its
 * `loading` prop instead of swapping the whole table out.
 */
function PageSkeleton({
  stats = 4,
  tableRows = 6,
  /** Standalone pages outside AppShell pass `inset` (mirrors PageBody). */
  inset = false,
  className,
}: {
  /** KPI tiles in the stat band — 0 hides the band. */
  stats?: number;
  /** Rows in the table-card skeleton — 0 hides the card. */
  tableRows?: number;
  inset?: boolean;
  className?: string;
}) {
  return (
    <PageBody inset={inset} className={className}>
      <div role="status" aria-label="Loading page" className="contents">
        <PageHeaderSkeleton />
        {stats > 0 ? <StatGridSkeleton count={stats} /> : null}
        {tableRows > 0 ? <TableSkeleton rows={tableRows} /> : null}
      </div>
    </PageBody>
  );
}

/** PageHeader-shaped placeholder: title + description left, action right. */
function PageHeaderSkeleton({
  action = true,
  className,
}: {
  action?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-start justify-between gap-3",
        className,
      )}
    >
      <div className="flex min-w-0 flex-col gap-2.5">
        <Skeleton className="h-7 w-52 max-w-full" />
        <Skeleton className="h-4 w-80 max-w-full" />
      </div>
      {action ? <Skeleton className="h-8 w-28 rounded-lg" /> : null}
    </div>
  );
}

/** One KPI tile placeholder in the two-layer Stat grammar (gray tile, white inner card). */
function StatSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn("flex flex-col gap-2 rounded-2xl bg-muted/70 p-2", className)}
    >
      <Skeleton className="mx-2 mt-1 h-4 w-24 bg-foreground/6" />
      <div className="flex flex-1 flex-col gap-2 rounded-xl border border-border/60 bg-card p-3.5">
        <Skeleton className="h-7 w-20" />
        <Skeleton className="h-3 w-28" />
      </div>
    </div>
  );
}

/** Responsive band of StatSkeleton tiles — mirrors StatGrid's breakpoints. */
function StatGridSkeleton({
  count = 4,
  className,
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4",
        className,
      )}
    >
      {Array.from({ length: count }).map((_, i) => (
        <StatSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * FilteredTable-card-shaped placeholder: count header + search pill,
 * muted header band, then text-line rows. For a table that is already
 * mounted prefer FilteredTable's `loading` prop.
 */
function TableSkeleton({
  rows = 6,
  className,
}: {
  rows?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex w-full min-w-0 flex-col gap-3 rounded-2xl border border-border-button-default bg-card p-3",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-3.5 w-20" />
          <Skeleton className="h-3.5 w-28" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="hidden h-9 w-28 rounded-lg sm:block" />
          <Skeleton className="h-9 w-36 rounded-full" />
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <Skeleton className="h-9 w-full rounded-lg" />
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-2 py-2.5">
            <Skeleton className="h-4 flex-2" />
            <Skeleton className="h-4 flex-3" />
            <Skeleton className="hidden h-4 flex-2 sm:block" />
            <Skeleton className="h-4 flex-1" />
          </div>
        ))}
      </div>
    </div>
  );
}

/** Fixed-height rounded slab for an async card/chart band (match the real card's height). */
function CardSkeleton({ className }: { className?: string }) {
  return <Skeleton className={cn("h-72 w-full rounded-2xl", className)} />;
}

export {
  CardSkeleton,
  PageHeaderSkeleton,
  PageSkeleton,
  StatGridSkeleton,
  StatSkeleton,
  TableSkeleton,
};
