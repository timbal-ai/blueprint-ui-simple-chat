import * as React from "react";

import { ChevronDownIcon, DownloadIcon, Trash2Icon } from "@/components/icons";

import { BulkActionBar } from "@/components/blocks/bulk-action-bar";
import { PageBody } from "@/components/blocks/page-body";
import { PageHeader } from "@/components/blocks/page-header";
import { FilteredTable } from "@/components/blocks/filtered-table";
import {
  ChartRangeTabs,
  ContributionHeatmap,
  TrackedBarChart,
  type HeatmapDatum,
  type TrackedBarDatum,
} from "@/components/blocks/interactive-charts";
import { MetricTrendCard } from "@/components/blocks/metric-trend-card";
import { RosterCard, type RosterPerson } from "@/components/blocks/roster-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DataTableColumnHeader,
  selectionColumn,
  type ColumnDef,
} from "@/components/ui/data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/**
 * EarningsPage — the reference EARNINGS/USAGE-ANALYTICS template (the
 * creator-dashboard grammar): a headline money number with a vivid delta
 * badge, a Weekly/Monthly/Yearly range toggle that swaps the dataset of a
 * tracked-bar chart, a stat-chip band, a contributions heatmap with
 * sparse month labels, and a payouts FilteredTable (search, status facet,
 * selection surfacing a BulkActionBar).
 *
 * Fork this file for revenue, usage, or contribution analytics — keep the
 * headline → range tabs → chart rhythm and swap the datasets.
 */

const RANGES = ["Weekly", "Monthly", "Yearly"] as const;
type Range = (typeof RANGES)[number];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const DEMO_EARNINGS: Record<Range, { total: string; delta: string; data: TrackedBarDatum[] }> = {
  Weekly: {
    total: "$7,462",
    delta: "+14.8%",
    data: MONTHS.map((label, i) => ({
      label,
      value: [3100, 7400, 9800, 7000, 3500, 2400, 3600, 5000, 6700, 4400, 11400, 8100][i],
    })),
  },
  Monthly: {
    total: "$32,180",
    delta: "+8.2%",
    data: MONTHS.map((label, i) => ({
      label,
      value: [5100, 5900, 7200, 9100, 9700, 11000, 11400, 9800, 8600, 7200, 6900, 8100][i],
    })),
  },
  Yearly: {
    total: "$214,900",
    delta: "+21.4%",
    data: ["2019", "2020", "2021", "2022", "2023", "2024", "2025", "2026"].map((label, i) => ({
      label,
      value: [9000, 14000, 22000, 28000, 34000, 41000, 52000, 61000][i],
    })),
  },
};

/** Revenue trend per range — MetricTrendCard morphs between these. */
const DEMO_REVENUE = {
  Weekly: {
    value: "$18,240",
    delta: "+9.4%",
    data: MONTHS.map((label, i) => ({
      label,
      value: [1400, 1900, 2600, 2350, 3300, 3050, 2800, 3600, 4600, 4200, 3900, 5600][i],
    })),
  },
  Monthly: {
    value: "$64,120",
    delta: "+6.1%",
    data: MONTHS.map((label, i) => ({
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

const DEMO_HIRES: RosterPerson[] = [
  { id: "livia", name: "Livia Saris", meta: "Joined today", tag: "Backend Engineer", avatarSrc: "https://i.pravatar.cc/80?img=47" },
  { id: "jaydon", name: "Jaydon Aminoff", meta: "2 days ago", tag: "UI Designer", avatarSrc: "https://i.pravatar.cc/80?img=12" },
  { id: "maria", name: "Maria Lubin", meta: "5 days ago", tag: "User Researcher", avatarSrc: "https://i.pravatar.cc/80?img=32" },
  { id: "ann", name: "Ann Press", meta: "A week ago", tag: "DevOps Engineer", avatarSrc: "https://i.pravatar.cc/80?img=25" },
  { id: "koray", name: "Koray Okumus", meta: "2 weeks ago", tag: "Data Analyst", avatarSrc: "https://i.pravatar.cc/80?img=61" },
  { id: "lana", name: "Lana Steiner", meta: "3 weeks ago", tag: "Product Manager", avatarSrc: "https://i.pravatar.cc/80?img=44" },
];

const DEMO_STATS = [
  { id: "lifetime", label: "Lifetime tokens", value: "9B" },
  { id: "peak", label: "Peak tokens", value: "562.7M" },
  { id: "longest", label: "Longest task", value: "12h 54m" },
  { id: "streak", label: "Top streak", value: "62 days" },
];

/** 52 weeks × 7 days of pseudo-random contribution counts. */
const DEMO_CONTRIBUTIONS: HeatmapDatum[] = Array.from({ length: 364 }, (_, i) => {
  const count = (i * 2654435761) % 11 > 6 ? 0 : ((i * 40503) % 10);
  const date = new Date(2026, 0, 1 + i);
  return {
    count,
    label: `${count} contribution${count === 1 ? "" : "s"} on ${date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`,
  };
});

/** Month labels keyed by the week column where each month starts. */
const MONTH_COLUMNS = Object.fromEntries(
  MONTHS.map((m, i) => [Math.round((i * 52) / 12), m]),
);

interface Payout {
  id: string;
  date: string;
  source: string;
  method: string;
  amount: number;
  status: "paid" | "pending" | "failed";
}

const DEMO_PAYOUTS: Payout[] = [
  { id: "PO-1041", date: "Jul 10, 2026", source: "Marketplace sales", method: "Bank transfer", amount: 4820, status: "paid" },
  { id: "PO-1040", date: "Jul 3, 2026", source: "Subscriptions", method: "Bank transfer", amount: 3110, status: "paid" },
  { id: "PO-1039", date: "Jun 26, 2026", source: "Marketplace sales", method: "PayPal", amount: 5245, status: "paid" },
  { id: "PO-1038", date: "Jun 19, 2026", source: "Sponsorships", method: "Bank transfer", amount: 7600, status: "pending" },
  { id: "PO-1037", date: "Jun 12, 2026", source: "Subscriptions", method: "PayPal", amount: 2980, status: "paid" },
  { id: "PO-1036", date: "Jun 5, 2026", source: "Marketplace sales", method: "Bank transfer", amount: 4415, status: "failed" },
  { id: "PO-1035", date: "May 29, 2026", source: "Sponsorships", method: "Bank transfer", amount: 6820, status: "paid" },
  { id: "PO-1034", date: "May 22, 2026", source: "Subscriptions", method: "PayPal", amount: 3050, status: "paid" },
];

const PAYOUT_STATUS: Record<
  Payout["status"],
  { label: string; variant: React.ComponentProps<typeof Badge>["variant"] }
> = {
  paid: { label: "Paid", variant: "success" },
  pending: { label: "Pending", variant: "warning" },
  failed: { label: "Failed", variant: "destructive" },
};

const PAYOUT_COLUMNS: ColumnDef<Payout>[] = [
  selectionColumn<Payout>(),
  {
    accessorKey: "id",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Payout" />,
    size: 110,
    cell: ({ row }) => (
      <span className="text-muted-foreground tabular-nums">{row.original.id}</span>
    ),
  },
  {
    accessorKey: "date",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Date" />,
    size: 130,
  },
  {
    accessorKey: "source",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Source" />,
    size: 180,
  },
  {
    accessorKey: "method",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Method" />,
    size: 140,
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.original.method}</span>
    ),
  },
  {
    accessorKey: "amount",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Amount" />,
    size: 110,
    cell: ({ row }) => (
      <span className="font-medium tabular-nums">
        ${row.original.amount.toLocaleString()}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    size: 100,
    cell: ({ row }) => {
      const s = PAYOUT_STATUS[row.original.status];
      return <Badge variant={s.variant}>{s.label}</Badge>;
    },
  },
];

function EarningsPage({
  onAction,
}: {
  onAction?: (action: string) => void;
}) {
  const [range, setRange] = React.useState<Range>("Monthly");
  const [activityRange, setActivityRange] = React.useState<Range>("Weekly");
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});
  const earnings = DEMO_EARNINGS[range];

  return (
    <PageBody>
      <PageHeader
        title="Earnings"
        description="Revenue and contribution activity across the year."
        actions={
          <Button variant="outline" onClick={() => onAction?.("export")}>
            <DownloadIcon />
            Export
          </Button>
        }
      />

      {/* Earned so far — range tabs swap the dataset. */}
      <Card className="gap-5">
        <CardContent className="flex flex-1 flex-col gap-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex min-w-0 flex-col gap-1">
              <span className="text-sm text-muted-foreground">Earned so far</span>
              <span className="flex items-center gap-2">
                <span className="text-2xl font-medium tracking-tight tabular-nums">
                  {earnings.total}
                </span>
                <Badge variant="success">{earnings.delta}</Badge>
              </span>
            </div>
            <ChartRangeTabs
              options={RANGES}
              value={range}
              onChange={(v) => setRange(v as Range)}
            />
          </div>
          <TrackedBarChart
            data={earnings.data}
            tone="success"
            height="13rem"
            selectable={false}
            formatValue={(v) => `$${v.toLocaleString()}`}
          />
        </CardContent>
      </Card>

      {/* Revenue trend + recent hires — the reference pairing. */}
      <div className="grid grid-cols-1 items-stretch gap-4 xl:grid-cols-[3fr_2fr]">
        <MetricTrendCard
          title="Revenue"
          tone="success"
          ranges={DEMO_REVENUE}
          defaultRange="Weekly"
        />
        <RosterCard
          title="Recent hires"
          count={56}
          people={DEMO_HIRES}
          onSelectPerson={(id) => onAction?.(`hire:${id}`)}
          action={
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-foreground">
                  Board team
                  <ChevronDownIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={() => onAction?.("team:board")}>
                  Board team
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => onAction?.("team:product")}>
                  Product team
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => onAction?.("team:all")}>
                  All teams
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          }
        />
      </div>

      {/* Contributions — stat chips + intensity grid. */}
      <Card className="gap-5">
        <CardContent className="flex flex-col gap-5">
          <div className="flex min-w-0 flex-col gap-1">
            <span className="text-sm text-muted-foreground">Contributions this year</span>
            <span className="flex items-center gap-2">
              <span className="text-2xl font-medium tracking-tight tabular-nums">$7,462</span>
              <Badge variant="success">+14.8%</Badge>
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
            {DEMO_STATS.map((stat) => (
              <div
                key={stat.id}
                className="flex min-w-0 flex-col gap-0.5 rounded-xl border border-border bg-card px-3.5 py-2.5"
              >
                <span className="truncate text-sm font-medium text-foreground">
                  {stat.value}
                </span>
                <span className="truncate text-sm text-muted-foreground">{stat.label}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-sm text-muted-foreground">Activity</span>
            <ChartRangeTabs
              options={RANGES}
              value={activityRange}
              onChange={(v) => setActivityRange(v as Range)}
            />
          </div>
          <ContributionHeatmap
            data={DEMO_CONTRIBUTIONS}
            tone={2}
            columnLabels={MONTH_COLUMNS}
          />
        </CardContent>
      </Card>

      {/* Payout history — the entity-index grammar inside the analytics
          page: search + status facet + selectable rows + bulk actions. */}
      <section className="flex min-w-0 flex-col gap-3">
        <div className="flex flex-col gap-0.5">
          <h2 className="text-lg font-medium tracking-tight text-foreground">
            Payout history
          </h2>
          <p className="text-sm text-muted-foreground">
            Every transfer to your account, most recent first.
          </p>
        </div>
        <FilteredTable
          columns={PAYOUT_COLUMNS}
          data={DEMO_PAYOUTS}
          searchPlaceholder="Search payouts…"
          facets={[
            {
              id: "status",
              label: "All statuses",
              getValue: (row) => row.status,
              options: [
                { value: "paid", label: "Paid" },
                { value: "pending", label: "Pending" },
                { value: "failed", label: "Failed" },
              ],
            },
          ]}
          pagination
          pageSize={6}
          itemsLabel="payouts"
          rowSelection={rowSelection}
          onRowSelectionChange={setRowSelection}
          onRowClick={(row) => onAction?.(`payout:${row.original.id}`)}
        />
      </section>

      <BulkActionBar
        count={Object.keys(rowSelection).length}
        itemsLabel="payouts selected"
        onClear={() => setRowSelection({})}
        actions={[
          {
            id: "export",
            label: "Export",
            icon: DownloadIcon,
            onClick: () => setRowSelection({}),
          },
          {
            id: "remove",
            label: "Remove",
            icon: Trash2Icon,
            tone: "destructive",
            onClick: () => setRowSelection({}),
          },
        ]}
      />
    </PageBody>
  );
}

export { EarningsPage, DEMO_CONTRIBUTIONS, DEMO_EARNINGS };
export type { Range };
