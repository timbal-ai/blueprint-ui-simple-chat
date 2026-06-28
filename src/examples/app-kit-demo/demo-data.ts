export const MOCK_WORKFORCES = [
  { id: "operations", name: "Operations" },
  { id: "support", name: "Support" },
  { id: "analytics", name: "Analytics" },
] as const;

export type WorkforceId = (typeof MOCK_WORKFORCES)[number]["id"];

export type WorkforceRow = {
  id: string;
  name: string;
  status: "Active" | "Paused" | "Degraded";
  region: "EU" | "US" | "APAC";
  requests: number;
  uptime: string;
};

export const WORKFORCE_ROWS: Record<WorkforceId, WorkforceRow[]> = {
  operations: [
    {
      id: "1",
      name: "Routing agent",
      status: "Active",
      region: "EU",
      requests: 12400,
      uptime: "99.97%",
    },
    {
      id: "2",
      name: "Escalation workflow",
      status: "Degraded",
      region: "US",
      requests: 3820,
      uptime: "98.40%",
    },
    {
      id: "3",
      name: "Batch reconciler",
      status: "Paused",
      region: "APAC",
      requests: 0,
      uptime: "—",
    },
    {
      id: "4",
      name: "Incident notifier",
      status: "Active",
      region: "EU",
      requests: 910,
      uptime: "100%",
    },
  ],
  support: [
    {
      id: "5",
      name: "Ticket triage",
      status: "Active",
      region: "US",
      requests: 6420,
      uptime: "99.8%",
    },
    {
      id: "6",
      name: "Macro suggester",
      status: "Active",
      region: "EU",
      requests: 2180,
      uptime: "99.5%",
    },
    {
      id: "7",
      name: "CSAT survey bot",
      status: "Paused",
      region: "APAC",
      requests: 120,
      uptime: "—",
    },
  ],
  analytics: [
    {
      id: "8",
      name: "Usage rollup",
      status: "Active",
      region: "EU",
      requests: 880,
      uptime: "99.99%",
    },
    {
      id: "9",
      name: "Anomaly detector",
      status: "Degraded",
      region: "US",
      requests: 1540,
      uptime: "97.2%",
    },
    {
      id: "10",
      name: "Export scheduler",
      status: "Active",
      region: "APAC",
      requests: 44,
      uptime: "100%",
    },
  ],
};

const SPARK_SESSIONS = [920, 1040, 980, 1180, 1120, 1240, 1320];
const SPARK_LATENCY = [198, 192, 188, 186, 184, 182, 180];
const SPARK_ERRORS = [0.42, 0.38, 0.35, 0.33, 0.31, 0.3, 0.28];
const SPARK_USERS = [1080, 1102, 1134, 1168, 1188, 1201, 1204];

function seriesFrom(base: number[], scale: number) {
  return base.map((v) => Math.round(v * scale));
}

export function metricsForWorkforce(id: WorkforceId) {
  const scale = id === "operations" ? 1 : id === "support" ? 0.72 : 0.48;

  return [
    {
      id: "sessions",
      label: "Sessions",
      value: id === "operations" ? "12.4k" : id === "support" ? "8.9k" : "5.1k",
      trend: "+8.2%",
      trendTone: "up" as const,
      sparklineData: seriesFrom(SPARK_SESSIONS, scale),
    },
    {
      id: "latency",
      label: "Latency p95",
      value: id === "analytics" ? "214" : "182",
      unit: "ms",
      trend: "−6.1%",
      trendTone: "up" as const,
      sparklineData: seriesFrom(SPARK_LATENCY, id === "analytics" ? 1.18 : 1),
    },
    {
      id: "errors",
      label: "Error rate",
      value: id === "support" ? "0.5" : "0.3",
      unit: "%",
      trend: "−0.1pp",
      trendTone: "up" as const,
      activeTone: "success" as const,
      sparklineData: seriesFrom(SPARK_ERRORS, id === "support" ? 1.6 : 1),
    },
    {
      id: "users",
      label: "Active users",
      value: String(Math.round(1204 * scale)),
      trend: "+3.4%",
      trendTone: "up" as const,
      sparklineData: seriesFrom(SPARK_USERS, scale),
    },
  ];
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function buildSeries(scale: number, pattern: number[]) {
  return DAYS.map((date, i) => ({
    date,
    value: Math.round(pattern[i]! * scale),
  }));
}

const SESSION_PATTERN = [1820, 2100, 1950, 2480, 2310, 1420, 1180];
const LATENCY_PATTERN = [198, 192, 188, 186, 184, 190, 214];
const ERROR_PATTERN = [0.38, 0.35, 0.34, 0.32, 0.31, 0.29, 0.28];

export function chartMetricsForWorkforce(id: WorkforceId) {
  const scale = id === "operations" ? 1 : id === "support" ? 0.78 : 0.55;

  return [
    {
      id: "sessions",
      label: "Sessions",
      value: id === "operations" ? "12.4k" : id === "support" ? "9.7k" : "6.8k",
      trend: "+8%",
      trendTone: "up" as const,
      data: buildSeries(scale, SESSION_PATTERN),
      dataKey: "value",
      color: "var(--chart-1)",
    },
    {
      id: "latency",
      label: "Latency p95",
      value: id === "analytics" ? "214" : "182",
      unit: "ms",
      trend: "−6%",
      trendTone: "up" as const,
      data: buildSeries(1, LATENCY_PATTERN).map((p) => ({
        ...p,
        value: Math.round(p.value * (id === "analytics" ? 1.12 : 1)),
      })),
      dataKey: "value",
      color: "var(--chart-2)",
    },
    {
      id: "errors",
      label: "Errors",
      value: id === "support" ? "0.5%" : "0.3%",
      trend: "−0.1pp",
      trendTone: "up" as const,
      data: buildSeries(1, ERROR_PATTERN).map((p) => ({
        ...p,
        value: Number((p.value * (id === "support" ? 1.5 : 1)).toFixed(2)),
      })),
      dataKey: "value",
      color: "var(--chart-3)",
    },
  ];
}

export const RECENT_ACTIVITY = [
  {
    id: "a1",
    title: "Routing agent scaled to 4 replicas",
    description: "Autoscale policy triggered after p95 crossed 200ms.",
    meta: "12m ago",
    tone: "primary" as const,
  },
  {
    id: "a2",
    title: "Escalation workflow entered degraded state",
    description: "Upstream webhook latency exceeded the 2s SLO.",
    meta: "38m ago",
    tone: "warn" as const,
  },
  {
    id: "a3",
    title: "Weekly usage export completed",
    description: "CSV delivered to the analytics warehouse.",
    meta: "2h ago",
    tone: "success" as const,
  },
  {
    id: "a4",
    title: "Incident notifier health check passed",
    description: "All regions reporting green.",
    meta: "5h ago",
    tone: "default" as const,
  },
];

export const CONNECTED_RESOURCES = [
  {
    id: "r1",
    title: "Customer KB",
    subtitle: "Hybrid search · 42k chunks",
    badge: "Synced",
    footer: "Updated 4m ago",
  },
  {
    id: "r2",
    title: "Zendesk",
    subtitle: "Ticketing · OAuth",
    badge: "Connected",
    footer: "12 open tickets routed",
  },
  {
    id: "r3",
    title: "Slack alerts",
    subtitle: "#ops-alerts",
    badge: "Active",
    footer: "Last ping 30s ago",
  },
];
