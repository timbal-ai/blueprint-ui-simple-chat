import * as React from "react";

import { cn } from "@/lib/utils";
import { Stat, StatGrid } from "@/components/app/stat";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

/**
 * StatOverview — the top-of-dashboard band: a KPI row plus an optional
 * primary visualization card.
 *
 * Use for the "at a glance" strip of a dashboard. Charts go INSIDE the
 * ChartCard slot (Recharts or plain markup) so they always get a bounded,
 * padded, titled container — never render a bare chart into the page.
 */

interface StatItem {
  id: string;
  label: string;
  value: React.ReactNode;
  delta?: string;
  deltaTone?: "positive" | "negative" | "neutral";
  hint?: string;
  /** Optional trailing header action (menu dots, info tooltip). */
  action?: React.ReactNode;
}

function StatOverview({
  stats,
  columns,
  children,
  className,
}: {
  stats: StatItem[];
  /** KPI columns at desktop width. Defaults to 4; use 3 for wider tiles. */
  columns?: 3 | 4;
  /** Optional ChartCard(s) rendered under the KPI row. */
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <StatGrid className={columns === 3 ? "lg:grid-cols-3" : undefined}>
        {stats.map((s) => (
          <Stat
            key={s.id}
            label={s.label}
            value={s.value}
            delta={s.delta}
            deltaTone={s.deltaTone}
            hint={s.hint}
            action={s.action}
          />
        ))}
      </StatGrid>
      {children}
    </div>
  );
}

/**
 * Bounded, titled container for a chart. Height is fixed so layouts stay
 * stable. Charts render EDGE-LESS by default — the plot bleeds to the
 * card's left/right edges (recipes use zero side margins); set
 * `bleed={false}` only when the chart needs the card's inner padding.
 */
function ChartCard({
  title,
  description,
  height = "16rem",
  action,
  bleed = true,
  children,
  className,
}: {
  title: string;
  description?: string;
  /** Chart area height — fixed so async data can't cause layout shift. */
  height?: string;
  /** Optional header action (range select, export). */
  action?: React.ReactNode;
  /** Plot bleeds to the card's horizontal edges. Default true. */
  bleed?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={cn("min-w-0", className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
        {action ? <CardAction>{action}</CardAction> : null}
      </CardHeader>
      <CardContent className={cn(bleed && "px-0")}>
        <div className="w-full min-w-0" style={{ height }}>
          {children}
        </div>
      </CardContent>
    </Card>
  );
}

export { ChartCard, StatOverview };
export type { StatItem };
