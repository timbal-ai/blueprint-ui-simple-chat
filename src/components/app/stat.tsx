import * as React from "react";
import { TrendingDownIcon, TrendingUpIcon } from "@/components/icons";

import { cn } from "@/lib/utils";
import { Chip } from "@/components/base/badges/chip";

/**
 * Single KPI tile — the "Total Employee / New Hires" reference grammar:
 * a soft GRAY outer tile carries the label row (+ optional action), and the
 * value lives on an inner WHITE card that floats above it with a small
 * shadow. Large NOT-bold value, vibrant delta badge beside it, muted
 * caption underneath. Hierarchy comes from size and tone, never weight.
 */
function Stat({
  label,
  value,
  delta,
  deltaTone = "neutral",
  hint,
  action,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  label: string;
  value: React.ReactNode;
  /** Change indicator, e.g. "20%". Rendered as a tonal badge with a trend arrow. */
  delta?: string;
  deltaTone?: "positive" | "negative" | "neutral";
  /** Secondary context under the value, e.g. "Compared to the previous period". */
  hint?: string;
  /** Optional trailing header action (menu dots, info tooltip). */
  action?: React.ReactNode;
}) {
  return (
    <div
      data-slot="stat"
      className={cn(
        "flex flex-col gap-2 rounded-2xl bg-muted/70 p-2",
        className,
      )}
      {...props}
    >
      <div className="flex items-center justify-between gap-2 px-2 pt-1">
        <span className="truncate text-sm text-foreground/80">{label}</span>
        {action}
      </div>
      <div className="flex flex-1 flex-col gap-1 rounded-xl border border-border/60 bg-card p-3.5 shadow-[0_1px_2px_0_color-mix(in_srgb,black_6%,transparent),0_2px_6px_-2px_color-mix(in_srgb,black_8%,transparent)]">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[1.7rem] leading-none font-medium tracking-tight tabular-nums text-foreground">
            {value}
          </span>
          {delta ? (
            <Chip
              variant="caption"
              color={
                deltaTone === "positive"
                  ? "lime"
                  : deltaTone === "negative"
                    ? "rose"
                    : "gray"
              }
              className="gap-0.5 [&>svg]:size-3"
            >
              {deltaTone === "positive" ? (
                <TrendingUpIcon />
              ) : deltaTone === "negative" ? (
                <TrendingDownIcon />
              ) : null}
              {delta}
            </Chip>
          ) : null}
        </div>
        {hint ? (
          <span className="text-xs text-muted-foreground">{hint}</span>
        ) : null}
      </div>
    </div>
  );
}

/** Responsive row of Stat tiles. Collapses to a 2-col grid, then 1-col. */
function StatGrid({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="stat-grid"
      className={cn(
        "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export { Stat, StatGrid };
