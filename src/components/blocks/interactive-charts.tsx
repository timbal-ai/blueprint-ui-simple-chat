import * as React from "react";

import { cn } from "@/lib/utils";
import { chartToneVar, type ChartTone } from "@/lib/chart-tone";

/**
 * MetricLegendList — the Beacon-style legend under a chart: hairline-
 * separated rows where each status carries a gradient tone pill, the
 * label + count, a BIG number with a muted caption, and an optional
 * trailing action (View). Two muted column headers ("Status" / "Metrics
 * as of today") sit above.
 *
 * This is the ONLY piece left of the old house interactive-charts kit —
 * everything else (tracked bars, activity rings, score rings, ring
 * calendar, contribution heatmap, period pager) was retired in favor of
 * the BoardUI Pro cards in `src/components/application/*`:
 *   bars → application/medical/steps-card, application/dashboard/earnings-chart-card
 *   score ring + breakdown → application/medical/sleep-score-card
 *   activity rings → application/medical/activity-rings-card
 *   ring calendar → application/medical/most-active-days-card
 *   heatmap → application/dashboard/contributions-card (ContributionsGrid)
 *   trend area chart → application/dashboard/revenue-trend-card
 *   people roster → application/dashboard/recent-hires-card
 *   period pager pill → application/medical/week-range-pill
 * MetricLegendList stays because no Pro component covers the pattern.
 */

interface MetricLegendItem {
  id: string;
  tone: ChartTone;
  /** Status name — "On track". */
  label: React.ReactNode;
  /** Muted count in parens after the label — "(2)". */
  count?: React.ReactNode;
  /** The big number — "50%". */
  value: React.ReactNode;
  /** Muted caption under the value — "On track", "Since Sep 23". */
  caption?: React.ReactNode;
  /** Trailing slot — a `View` Button, a menu… */
  action?: React.ReactNode;
}

function MetricLegendList({
  items,
  columns = ["Status", "Metrics as of today"],
  className,
}: {
  items: MetricLegendItem[];
  /** The two muted column headers. Pass null to hide the header row. */
  columns?: [React.ReactNode, React.ReactNode] | null;
  className?: string;
}) {
  const grid = "grid grid-cols-[minmax(0,1fr)_minmax(7rem,auto)_auto] items-center gap-x-4";
  return (
    <div className={cn("flex flex-col", className)}>
      {columns ? (
        <div className={cn(grid, "border-b border-border pb-2.5")}>
          <span className="text-sm text-muted-foreground">{columns[0]}</span>
          <span className="text-sm text-muted-foreground">{columns[1]}</span>
          <span />
        </div>
      ) : null}
      <div className="flex flex-col divide-y divide-border">
        {items.map((item) => {
          const color = chartToneVar(item.tone);
          return (
            <div key={item.id} className={cn(grid, "py-3")}>
              <span className="flex min-w-0 items-center gap-2.5">
                {/* Gradient + top sheen pill — legend and plot visibly share
                    one paint. */}
                <span
                  aria-hidden
                  className="h-6 w-2 shrink-0 rounded-full shadow-[inset_0_1px_0_0_color-mix(in_srgb,white_45%,transparent)]"
                  style={{
                    backgroundImage: `linear-gradient(to bottom, color-mix(in oklab, ${color} 62%, white), ${color} 72%)`,
                  }}
                />
                <span className="truncate text-sm text-foreground">{item.label}</span>
                {item.count != null ? (
                  <span className="shrink-0 text-sm text-muted-foreground">
                    ({item.count})
                  </span>
                ) : null}
              </span>
              <span className="flex min-w-0 flex-col">
                <span className="text-[1.45rem] leading-tight font-medium tracking-tight tabular-nums text-foreground">
                  {item.value}
                </span>
                {item.caption ? (
                  <span className="truncate text-xs text-muted-foreground">
                    {item.caption}
                  </span>
                ) : null}
              </span>
              <span className="justify-self-end">{item.action}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export { MetricLegendList };
export type { ChartTone, MetricLegendItem };
