import type { ChartArtifact } from "@timbal-ai/timbal-react/app";
import { ChartPanel } from "@timbal-ai/timbal-react/app";

const weeklySessions: ChartArtifact = {
  type: "chart",
  chartType: "line",
  data: [
    { day: "Mon", sessions: 1820 },
    { day: "Tue", sessions: 2100 },
    { day: "Wed", sessions: 1950 },
    { day: "Thu", sessions: 2480 },
    { day: "Fri", sessions: 2310 },
    { day: "Sat", sessions: 1420 },
    { day: "Sun", sessions: 1180 },
  ],
  xKey: "day",
  dataKey: "sessions",
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

export function SampleCharts() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <ChartPanel
        title="Sessions"
        artifact={weeklySessions}
        actions={<span className="text-xs text-muted-foreground">7d</span>}
      />
      <ChartPanel title="Latency p95 by region" artifact={latencyByRegion} />
    </div>
  );
}
