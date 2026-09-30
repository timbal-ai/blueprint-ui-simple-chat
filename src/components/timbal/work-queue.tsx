"use client";

import { useState, type ComponentType, type ReactNode } from "react";
import {
  RiArrowRightSLine,
  RiCheckDoubleLine,
  RiErrorWarningLine,
} from "@remixicon/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/base/badges/badge";
import { Chip, type ChipProps } from "@/components/base/badges/chip";
import { Button } from "@/components/base/buttons/button";
import { cx } from "@/utils/cx";

/**
 * WorkQueue — the home screen of a product with several modules (CRM, ERP,
 * fleet, audit, back office): what needs the user now, across every module,
 * as rows they can act on. It replaces the stat-tile strip: every KPI tile
 * is a filter ("3 overdue invoices"), so list the rows it would have counted
 * and give each one its verb.
 *
 * ```tsx
 * <PageHeader description="3 invoices overdue · 2 items below reorder" />
 * <WorkQueue
 *   aria-label="Needs attention"
 *   groups={[
 *     {
 *       id: "invoices",
 *       label: "Overdue invoices",
 *       summary: "$11,119.30",
 *       href: "/invoices?status=overdue",
 *       items: overdue.map((inv) => ({
 *         id: inv.id,
 *         icon: RiBillLine,
 *         title: `${inv.number} · ${inv.customer}`,
 *         meta: `Due ${inv.due}`,
 *         aside: inv.amount,
 *         status: { label: `${inv.daysLate} d late`, color: "rose" },
 *         action: { label: "Send reminder", onPress: () => remind(inv) },
 *         onOpen: () => setOpenInvoice(inv),
 *       })),
 *     },
 *   ]}
 * />
 * ```
 *
 * Progressive by default: each group shows `initialVisible` rows and a
 * "Show N more" row; `href` adds "View all" to the module's own list; empty
 * groups are not rendered (no "0" rows); the record opens in a `Sheet` from
 * `onOpen`, so detail stays one click away instead of on the page.
 * Order groups by urgency — the first group is what the user does first.
 */

type IconComponent = ComponentType<{ className?: string; "aria-hidden"?: boolean | "true" | "false" }>;

export interface WorkQueueItem {
  id: string;
  /** One line: the record and who it is about ("INV-2041 · Brightline"). */
  title: ReactNode;
  /** One secondary line: the fact that makes it need attention. */
  meta?: ReactNode;
  /** Remix `Line` icon for the record type, drawn in a neutral tile. */
  icon?: IconComponent;
  /** Right-aligned value: an amount, a due time. */
  aside?: ReactNode;
  status?: { label: string; color: NonNullable<ChipProps["color"]> };
  /** The one verb for this row. Anything else lives in the record's Sheet. */
  action?: { label: string; icon?: IconComponent; onPress: () => void };
  /** Row click: open the record (a `Sheet`, or navigate to its route). */
  onOpen?: () => void;
}

export interface WorkQueueGroup {
  id: string;
  /** What the rows have in common, as a task ("Overdue invoices"). */
  label: string;
  /** Short aggregate next to the count ("$11,119.30"). */
  summary?: ReactNode;
  items: WorkQueueItem[];
  /** Size of the full list when `items` is only its first page. */
  total?: number;
  /** The module's list, filtered to this group. Renders "View all". */
  href?: string;
}

export interface WorkQueueProps {
  groups: WorkQueueGroup[];
  "aria-label": string;
  /** Rows per group before "Show N more". */
  initialVisible?: number;
  loading?: boolean;
  /** Renders the error state in place of the queue. */
  error?: { message: string; onRetry?: () => void } | null;
  /** Shown when every group is empty. */
  empty?: { title: string; description?: string; action?: ReactNode };
  className?: string;
}

const ROW_ENTER = { duration: 0.4, ease: [0.22, 1, 0.36, 1] } as const;
const ROW_EXIT = { duration: 0.225, ease: "easeIn" } as const;

function QueueState({
  icon: Icon,
  iconClassName,
  title,
  description,
  action,
}: {
  icon: IconComponent;
  iconClassName?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl bg-background-primary-default px-4 py-10 text-center">
      <span className="flex size-9 items-center justify-center rounded-lg bg-background-tertiary-default">
        <Icon className={cx("size-5 text-foreground-icon-secondary", iconClassName)} aria-hidden />
      </span>
      <div className="flex flex-col gap-0.5">
        <p className="text-body-medium text-text-primary">{title}</p>
        {description ? <p className="text-body-regular text-text-secondary">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

function QueueSkeleton() {
  return (
    <div aria-hidden className="flex flex-col gap-1">
      {[3, 2].map((rows, g) => (
        <div key={g} className="flex flex-col">
          <div className="flex items-center gap-2 px-3 pt-2.5 pb-2">
            <span className="h-3 w-28 animate-pulse rounded-md bg-background-tertiary-default" />
            <span className="h-3 w-6 animate-pulse rounded-md bg-background-tertiary-default" />
          </div>
          <div className="flex flex-col divide-y rounded-2xl bg-background-primary-default">
            {Array.from({ length: rows }, (_, r) => (
              <div key={r} className="flex items-center gap-3 px-3 py-2.5">
                <span className="size-8 shrink-0 animate-pulse rounded-lg bg-background-tertiary-default" />
                <span className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <span className="h-3 w-2/5 animate-pulse rounded-md bg-background-tertiary-default" />
                  <span className="h-2.5 w-3/5 animate-pulse rounded-md bg-background-tertiary-default" />
                </span>
                <span className="hidden h-7 w-24 animate-pulse rounded-lg bg-background-tertiary-default sm:block" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function QueueRow({ item }: { item: WorkQueueItem }) {
  const Icon = item.icon;
  const ActionIcon = item.action?.icon;
  return (
    <div
      className={cx(
        "relative flex flex-wrap items-center gap-x-3 gap-y-2 px-3 py-2.5",
        item.onOpen && "transition-colors duration-150 ease hover:bg-background-primary-hover",
      )}
    >
      {Icon ? (
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-background-secondary-default">
          <Icon className="size-4 text-foreground-icon-secondary" aria-hidden />
        </span>
      ) : null}
      <div className="flex min-w-0 flex-1 basis-40 flex-col gap-0.5">
        {item.onOpen ? (
          // Stretched button: the whole row opens the record, while the
          // action button (raised above the overlay) stays its own target.
          <button
            type="button"
            onClick={item.onOpen}
            className="cursor-pointer truncate text-left text-body-medium text-text-primary outline-none after:absolute after:inset-0 focus-visible:after:ring-2 focus-visible:after:ring-border-focus-ring focus-visible:after:ring-inset"
          >
            {item.title}
          </button>
        ) : (
          <p className="truncate text-body-medium text-text-primary">{item.title}</p>
        )}
        {item.meta ? <p className="truncate text-body-regular text-text-secondary">{item.meta}</p> : null}
      </div>
      <div className="relative z-10 ml-auto flex shrink-0 items-center gap-2.5">
        {item.status ? (
          <Chip variant="bold" color={item.status.color}>
            {item.status.label}
          </Chip>
        ) : null}
        {item.aside ? (
          <span className="text-body-medium whitespace-nowrap text-text-primary tabular-nums">{item.aside}</span>
        ) : null}
        {item.action ? (
          <Button size="small" variant="secondary" leadingIcon={ActionIcon} onClick={item.action.onPress}>
            {item.action.label}
          </Button>
        ) : null}
        {item.onOpen ? (
          <RiArrowRightSLine className="pointer-events-none size-4 text-foreground-icon-tertiary" aria-hidden />
        ) : null}
      </div>
    </div>
  );
}

function QueueGroup({ group, initialVisible }: { group: WorkQueueGroup; initialVisible: number }) {
  const [expanded, setExpanded] = useState(false);
  const reduceMotion = useReducedMotion();
  const count = group.total ?? group.items.length;
  const visible = expanded ? group.items : group.items.slice(0, initialVisible);
  const hidden = group.items.length - initialVisible;
  const headingId = `work-queue-${group.id}`;

  return (
    <section aria-labelledby={headingId} className="flex flex-col">
      <div className="flex min-w-0 items-center gap-2 px-3 pt-2.5 pb-2">
        <h2 id={headingId} className="truncate text-body-medium text-text-primary">
          {group.label}
        </h2>
        <Badge color="neutral">{count}</Badge>
        {group.summary ? (
          <span className="truncate text-body-regular text-text-secondary tabular-nums">{group.summary}</span>
        ) : null}
        {group.href ? (
          <Link
            to={group.href}
            className="ml-auto shrink-0 rounded-md text-body-medium text-text-secondary outline-none transition-colors duration-150 ease hover:text-text-primary focus-visible:ring-2 focus-visible:ring-border-focus-ring"
          >
            View all
          </Link>
        ) : null}
      </div>
      <div className="flex flex-col divide-y overflow-hidden rounded-2xl bg-background-primary-default">
        <AnimatePresence initial={false}>
          {visible.map((item) => (
            <motion.div
              key={item.id}
              initial={reduceMotion ? false : { opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto", transition: ROW_ENTER }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, height: 0, transition: ROW_EXIT }}
            >
              <QueueRow item={item} />
            </motion.div>
          ))}
        </AnimatePresence>
        {hidden > 0 ? (
          <button
            type="button"
            aria-expanded={expanded}
            onClick={() => setExpanded((value) => !value)}
            className="cursor-pointer px-3 py-2 text-left text-body-medium text-text-secondary outline-none transition-colors duration-150 ease hover:bg-background-primary-hover hover:text-text-primary focus-visible:ring-2 focus-visible:ring-border-focus-ring focus-visible:ring-inset"
          >
            {expanded ? "Show less" : `Show ${hidden} more`}
          </button>
        ) : null}
      </div>
    </section>
  );
}

export function WorkQueue({
  groups,
  "aria-label": ariaLabel,
  initialVisible = 3,
  loading = false,
  error = null,
  empty,
  className,
}: WorkQueueProps) {
  const open = groups.filter((group) => group.items.length > 0);

  let body: ReactNode;
  if (loading) {
    body = <QueueSkeleton />;
  } else if (error) {
    body = (
      <QueueState
        icon={RiErrorWarningLine}
        iconClassName="text-foreground-icon-error"
        title="Couldn't load what needs attention"
        description={error.message}
        action={
          error.onRetry ? (
            <Button size="small" variant="secondary" onClick={error.onRetry}>
              Retry
            </Button>
          ) : undefined
        }
      />
    );
  } else if (open.length === 0) {
    body = (
      <QueueState
        icon={RiCheckDoubleLine}
        title={empty?.title ?? "Nothing needs you right now"}
        description={empty?.description ?? "New items land here as soon as they need an action."}
        action={empty?.action}
      />
    );
  } else {
    body = (
      <div className="flex flex-col gap-1">
        {open.map((group) => (
          <QueueGroup key={group.id} group={group} initialVisible={initialVisible} />
        ))}
      </div>
    );
  }

  return (
    <div
      role="region"
      aria-label={ariaLabel}
      aria-busy={loading || undefined}
      className={cx("w-full rounded-3xl bg-background-secondary-default p-1", className)}
    >
      {body}
    </div>
  );
}
