import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
} from "recharts";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

/**
 * Chart recipes — the four canonical shadcn chart patterns wired to DNA
 * chart tokens. Fork a recipe and swap the data/config; always render charts
 * through ChartContainer (never a bare ResponsiveContainer) so colors,
 * tooltips, and sizing stay consistent.
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
      <AreaChart accessibilityLayer data={monthly} margin={{ left: 12, right: 12 }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
        <Area
          dataKey="expenses"
          type="natural"
          fill="var(--color-expenses)"
          fillOpacity={0.25}
          stroke="var(--color-expenses)"
          stackId="a"
        />
        <Area
          dataKey="revenue"
          type="natural"
          fill="var(--color-revenue)"
          fillOpacity={0.35}
          stroke="var(--color-revenue)"
          stackId="a"
        />
        <ChartLegend content={<ChartLegendContent />} />
      </AreaChart>
    </ChartContainer>
  );
}

function DemoBarChart() {
  return (
    <ChartContainer config={monthlyConfig} className="h-64 w-full">
      <BarChart accessibilityLayer data={monthly}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />
        <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4} />
        <Bar dataKey="expenses" fill="var(--color-expenses)" radius={4} />
        <ChartLegend content={<ChartLegendContent />} />
      </BarChart>
    </ChartContainer>
  );
}

function DemoLineChart() {
  return (
    <ChartContainer config={monthlyConfig} className="h-64 w-full">
      <LineChart accessibilityLayer data={monthly} margin={{ left: 12, right: 12 }}>
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
        <ChartLegend
          content={<ChartLegendContent nameKey="browser" />}
          className="flex-wrap gap-2 *:justify-center"
        />
      </PieChart>
    </ChartContainer>
  );
}

export { DemoAreaChart, DemoBarChart, DemoLineChart, DemoPieChart };
