import * as React from "react";

import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

/**
 * DetailPanel primitives — structured content for a record's detail surface
 * (the right column of ListDetailLayout, a Sheet, or a full page).
 *
 * `FieldList`/`Field` is a description list with a fixed label column so
 * values align; labels never truncate values. `ActivityFeed` is a compact
 * timeline. Compose them under a heading per section, separated by
 * `DetailSection`.
 */

function DetailSection({
  title,
  action,
  children,
  className,
}: {
  title: string;
  /** Optional inline action, e.g. an "Edit" ghost button. */
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("flex flex-col gap-3", className)}>
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-medium text-foreground">{title}</h3>
        {action}
      </div>
      {children}
    </section>
  );
}

/** Vertical list of label/value rows. */
function FieldList({ className, children }: React.ComponentProps<"dl">) {
  return <dl className={cn("flex flex-col gap-2.5", className)}>{children}</dl>;
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("grid grid-cols-[7rem_1fr] items-baseline gap-3", className)}>
      <dt className="truncate text-sm text-muted-foreground">{label}</dt>
      <dd className="min-w-0 text-sm break-words text-foreground">{children}</dd>
    </div>
  );
}

interface ActivityItem {
  id: string;
  /** Short event line, e.g. "Status changed to Paid". */
  title: React.ReactNode;
  /** Relative or absolute timestamp string. */
  timestamp: string;
  /** Optional avatar/icon slot (keep it size-6). */
  leading?: React.ReactNode;
}

/** Compact vertical timeline with a connecting rail. */
function ActivityFeed({
  items,
  className,
}: {
  items: ActivityItem[];
  className?: string;
}) {
  return (
    <ol className={cn("flex flex-col", className)}>
      {items.map((item, i) => (
        <li key={item.id} className="relative flex gap-3 pb-4 last:pb-0">
          {i < items.length - 1 ? (
            <span
              aria-hidden
              className="absolute top-6 left-3 h-[calc(100%-1.5rem)] w-px -translate-x-1/2 bg-border"
            />
          ) : null}
          <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-border bg-card text-muted-foreground [&_svg]:size-3.5">
            {item.leading ?? <span className="size-1.5 rounded-full bg-muted-foreground" />}
          </span>
          <div className="flex min-w-0 flex-col gap-0.5 pt-0.5">
            <span className="text-sm text-foreground">{item.title}</span>
            <span className="text-xs text-muted-foreground">{item.timestamp}</span>
          </div>
        </li>
      ))}
    </ol>
  );
}

/** Muted divider between DetailSections. */
function DetailDivider({ className }: { className?: string }) {
  return <Separator className={cn("my-1", className)} />;
}

/**
 * Compact record header for full-page detail routes (Stripe/Cloudflare
 * grammar): leading avatar/icon tile + title/subtitle + optional badge
 * cluster + right-aligned actions. Pair with MetadataGrid and Tabs.
 */
function RecordDetailHeader({
  leading,
  title,
  subtitle,
  badges,
  actions,
  className,
}: {
  leading?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  badges?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-start justify-between gap-3", className)}>
      <div className="flex min-w-0 flex-1 items-start gap-3">
        {leading}
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <h1 className="truncate text-lg font-medium tracking-tight text-foreground">
              {title}
            </h1>
            {badges}
          </div>
          {subtitle ? (
            <p className="truncate text-sm text-muted-foreground">{subtitle}</p>
          ) : null}
        </div>
      </div>
      {actions ? (
        <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>
      ) : null}
    </div>
  );
}

/** Dense label/value grid for record metadata (3-up on lg, 2-up on sm). */
function MetadataGrid({
  items,
  className,
}: {
  items: { label: string; value: React.ReactNode }[];
  className?: string;
}) {
  return (
    <dl className={cn("grid gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {items.map((item) => (
        <div key={item.label} className="flex min-w-0 flex-col gap-0.5">
          <dt className="text-xs text-muted-foreground">{item.label}</dt>
          <dd className="truncate text-sm font-medium text-foreground">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export {
  ActivityFeed,
  DetailDivider,
  DetailSection,
  Field,
  FieldList,
  MetadataGrid,
  RecordDetailHeader,
};
export type { ActivityItem };
