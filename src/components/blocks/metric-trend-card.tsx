import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { cn } from "@/lib/utils";
import { chartToneVar, type ChartTone } from "@/lib/chart-tone";
import { ChartRangeTabs } from "@/components/blocks/interactive-charts";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

/**
 * MetricTrendCard — the "Revenue $18,240 +9.4%" reference grammar: a muted
 * title over a big money number with a vivid delta badge, ChartRangeTabs
 * (Weekly / Monthly / Yearly) on the right, and a smooth gradient-filled
 * area chart underneath. Switching the range swaps the dataset and the
 * line MORPHS to the new shape (Recharts animation), headline + delta
 * update with it.
 *
 * House chart grammar applies: no legend, no Y-axis numbers (magnitudes
 * live in the ChartTooltipContent tooltip), edge-less plot.
 */

interface TrendPoint {
  label: string;
  value: number;
}

interface TrendRange {
  /** Headline for this range — "$18,240". */
  value: string;
  /** Delta chip — "+9.4%". */
  delta?: string;
  deltaTone?: "positive" | "negative" | "neutral";
  data: TrendPoint[];
}

function MetricTrendCard({
  title,
  ranges,
  defaultRange,
  tone = "success",
  height = "13rem",
  seriesLabel,
  className,
}: {
  /** Muted header label — "Revenue". */
  title: string;
  /** Range name → headline + dataset. Keys become the tab labels. */
  ranges: Record<string, TrendRange>;
  /** Initial tab. Defaults to the first key. */
  defaultRange?: string;
  tone?: ChartTone;
  height?: string;
  /** Tooltip series label. Defaults to `title`. */
  seriesLabel?: string;
  className?: string;
}) {
  const keys = Object.keys(ranges);
  const [range, setRange] = React.useState(defaultRange ?? keys[0]);
  const active = ranges[range] ?? ranges[keys[0]];
  const gradientId = `trend-fill-${React.useId().replace(/:/g, "")}`;
  const color = chartToneVar(tone);

  const config = {
    value: { label: seriesLabel ?? title, color },
  } satisfies ChartConfig;

  return (
    <Card className={cn("gap-5", className)}>
      <CardContent className="flex h-full flex-col gap-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex min-w-0 flex-col gap-1">
            <span className="truncate text-sm text-muted-foreground">{title}</span>
            <span className="flex items-center gap-2">
              <span className="text-2xl font-medium tracking-tight tabular-nums text-foreground">
                {active.value}
              </span>
              {active.delta ? (
                <Badge
                  variant={
                    (active.deltaTone ?? "positive") === "positive"
                      ? "success"
                      : active.deltaTone === "negative"
                        ? "destructive"
                        : "secondary"
                  }
                >
                  {active.delta}
                </Badge>
              ) : null}
            </span>
          </div>
          {keys.length > 1 ? (
            <ChartRangeTabs options={keys} value={range} onChange={setRange} />
          ) : null}
        </div>

        <ChartContainer config={config} className="w-full flex-1" style={{ height }}>
          <AreaChart
            accessibilityLayer
            data={active.data}
            margin={{ top: 8, left: 0, right: 0 }}
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-value)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="var(--color-value)" stopOpacity={0.03} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Area
              dataKey="value"
              type="monotone"
              fill={`url(#${gradientId})`}
              stroke="var(--color-value)"
              strokeWidth={2.5}
              activeDot={{ r: 4.5, strokeWidth: 2 }}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export { MetricTrendCard };
export type { TrendPoint, TrendRange };
