import { useMemo, useState } from "react";
import {
  AlertCard,
  AppCopilot,
  AppCopilotProvider,
  AppShell,
  Breadcrumbs,
  DescriptionList,
  FilteredDataTable,
  InfoCard,
  MetricChartCard,
  MetricRow,
  Page,
  ResourceGallery,
  Section,
  StatusBadge,
  StatusDot,
  SubNav,
  Timeline,
} from "@timbal-ai/timbal-react/app";
import { StudioSidebar } from "@timbal-ai/timbal-react/studio";
import { Button } from "@timbal-ai/timbal-react/ui";

import {
  chartMetricsForWorkforce,
  CONNECTED_RESOURCES,
  metricsForWorkforce,
  MOCK_WORKFORCES,
  RECENT_ACTIVITY,
  WORKFORCE_ROWS,
  type WorkforceId,
  type WorkforceRow,
} from "./demo-data";
import { SampleCharts } from "./sample-charts";

const FILTER_FIELDS = [
  {
    id: "status",
    label: "Status",
    type: "multiselect" as const,
    options: [
      { value: "Active", label: "Active" },
      { value: "Paused", label: "Paused" },
      { value: "Degraded", label: "Degraded" },
    ],
  },
  {
    id: "region",
    label: "Region",
    type: "multiselect" as const,
    options: [
      { value: "EU", label: "EU" },
      { value: "US", label: "US" },
      { value: "APAC", label: "APAC" },
    ],
  },
];

function statusTone(status: WorkforceRow["status"]): "success" | "warn" | "danger" {
  if (status === "Active") return "success";
  if (status === "Degraded") return "danger";
  return "warn";
}

function regionDot(region: WorkforceRow["region"]) {
  const tone =
    region === "EU" ? "online" : region === "US" ? "busy" : "neutral";
  return <StatusDot tone={tone} aria-label={region} />;
}

/**
 * DASHBOARD WIRING REFERENCE — shows correct plumbing, NOT a layout template.
 *
 * Canonical here: shell slots (StudioSidebar in AppShell.sidebar), Page/Section
 * composition, block props (FilteredDataTable, ResourceGallery), and the
 * self-mounting <AppCopilot /> (the copilot is NOT an AppShell prop in 2.0).
 *
 * NOT canonical: the layout. Sidebar + metric row + full-width table is one
 * archetype among several (bento overview, split master–detail, focused
 * no-chrome, topbar nav, section-switcher). Compose the shape that fits the
 * user's domain — don't reproduce this structure or its "Operations" copy.
 *
 * Prefer the importable blocks (FilteredDataTable, StatGrid, IntegrationsGrid,
 * ResourceGallery, SettingsLayout) over re-assembling primitives — see APP_KIT_CATALOG.
 */
export default function AppKitDemo() {
  const [tab, setTab] = useState("overview");
  const [selectedWorkforce, setSelectedWorkforce] = useState<WorkforceId>("operations");
  const [activeChartMetric, setActiveChartMetric] = useState<string | undefined>();

  const rows = WORKFORCE_ROWS[selectedWorkforce];
  const headlineMetrics = useMemo(
    () => metricsForWorkforce(selectedWorkforce),
    [selectedWorkforce],
  );
  const chartMetrics = useMemo(
    () => chartMetricsForWorkforce(selectedWorkforce),
    [selectedWorkforce],
  );

  // Page context for copilot tooling — provided via AppCopilotProvider, read by
  // descendants (and the copilot) through useAppCopilotContext.
  const copilotContext = useMemo(
    () => ({
      page: "Operations",
      tab,
      workforceId: selectedWorkforce,
      rowCount: rows.length,
      activeChartMetric,
    }),
    [tab, selectedWorkforce, rows.length, activeChartMetric],
  );

  const workforceLabel =
    MOCK_WORKFORCES.find((w) => w.id === selectedWorkforce)?.name ?? "Operations";

  return (
    <AppCopilotProvider value={copilotContext}>
      <AppShell
        sidebar={
          <StudioSidebar
            brand="Blueprint"
            items={[...MOCK_WORKFORCES]}
            selectedId={selectedWorkforce}
            onSelect={(id) => setSelectedWorkforce(id as WorkforceId)}
            emptyCaption="Blueprint app-kit demo"
            persistKey={null}
          />
        }
      >
        <Page
          title={workforceLabel}
          description="Operations dashboard — MetricRow, MetricChartCard, surfaces, and data blocks from @timbal-ai/timbal-react/app"
          breadcrumbs={
            <Breadcrumbs
              items={[
                { label: "Home", href: "/" },
                { label: "App kit demo" },
                { label: workforceLabel },
              ]}
            />
          }
          actions={
            <Button variant="outline" asChild>
              <a href="/">Back to chat</a>
            </Button>
          }
        >
          <SubNav
            items={[
              { id: "overview", label: "Overview" },
              { id: "workloads", label: "Workloads" },
              { id: "reports", label: "Reports" },
            ]}
            activeId={tab}
            onChange={setTab}
          />

          {tab === "overview" ? (
            <>
              <MetricRow
                title="Key metrics"
                titleTag={<StatusBadge tone="success">Live</StatusBadge>}
                description="Sparkline-backed KPIs for the selected workforce."
                metrics={headlineMetrics}
                metricsAriaLabel={`${workforceLabel} key metrics`}
              />

              <InfoCard
                tone="info"
                title="Deployment healthy"
                action={
                  <Button variant="secondary" size="sm">
                    View release
                  </Button>
                }
              >
                v1.7.0 is active in all regions. Rollout completed 2 hours ago with zero
                customer-facing incidents.
              </InfoCard>

              <MetricChartCard
                title="Traffic & reliability"
                description="Select a metric to swap the chart series."
                metrics={chartMetrics}
                activeMetricId={activeChartMetric}
                onMetricChange={setActiveChartMetric}
                xKey="date"
                variant="area"
                metricsAriaLabel={`${workforceLabel} traffic metrics`}
                actions={
                  <Button variant="secondary" size="sm">
                    Export
                  </Button>
                }
              />

              <Section title="Action items" description="Guided alerts from monitoring.">
                <div className="grid gap-4 lg:grid-cols-2">
                  <AlertCard
                    category="Latency"
                    categoryTone="warn"
                    status="Open"
                    statusTone="warn"
                    title="Escalation workflow above SLO"
                    description="p95 latency in US-East has been above 200ms for 18 minutes."
                    action="Scale the webhook pool or pause non-critical jobs."
                  />
                  <AlertCard
                    category="Capacity"
                    categoryTone="default"
                    status="Watching"
                    statusTone="success"
                    title="Sessions trending up"
                    description="Week-over-week session volume is +8% with headroom remaining."
                    action="No action required — autoscale policy will engage at 75% CPU."
                  />
                </div>
              </Section>

              <Section
                title="Connected resources"
                description="The ResourceGallery block: a responsive ResourceCard grid."
              >
                <ResourceGallery
                  resources={CONNECTED_RESOURCES.map((resource) => ({
                    id: resource.id,
                    title: resource.title,
                    subtitle: resource.subtitle,
                    media: (
                      <span className="text-xs font-medium text-muted-foreground">
                        {resource.title.slice(0, 2).toUpperCase()}
                      </span>
                    ),
                    badge: <StatusBadge tone="success">{resource.badge}</StatusBadge>,
                    footer: resource.footer,
                  }))}
                />
              </Section>

              <Section title="Recent activity">
                <Timeline items={RECENT_ACTIVITY} />
              </Section>

              <Section title="Environment">
                <DescriptionList
                  items={[
                    { label: "Workforce", value: workforceLabel },
                    { label: "Primary region", value: "EU (Frankfurt)" },
                    { label: "Runtime", value: "Timbal agent v1.7" },
                    {
                      label: "Data retention",
                      value: "90 days (rolling)",
                    },
                    {
                      label: "Copilot context",
                      value: `${rows.length} workloads`,
                    },
                  ]}
                />
              </Section>
            </>
          ) : null}

          {tab === "workloads" ? (
            <Section
              title="Workloads"
              description="The FilteredDataTable block: search + faceted filters + sortable table, wired for you."
            >
              <FilteredDataTable
                searchPlaceholder="Search workloads…"
                searchPredicate={(row, q) => {
                  const needle = q.toLowerCase();
                  return (
                    row.name.toLowerCase().includes(needle) ||
                    row.status.toLowerCase().includes(needle) ||
                    row.region.toLowerCase().includes(needle)
                  );
                }}
                filterFields={FILTER_FIELDS}
                getFilterValue={(row, fieldId) =>
                  fieldId === "status" ? row.status : fieldId === "region" ? row.region : undefined
                }
                columns={[
                  {
                    id: "name",
                    header: "Name",
                    cell: (r) => r.name,
                    sortable: true,
                    sortValue: (r) => r.name,
                  },
                  {
                    id: "status",
                    header: "Status",
                    cell: (r) => (
                      <StatusBadge tone={statusTone(r.status)}>{r.status}</StatusBadge>
                    ),
                    sortable: true,
                    sortValue: (r) => r.status,
                  },
                  {
                    id: "region",
                    header: "Region",
                    cell: (r) => (
                      <span className="inline-flex items-center gap-2">
                        {regionDot(r.region)}
                        {r.region}
                      </span>
                    ),
                    sortable: true,
                    sortValue: (r) => r.region,
                  },
                  {
                    id: "requests",
                    header: "Requests (24h)",
                    cell: (r) => r.requests.toLocaleString(),
                    sortable: true,
                    sortValue: (r) => r.requests,
                    align: "right",
                  },
                  {
                    id: "uptime",
                    header: "Uptime",
                    cell: (r) => r.uptime,
                    sortable: true,
                    sortValue: (r) => r.uptime,
                    align: "right",
                  },
                ]}
                rows={rows}
                getRowKey={(r) => r.id}
                emptyMode="inline"
                emptyTitle="No workloads match"
                emptyDescription="Try clearing filters or a different search term."
                caption={`${workforceLabel} workloads`}
              />
            </Section>
          ) : null}

          {tab === "reports" ? (
            <>
              <MetricRow
                title="Report snapshot"
                description="Secondary KPIs for the reporting window."
                metrics={[
                  {
                    id: "throughput",
                    label: "Throughput",
                    value: "1.8M",
                    unit: "req/wk",
                    trend: "+12%",
                    trendTone: "up",
                  },
                  {
                    id: "cost",
                    label: "Infra cost",
                    value: "$4.2k",
                    trend: "−4%",
                    trendTone: "up",
                  },
                  {
                    id: "slo",
                    label: "SLO met",
                    value: "99.2",
                    unit: "%",
                    trend: "+0.3pp",
                    trendTone: "up",
                    activeTone: "success",
                  },
                ]}
                metricsAriaLabel="Reporting snapshot metrics"
              />

              <Section
                title="Charts"
                description="ChartPanel with built-in artifact renderer — bar, area, donut, radar."
              >
                <SampleCharts />
              </Section>
            </>
          ) : null}
        </Page>

        {/* Self-mounting floating copilot — portals its own overlay + pill trigger.
            No AppShell wiring; reads page context from AppCopilotProvider above. */}
        <AppCopilot
          workforceId={selectedWorkforce}
          debug={import.meta.env.DEV}
          welcome={{
            heading: `Ask about ${workforceLabel}`,
            subheading: "Questions about metrics, workloads, and alerts on this page.",
          }}
        />
      </AppShell>
    </AppCopilotProvider>
  );
}
