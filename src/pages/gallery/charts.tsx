import {
  DemoAreaChart,
  DemoBarChart,
  DemoComposedChart,
  DemoDonutChart,
  DemoLineChart,
  DemoPieChart,
  DemoRadarChart,
  DemoStackedBarChart,
} from "@/components/blocks/chart-demos";
import { ChartCard } from "@/components/blocks/stat-overview";

import { GalleryPage } from "./section";

export default function GalleryCharts() {
  return (
    <GalleryPage
      title="Charts"
      description="Recharts through ChartContainer — colors, tooltips, and legends come from DNA chart tokens."
    >
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
