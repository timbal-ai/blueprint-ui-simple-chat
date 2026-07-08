import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  Label,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  XAxis,
} from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

/**
 * Chart recipes — the canonical Recharts patterns wired to DNA chart
 * tokens: area, bar, line, pie/donut, composed line+bar (the dashboard
 * reference), stacked bar, donut-with-total, and radar.
 *
 * House chart grammar:
 * - NO legends — tooltips carry the labels. Keep series count low enough
 *   that color alone communicates.
 * - NO Y-axis numbers — they collide with edge-less plots; magnitudes live
 *   in the tooltip. X-axis category labels stay.
 * - Edge-less plots — zero left/right margins so lines/areas bleed to the
 *   card edges; the wrapping Card supplies the breathing room.
 * - Gradient fills — areas and bars fade downward from the series color
 *   (defined once in <defs> per chart, referenced by id).
 *
 * Fork a recipe and swap the data/config; always render charts through
 * ChartContainer (never a bare ResponsiveContainer) so colors, tooltips,
 * and sizing stay consistent.
 */

const monthly = [
  { month: "Jan", revenue: 18600, expenses: 8000 },
  { month: "Feb", revenue: 30500, expenses: 20000 },
  { month: "Mar", revenue: 23700, expenses: 12000 },
  { month: "Apr", revenue: 7300, expenses: 19000 },
  { month: "May", revenue: 20900, expenses: 13000 },
  { month: "Jun", revenue: 21400, expenses: 14000 },
];

const monthlyConfig = {
  revenue: { label: "Revenue", color: "var(--chart-1)" },
  expenses: { label: "Expenses", color: "var(--chart-2)" },
} satisfies ChartConfig;

function DemoAreaChart() {
  return (
    <ChartContainer config={monthlyConfig} className="h-64 w-full">
      <AreaChart accessibilityLayer data={monthly} margin={{ top: 8, left: 0, right: 0 }}>
        <defs>
          <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-revenue)" stopOpacity={0.55} />
            <stop offset="95%" stopColor="var(--color-revenue)" stopOpacity={0.04} />
          </linearGradient>
          <linearGradient id="fillExpenses" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-expenses)" stopOpacity={0.45} />
            <stop offset="95%" stopColor="var(--color-expenses)" stopOpacity={0.04} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
        <Area
          dataKey="expenses"
          type="natural"
          fill="url(#fillExpenses)"
          stroke="var(--color-expenses)"
          strokeWidth={2}
          stackId="a"
        />
        <Area
          dataKey="revenue"
          type="natural"
          fill="url(#fillRevenue)"
          stroke="var(--color-revenue)"
          strokeWidth={2}
          stackId="a"
        />
      </AreaChart>
    </ChartContainer>
  );
}

function DemoBarChart() {
  return (
    <ChartContainer config={monthlyConfig} className="h-64 w-full">
      <BarChart accessibilityLayer data={monthly} margin={{ top: 8, left: 0, right: 0 }}>
        <defs>
          <linearGradient id="barRevenue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-revenue)" stopOpacity={0.95} />
            <stop offset="100%" stopColor="var(--color-revenue)" stopOpacity={0.55} />
          </linearGradient>
          <linearGradient id="barExpenses" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-expenses)" stopOpacity={0.95} />
            <stop offset="100%" stopColor="var(--color-expenses)" stopOpacity={0.55} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />
        <Bar dataKey="revenue" fill="url(#barRevenue)" radius={[4, 4, 0, 0]} />
        <Bar dataKey="expenses" fill="url(#barExpenses)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ChartContainer>
  );
}

function DemoLineChart() {
  return (
    <ChartContainer config={monthlyConfig} className="h-64 w-full">
      <LineChart accessibilityLayer data={monthly} margin={{ top: 8, left: 0, right: 0 }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
        <Line
          dataKey="revenue"
          type="natural"
          stroke="var(--color-revenue)"
          strokeWidth={2}
          dot={false}
        />
        <Line
          dataKey="expenses"
          type="natural"
          stroke="var(--color-expenses)"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ChartContainer>
  );
}

const browsers = [
  { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
  { browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
  { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
  { browser: "other", visitors: 90, fill: "var(--color-other)" },
];

const browserConfig = {
  visitors: { label: "Visitors" },
  chrome: { label: "Chrome", color: "var(--chart-1)" },
  safari: { label: "Safari", color: "var(--chart-2)" },
  firefox: { label: "Firefox", color: "var(--chart-3)" },
  edge: { label: "Edge", color: "var(--chart-4)" },
  other: { label: "Other", color: "var(--chart-5)" },
} satisfies ChartConfig;

function DemoPieChart() {
  return (
    <ChartContainer
      config={browserConfig}
      className="mx-auto aspect-square h-64"
    >
      <PieChart>
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
        <Pie data={browsers} dataKey="visitors" nameKey="browser" innerRadius={56} />
      </PieChart>
    </ChartContainer>
  );
}

/* ---------------------------------------------------------------------------
 * Composed line + bar — the dashboard-reference shape: muted volume bars
 * under two crisp trend lines (e.g. growth vs attrition over months).
 * ------------------------------------------------------------------------- */

const workforce = [
  { month: "Jan", growth: 2300, attrition: 1600, hires: 620 },
  { month: "Feb", growth: 2450, attrition: 1720, hires: 540 },
  { month: "Mar", growth: 2380, attrition: 1650, hires: 700 },
  { month: "Apr", growth: 2500, attrition: 1580, hires: 660 },
  { month: "May", growth: 2440, attrition: 1690, hires: 580 },
  { month: "Jun", growth: 2560, attrition: 1470, hires: 740 },
  { month: "Jul", growth: 2620, attrition: 1380, hires: 690 },
  { month: "Aug", growth: 2540, attrition: 1290, hires: 720 },
  { month: "Sep", growth: 2680, attrition: 1210, hires: 610 },
  { month: "Oct", growth: 2610, attrition: 1150, hires: 680 },
];

const workforceConfig = {
  growth: { label: "Growth", color: "var(--chart-1)" },
  attrition: { label: "Attrition", color: "var(--chart-4)" },
  hires: { label: "Hires", color: "var(--chart-5)" },
} satisfies ChartConfig;

function DemoComposedChart({ className }: { className?: string }) {
  return (
    <ChartContainer
      config={workforceConfig}
      className={className ?? "h-64 w-full"}
    >
      <ComposedChart
        accessibilityLayer
        data={workforce}
        margin={{ top: 8, left: 0, right: 0 }}
      >
        <defs>
          <linearGradient id="composedHires" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-hires)" stopOpacity={0.4} />
            <stop offset="100%" stopColor="var(--color-hires)" stopOpacity={0.08} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
        {/* No YAxis — edge-less plots make axis numbers collide with the
            series; magnitudes live in the tooltip. */}
        <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
        <Bar
          dataKey="hires"
          fill="url(#composedHires)"
          radius={[3, 3, 0, 0]}
          barSize={14}
        />
        <Line
          dataKey="growth"
          type="monotone"
          stroke="var(--color-growth)"
          strokeWidth={2}
          dot={false}
        />
        <Line
          dataKey="attrition"
          type="monotone"
          stroke="var(--color-attrition)"
          strokeWidth={2}
          dot={false}
        />
      </ComposedChart>
    </ChartContainer>
  );
}

/* ---------------------------------------------------------------------------
 * Stacked bar — composition over time (e.g. plan mix per quarter).
 * ------------------------------------------------------------------------- */

const planMix = [
  { quarter: "Q1", starter: 210, growth: 140, enterprise: 60 },
  { quarter: "Q2", starter: 230, growth: 180, enterprise: 84 },
  { quarter: "Q3", starter: 205, growth: 220, enterprise: 110 },
  { quarter: "Q4", starter: 190, growth: 260, enterprise: 148 },
];

const planMixConfig = {
  starter: { label: "Starter", color: "var(--chart-2)" },
  growth: { label: "Growth", color: "var(--chart-1)" },
  enterprise: { label: "Enterprise", color: "var(--chart-4)" },
} satisfies ChartConfig;

function DemoStackedBarChart() {
  return (
    <ChartContainer config={planMixConfig} className="h-64 w-full">
      <BarChart accessibilityLayer data={planMix} margin={{ top: 8, left: 0, right: 0 }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="quarter" tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="starter" stackId="a" fill="var(--color-starter)" radius={[0, 0, 3, 3]} />
        <Bar dataKey="growth" stackId="a" fill="var(--color-growth)" />
        <Bar dataKey="enterprise" stackId="a" fill="var(--color-enterprise)" radius={[3, 3, 0, 0]} />
      </BarChart>
    </ChartContainer>
  );
}

/* ---------------------------------------------------------------------------
 * Donut with center total — the "big number inside the ring" pattern.
 * ------------------------------------------------------------------------- */

function DemoDonutChart() {
  const total = browsers.reduce((sum, b) => sum + b.visitors, 0);
  return (
    <ChartContainer config={browserConfig} className="mx-auto aspect-square h-64">
      <PieChart>
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
        <Pie
          data={browsers}
          dataKey="visitors"
          nameKey="browser"
          innerRadius={62}
          strokeWidth={4}
        >
          <Label
            content={({ viewBox }) => {
              if (!viewBox || !("cx" in viewBox) || !("cy" in viewBox)) {
                return null;
              }
              return (
                <text
                  x={viewBox.cx}
                  y={viewBox.cy}
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  <tspan
                    x={viewBox.cx}
                    y={viewBox.cy}
                    className="fill-foreground text-2xl font-medium tracking-tight"
                  >
                    {total.toLocaleString()}
                  </tspan>
                  <tspan
                    x={viewBox.cx}
                    y={(viewBox.cy ?? 0) + 20}
                    className="fill-muted-foreground text-xs"
                  >
                    Visitors
                  </tspan>
                </text>
              );
            }}
          />
        </Pie>
      </PieChart>
    </ChartContainer>
  );
}

/* ---------------------------------------------------------------------------
 * Comparison line — this year (solid) vs last year (dotted), white lines on
 * a dark/gradient surface. Built for the HeroMetricCard chart slot: no
 * axes, no numbers, vertical hairline grid, tooltip only.
 * ------------------------------------------------------------------------- */

const comparison = [
  { month: "Jan", current: 640, previous: 555 },
  { month: "Feb", current: 655, previous: 570 },
  { month: "Mar", current: 662, previous: 585 },
  { month: "Apr", current: 660, previous: 578 },
  { month: "May", current: 672, previous: 588 },
  { month: "Jun", current: 690, previous: 580 },
  { month: "Jul", current: 704, previous: 610 },
  { month: "Aug", current: 712, previous: 618 },
  { month: "Sep", current: 725, previous: 612 },
  { month: "Oct", current: 738, previous: 630 },
  { month: "Nov", current: 746, previous: 642 },
  { month: "Dec", current: 754, previous: 655 },
];

const comparisonConfig = {
  current: { label: "2026", color: "white" },
  previous: {
    label: "2025",
    color: "color-mix(in srgb, white 55%, transparent)",
  },
} satisfies ChartConfig;

function DemoComparisonChart({ className }: { className?: string }) {
  return (
    <ChartContainer
      config={comparisonConfig}
      className={
        className ??
        "h-40 w-full [&_.recharts-cartesian-grid_line]:stroke-white/20"
      }
    >
      <LineChart
        accessibilityLayer
        data={comparison}
        margin={{ top: 8, bottom: 8, left: 0, right: 0 }}
      >
        <CartesianGrid horizontal={false} vertical />
        <XAxis dataKey="month" hide />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <Line
          dataKey="previous"
          type="monotone"
          stroke="var(--color-previous)"
          strokeWidth={2}
          strokeDasharray="2 5"
          dot={false}
        />
        <Line
          dataKey="current"
          type="monotone"
          stroke="var(--color-current)"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ChartContainer>
  );
}

/* ---------------------------------------------------------------------------
 * Radar — multi-dimension comparison (skills, category scores).
 * ------------------------------------------------------------------------- */

const skills = [
  { skill: "Delivery", current: 82, target: 90 },
  { skill: "Quality", current: 74, target: 85 },
  { skill: "Velocity", current: 68, target: 75 },
  { skill: "Collab", current: 88, target: 90 },
  { skill: "Docs", current: 56, target: 70 },
  { skill: "Ownership", current: 79, target: 85 },
];

const skillsConfig = {
  current: { label: "Current", color: "var(--chart-1)" },
  target: { label: "Target", color: "var(--chart-3)" },
} satisfies ChartConfig;

function DemoRadarChart() {
  return (
    <ChartContainer config={skillsConfig} className="mx-auto aspect-square h-64">
      <RadarChart data={skills}>
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <PolarGrid />
        <PolarAngleAxis dataKey="skill" />
        <Radar
          dataKey="current"
          fill="var(--color-current)"
          fillOpacity={0.4}
          stroke="var(--color-current)"
        />
        <Radar
          dataKey="target"
          fill="var(--color-target)"
          fillOpacity={0.15}
          stroke="var(--color-target)"
        />
      </RadarChart>
    </ChartContainer>
  );
}

export {
  DemoAreaChart,
  DemoBarChart,
  DemoComparisonChart,
  DemoComposedChart,
  DemoDonutChart,
  DemoLineChart,
  DemoPieChart,
  DemoRadarChart,
  DemoStackedBarChart,
};
