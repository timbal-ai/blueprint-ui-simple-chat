import * as React from "react";
import { TrendingDownIcon, TrendingUpIcon } from "@/components/icons";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

/**
 * Single KPI tile — the reference grammar: muted label row (with an
 * optional trailing action), large NOT-bold value, a vibrant delta badge
 * beside it, and a muted caption underneath ("Compared to the previous
 * period"). Hierarchy comes from size and tone, never weight.
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
        "flex flex-col gap-1.5 rounded-xl border border-border bg-card p-4 shadow-xs",
        className,
      )}
      {...props}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="truncate text-xs text-muted-foreground">{label}</span>
        {action}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-2xl font-medium tracking-tight tabular-nums text-foreground">
          {value}
        </span>
        {delta ? (
          <Badge
            variant={
              deltaTone === "positive"
                ? "success"
                : deltaTone === "negative"
                  ? "destructive"
                  : "secondary"
            }
            className="gap-0.5 px-1.5 text-[11px]"
          >
            {deltaTone === "positive" ? (
              <TrendingUpIcon />
            ) : deltaTone === "negative" ? (
              <TrendingDownIcon />
            ) : null}
            {delta}
          </Badge>
        ) : null}
      </div>
      {hint ? <span className="text-xs text-muted-foreground">{hint}</span> : null}
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
