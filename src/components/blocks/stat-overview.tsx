import * as React from "react";

import { cn } from "@/lib/utils";
import { Stat, StatGrid } from "@/components/app/stat";
import {
  Card,
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
}

function StatOverview({
  stats,
  children,
  className,
}: {
  stats: StatItem[];
  /** Optional ChartCard(s) rendered under the KPI row. */
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <StatGrid>
        {stats.map((s) => (
          <Stat
            key={s.id}
            label={s.label}
            value={s.value}
            delta={s.delta}
            deltaTone={s.deltaTone}
            hint={s.hint}
          />
        ))}
      </StatGrid>
      {children}
    </div>
  );
}

/** Bounded, titled container for a chart. Height is fixed so layouts stay stable. */
function ChartCard({
  title,
  description,
  height = "16rem",
  action,
  children,
  className,
}: {
  title: string;
  description?: string;
  /** Chart area height — fixed so async data can't cause layout shift. */
  height?: string;
  /** Optional header action (range select, export). */
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={cn("min-w-0", className)}>
      <CardHeader className="flex-row items-start justify-between gap-2">
        <div className="flex min-w-0 flex-col gap-1">
          <CardTitle>{title}</CardTitle>
          {description ? <CardDescription>{description}</CardDescription> : null}
        </div>
        {action}
      </CardHeader>
      <CardContent>
        <div className="w-full min-w-0" style={{ height }}>
          {children}
        </div>
      </CardContent>
    </Card>
  );
}

export { ChartCard, StatOverview };
export type { StatItem };
