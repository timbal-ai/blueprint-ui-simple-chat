import {
  DemoAreaChart,
  DemoBarChart,
  DemoLineChart,
  DemoPieChart,
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
        <ChartCard title="Area" description="Stacked revenue vs expenses" height="auto">
          <DemoAreaChart />
        </ChartCard>
        <ChartCard title="Bar" description="Grouped by month" height="auto">
          <DemoBarChart />
        </ChartCard>
        <ChartCard title="Line" description="Trends over time" height="auto">
          <DemoLineChart />
        </ChartCard>
        <ChartCard title="Pie" description="Share by category" height="auto">
          <DemoPieChart />
        </ChartCard>
      </div>
    </GalleryPage>
  );
}
