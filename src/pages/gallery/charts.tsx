import type * as React from "react";

import {
  DemoAreaChart,
  DemoBarChart,
  DemoComparisonChart,
  DemoComposedChart,
  DemoDonutChart,
  DemoLineChart,
  DemoPieChart,
  DemoRadarChart,
  DemoStackedBarChart,
} from "@/components/blocks/chart-demos";
import {
  HeroMetricCard,
  ProportionBar,
  ProportionLegend,
} from "@/components/blocks/hero-metric";
import { ChartCard } from "@/components/blocks/stat-overview";

import { GalleryPage } from "./section";

const TAX_SEGMENTS = [
  { id: "federal", label: "Federal income tax", value: 2600, tone: 5 },
  { id: "fica", label: "FICA", value: 150, tone: 7 },
  { id: "state", label: "State tax (CA)", value: 500, tone: 4 },
] satisfies React.ComponentProps<typeof ProportionBar>["segments"];

export default function GalleryCharts() {
  return (
    <GalleryPage
      title="Charts"
      description="Recharts through ChartContainer — colors and tooltips come from DNA chart tokens. No legends, no Y-axis numbers, edge-less plots."
    >
      <HeroMetricCard
        title="Networth"
        context="2025 vs 2026"
        value="$753,914"
        valueCaption="End of year"
        chart={<DemoComparisonChart />}
        footer={
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <span className="text-sm font-medium">Tax position</span>
            <ProportionLegend
              formatValue={(v) => `$${v.toLocaleString()}`}
              segments={TAX_SEGMENTS}
            />
            <ProportionBar className="basis-full" segments={TAX_SEGMENTS} />
          </div>
        }
      />
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <ChartCard
          title="Composed"
          description="Trend lines over volume bars — the dashboard reference"
          height="auto"
        >
          <DemoComposedChart />
        </ChartCard>
        <ChartCard title="Area" description="Stacked revenue vs expenses" height="auto">
          <DemoAreaChart />
        </ChartCard>
        <ChartCard title="Bar" description="Grouped by month" height="auto">
          <DemoBarChart />
        </ChartCard>
        <ChartCard title="Stacked bar" description="Composition per quarter" height="auto">
          <DemoStackedBarChart />
        </ChartCard>
        <ChartCard title="Line" description="Trends over time" height="auto">
          <DemoLineChart />
        </ChartCard>
        <ChartCard title="Donut with total" description="Share with the sum in the center" height="auto">
          <DemoDonutChart />
        </ChartCard>
        <ChartCard title="Pie" description="Share by category" height="auto">
          <DemoPieChart />
        </ChartCard>
        <ChartCard title="Radar" description="Multi-dimension comparison" height="auto">
          <DemoRadarChart />
        </ChartCard>
      </div>
    </GalleryPage>
  );
}
