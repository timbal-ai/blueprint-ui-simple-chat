import type { ChartArtifact } from "@timbal-ai/timbal-react/app";
import { ChartPanel } from "@timbal-ai/timbal-react/app";

const weeklySessions: ChartArtifact = {
  type: "chart",
  chartType: "area",
  data: [
    { day: "Mon", sessions: 1820, prev: 1650 },
    { day: "Tue", sessions: 2100, prev: 1890 },
    { day: "Wed", sessions: 1950, prev: 2010 },
    { day: "Thu", sessions: 2480, prev: 2200 },
    { day: "Fri", sessions: 2310, prev: 2150 },
    { day: "Sat", sessions: 1420, prev: 1380 },
    { day: "Sun", sessions: 1180, prev: 1100 },
  ],
  xKey: "day",
  series: [
    { dataKey: "sessions", label: "This week" },
    { dataKey: "prev", label: "Last week" },
  ],
};

const latencyByRegion: ChartArtifact = {
  type: "chart",
  chartType: "bar",
  data: [
    { region: "EU", ms: 142 },
    { region: "US", ms: 178 },
    { region: "APAC", ms: 224 },
    { region: "LATAM", ms: 196 },
  ],
  xKey: "region",
  dataKey: "ms",
  unit: "ms",
};

const errorMix: ChartArtifact = {
  type: "chart",
  chartType: "donut",
  data: [
    { kind: "4xx", count: 42 },
    { kind: "5xx", count: 8 },
    { kind: "Timeout", count: 15 },
    { kind: "Other", count: 5 },
  ],
  xKey: "kind",
  dataKey: "count",
};

const modelLatency: ChartArtifact = {
  type: "chart",
  chartType: "radar",
  data: [
    { axis: "p50", score: 88 },
    { axis: "p95", score: 72 },
    { axis: "p99", score: 61 },
    { axis: "Throughput", score: 84 },
    { axis: "Availability", score: 97 },
    { axis: "Cost", score: 76 },
  ],
  xKey: "axis",
  dataKey: "score",
};

export function SampleCharts() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <ChartPanel
        title="Sessions"
        description="Current vs prior week"
        artifact={weeklySessions}
        actions={<span className="text-xs text-muted-foreground">7d</span>}
      />
      <ChartPanel title="Latency p95 by region" artifact={latencyByRegion} />
      <ChartPanel title="Error breakdown" artifact={errorMix} />
      <ChartPanel title="SLO health radar" artifact={modelLatency} />
    </div>
  );
}
