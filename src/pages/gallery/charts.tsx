import * as React from "react";

import {
  ActivityRings,
  ChartPeriodPager,
  ChartRangeTabs,
  ContributionHeatmap,
  RingCalendar,
  ScoreBreakdownList,
  SegmentedScoreRing,
  TrackedBarChart,
} from "@/components/blocks/interactive-charts";
import {
  DemoAreaChart,
  DemoBarChart,
  DemoComparisonChart,
  DemoComposedChart,
  DemoDonutChart,
  DemoLineChart,
  DemoPieChart,
  DemoRadarChart,
  DemoScatterChart,
  DemoStackedBarChart,
} from "@/components/blocks/chart-demos";
import {
  HeroMetricCard,
  ProportionBar,
  ProportionLegend,
} from "@/components/blocks/hero-metric";
import { MetricTrendCard } from "@/components/blocks/metric-trend-card";
import { ChartCard } from "@/components/blocks/stat-overview";
import { ScoreGauge } from "@/components/app/score-gauge";

import { GalleryPage } from "./section";

const TAX_SEGMENTS = [
  { id: "federal", label: "Federal income tax", value: 2600, tone: 5 },
  { id: "fica", label: "FICA", value: 150, tone: 7 },
  { id: "state", label: "State tax (CA)", value: 500, tone: 4 },
] satisfies React.ComponentProps<typeof ProportionBar>["segments"];

const WEEK = [
  { label: "Mon", value: 6900 },
  { label: "Tue", value: 2700 },
  { label: "Wed", value: 2100 },
  { label: "Thu", value: 7900 },
  { label: "Fri", value: 7100 },
  { label: "Sat", value: 6400 },
  { label: "Sun", value: 4800 },
];

const HEAT = Array.from({ length: 126 }, (_, i) => ({
  count: (i * 2654435761) % 11 > 6 ? 0 : ((i * 40503) % 10),
  label: `${((i * 40503) % 10)} events on day ${i + 1}`,
}));

const TREND_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const TREND_RANGES = {
  Weekly: {
    value: "$18,240",
    delta: "+9.4%",
    data: TREND_MONTHS.map((label, i) => ({
      label,
      value: [1400, 1900, 2600, 2350, 3300, 3050, 2800, 3600, 4600, 4200, 3900, 5600][i],
    })),
  },
  Monthly: {
    value: "$64,120",
    delta: "+6.1%",
    data: TREND_MONTHS.map((label, i) => ({
      label,
      value: [3200, 3600, 3400, 4100, 4800, 4500, 5200, 5900, 5600, 6300, 6100, 7200][i],
    })),
  },
  Yearly: {
    value: "$412,700",
    delta: "+18.9%",
    data: ["2020", "2021", "2022", "2023", "2024", "2025", "2026"].map((label, i) => ({
      label,
      value: [21000, 34000, 42000, 58000, 71000, 89000, 98000][i],
    })),
  },
};

const RING_DAYS = Array.from({ length: 14 }, (_, i) => ({
  day: i + 1,
  rings: [((i * 37) % 90) / 90, ((i * 53) % 80) / 80, ((i * 71) % 70) / 70],
}));

export default function GalleryCharts() {
  const [day, setDay] = React.useState(4);
  const [range, setRange] = React.useState("Weekly");
  return (
    <GalleryPage
      title="Charts"
      description="Recharts through ChartContainer — colors and tooltips come from DNA chart tokens. No legends, no Y-axis numbers, edge-less plots. Interactive kit (blocks/interactive-charts) below."
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
        <ChartCard
          title="Scatter"
          description="Two-dimensional distribution — tooltip via ChartTooltipContent, never hand-rolled"
          height="auto"
          bleed={false}
        >
          <DemoScatterChart />
        </ChartCard>
        <ChartCard
          title="Score gauges"
          description="app/score-gauge — the house semicircle; never hand-roll SVG arcs"
          height="auto"
          bleed={false}
        >
          <div className="flex h-64 flex-wrap items-center justify-evenly gap-4">
            <ScoreGauge value={100} label="AI heat score" />
            <ScoreGauge value={65} label="Health score" />
            <ScoreGauge value={30} label="Coverage" />
            <ScoreGauge value={82} tone="selection" label="Completion" />
          </div>
        </ChartCard>

        {/* Metric trend card — blocks/metric-trend-card. */}
        <MetricTrendCard
          title="Revenue"
          tone="success"
          ranges={TREND_RANGES}
          defaultRange="Weekly"
        />

        {/* Interactive kit — blocks/interactive-charts. */}
        <ChartCard
          title="Tracked bars"
          description={`Selectable capped bars — ${WEEK[day].label}: ${WEEK[day].value.toLocaleString()} steps`}
          height="auto"
          bleed={false}
          action={<ChartPeriodPager label="29 Jun – 5 Jul" />}
        >
          <TrackedBarChart
            data={WEEK}
            tone={7}
            height="13rem"
            selectedIndex={day}
            onSelect={setDay}
            formatValue={(v) => `${v.toLocaleString()} steps`}
          />
        </ChartCard>
        <ChartCard
          title="Segmented score ring"
          description="Airy segments + center score, with breakdown rows"
          height="auto"
          bleed={false}
        >
          <div className="flex flex-wrap items-center justify-center gap-6">
            <SegmentedScoreRing
              segments={[
                { value: 49, tone: 2, label: "Duration" },
                { value: 29, tone: 4, label: "Bedtime" },
                { value: 20, tone: 5, label: "Interruptions" },
              ]}
            >
              <span className="text-4xl font-medium tracking-tight tabular-nums">98</span>
            </SegmentedScoreRing>
            <ScoreBreakdownList
              className="min-w-56 flex-1"
              items={[
                { id: "d", label: "Duration: 7h 50m", value: "49/50", tone: 2 },
                { id: "b", label: "Bedtime: 20m earlier", value: "29/30", tone: 4 },
                { id: "i", label: "Interruptions: 5m", value: "20/20", tone: 5 },
              ]}
            />
          </div>
        </ChartCard>
        <ChartCard
          title="Activity rings"
          description="Concentric progress rings, rounded caps, gray tracks"
          height="auto"
          bleed={false}
        >
          <div className="flex flex-wrap items-center justify-evenly gap-4">
            <ActivityRings
              size={170}
              rings={[
                { value: 816, max: 900, tone: 4, label: "Move" },
                { value: 101, max: 120, tone: "success", label: "Exercise" },
                { value: 5.2, max: 8, tone: 5, label: "Running" },
              ]}
            />
            <ActivityRings
              size={96}
              rings={[
                { value: 0.72, max: 1, tone: 1 },
                { value: 0.45, max: 1, tone: 3 },
              ]}
            />
          </div>
        </ChartCard>
        <ChartCard
          title="Ring calendar"
          description="A month of mini activity rings — click a day"
          height="auto"
          bleed={false}
        >
          <RingCalendar days={RING_DAYS} selectedDay={10} />
        </ChartCard>
        <ChartCard
          title="Contribution heatmap"
          description="GitHub-style intensity grid, tooltip per cell"
          height="auto"
          bleed={false}
          action={
            <ChartRangeTabs
              options={["Weekly", "Monthly", "Yearly"]}
              value={range}
              onChange={setRange}
            />
          }
        >
          <ContributionHeatmap data={HEAT} tone={2} />
        </ChartCard>
      </div>
    </GalleryPage>
  );
}
