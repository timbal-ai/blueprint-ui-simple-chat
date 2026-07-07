import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Single KPI tile. Value stays normal weight — hierarchy comes from size and
 * spacing. Add a `delta` only when the change itself is the message.
 */
function Stat({
  label,
  value,
  delta,
  deltaTone = "neutral",
  hint,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  label: string;
  value: React.ReactNode;
  /** Optional change indicator, e.g. "+8.2%". Keep it muted by default. */
  delta?: string;
  deltaTone?: "positive" | "negative" | "neutral";
  /** Secondary context under the value, e.g. "vs last month". */
  hint?: string;
}) {
  return (
    <div
      data-slot="stat"
      className={cn(
        "flex flex-col gap-1 rounded-lg border border-border bg-card p-4 shadow-xs",
        className,
      )}
      {...props}
    >
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-normal tabular-nums text-foreground">
          {value}
        </span>
        {delta ? (
          <span
            className={cn(
              "text-xs tabular-nums",
              deltaTone === "positive" && "text-success-subtle-foreground",
              deltaTone === "negative" && "text-destructive",
              deltaTone === "neutral" && "text-muted-foreground",
            )}
          >
            {delta}
          </span>
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
