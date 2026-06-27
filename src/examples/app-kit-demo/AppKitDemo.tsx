import { useEffect, useMemo, useState } from "react";
import { Menu } from "lucide-react";
import {
  AppChatPanel,
  AppCopilotProvider,
  AppShell,
  Breadcrumbs,
  DataTable,
  FilterBar,
  Page,
  SearchInput,
  Section,
  StatTile,
  StatusBadge,
  SubNav,
} from "@timbal-ai/timbal-react/app";
import {
  StudioSidebar,
  StudioSidebarBackdrop,
} from "@timbal-ai/timbal-react/studio";
import { Button, TimbalV2Button } from "@timbal-ai/timbal-react/ui";

import { SampleCharts } from "./sample-charts";

const MOCK_WORKFORCES = [
  { id: "operations", name: "Operations" },
  { id: "support", name: "Support" },
  { id: "analytics", name: "Analytics" },
];

const rows = [
  { id: "1", name: "Alpha", status: "Active" },
  { id: "2", name: "Beta", status: "Paused" },
];

const MOBILE_BP = 768;

function statusTone(status: string): "success" | "warn" {
  return status === "Active" ? "success" : "warn";
}

/**
 * CANONICAL DASHBOARD REFERENCE — copy this wiring for ANY dashboard / CRM / leads /
 * analytics / settings / admin screen. This is NOT a throwaway demo: it is the exact,
 * correct way to assemble a data UI with the app kit:
 *   AppShell + StudioSidebar (native sidebar) + topbar slot + AppChatPanel (floating
 *   copilot) + Page/Section + DataTable/StatTile/StatusBadge/FilterBar.
 * Do NOT hand-roll app-sidebar.tsx, a custom NavLink rail, raw <table>, or bare <input>.
 * Gated to route `/demo/app-kit` via VITE_APP_KIT_DEMO only so the default app stays chat —
 * the *pattern* applies to every dashboard you build. Compose for the user's domain; don't
 * clone the "Operations" copy or the mock workforce list.
 */
export default function AppKitDemo() {
  const [tab, setTab] = useState("overview");
  const [selectedWorkforce, setSelectedWorkforce] = useState(MOCK_WORKFORCES[0]!.id);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [rowFilter, setRowFilter] = useState("");

  const filteredRows = useMemo(() => {
    const q = rowFilter.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (row) =>
        row.name.toLowerCase().includes(q) || row.status.toLowerCase().includes(q),
    );
  }, [rowFilter]);

  const copilotContext = useMemo(
    () => ({
      page: "Operations",
      tab,
      workforceId: selectedWorkforce,
      filters: { rowFilter },
      rowCount: filteredRows.length,
    }),
    [tab, selectedWorkforce, rowFilter, filteredRows.length],
  );

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < MOBILE_BP);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <AppCopilotProvider value={copilotContext}>
      <StudioSidebarBackdrop
        open={isMobile && mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />
      <AppShell
        sidebar={
          <StudioSidebar
            workforces={MOCK_WORKFORCES}
            selectedId={selectedWorkforce}
            onSelect={(id) => {
              setSelectedWorkforce(id);
              if (isMobile) setMobileSidebarOpen(false);
            }}
            mobileOpen={mobileSidebarOpen}
            onMobileOpenChange={setMobileSidebarOpen}
            emptyCaption="Blueprint app-kit demo"
            persistKey={null}
          />
        }
        topbar={
          isMobile && !mobileSidebarOpen ? (
            <div className="flex w-full items-center gap-2">
              <TimbalV2Button
                variant="secondary"
                size="sm"
                isIconOnly
                className="size-[var(--studio-chrome-pill-height)] min-h-[var(--studio-chrome-pill-height)] min-w-[var(--studio-chrome-pill-height)] shrink-0"
                onClick={() => setMobileSidebarOpen(true)}
                aria-label="Open menu"
                aria-expanded={false}
              >
                <Menu className="size-4" />
              </TimbalV2Button>
            </div>
          ) : undefined
        }
        chat={
          <AppChatPanel
            workforceId={selectedWorkforce}
            debug={import.meta.env.DEV}
            welcome={{
              heading: "Ask about Operations",
              subheading: "Questions about this dashboard and workforce.",
            }}
          />
        }
        chatTriggerLabel="Assistant"
        chatCollapsible
      >
        <Page
          title="Operations"
          description="Dashboard + floating copilot — @timbal-ai/timbal-react/app"
          breadcrumbs={
            <Breadcrumbs
              items={[
                { label: "Home", href: "/" },
                { label: "App kit demo" },
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
              { id: "reports", label: "Reports" },
            ]}
            activeId={tab}
            onChange={setTab}
          />

          <Section title="Metrics">
            <div className="grid gap-4 sm:grid-cols-3">
              <StatTile label="Sessions" value="12.4k" hint="+8% vs last week" />
              <StatTile label="Latency p95" value="182ms" />
              <StatTile label="Errors" value="0.3%" />
            </div>
          </Section>

          <Section title="Filters & table">
            <FilterBar>
              <SearchInput
                placeholder="Filter rows…"
                value={rowFilter}
                onChange={(event) => setRowFilter(event.target.value)}
                aria-label="Filter table rows"
              />
            </FilterBar>
            <DataTable
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
              ]}
              rows={filteredRows}
              getRowKey={(r) => r.id}
              emptyMode="inline"
              emptyTitle="No rows match your filter"
              emptyDescription="Try a different name or status."
              caption="Operations workforce rows"
            />
          </Section>

          <Section title="Charts" description="ChartPanel with built-in artifact renderer.">
            <SampleCharts />
          </Section>
        </Page>
      </AppShell>
    </AppCopilotProvider>
  );
}
