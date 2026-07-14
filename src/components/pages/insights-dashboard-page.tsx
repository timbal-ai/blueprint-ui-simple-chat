import * as React from "react";
import {
  BriefcaseIcon,
  CalendarIcon,
  DownloadIcon,
  MailIcon,
  MapPinIcon,
  MoreHorizontalIcon,
  PencilIcon,
  PhoneIcon,
  PlusIcon,
  Trash2Icon,
  UserIcon,
  UserMinusIcon,
  UserPlusIcon,
  UsersIcon,
} from "@/components/icons";

import { BulkActionBar } from "@/components/blocks/bulk-action-bar";
import {
  ActivityFeed,
  DetailDivider,
  DetailSection,
  Field,
  FieldList,
} from "@/components/blocks/detail-panel";
import { FormField, FormGrid, FormSheet } from "@/components/blocks/entity-form";
import {
  AvatarChip,
  AvatarChipCell,
  FilteredTable,
} from "@/components/blocks/filtered-table";
import {
  ContributionHeatmap,
  ScoreBreakdownList,
  SegmentedScoreRing,
  type HeatmapDatum,
} from "@/components/blocks/interactive-charts";
import { MetricTrendCard } from "@/components/blocks/metric-trend-card";
import { PageHeader } from "@/components/blocks/page-header";
import { PageBody } from "@/components/blocks/page-body";
import {
  RecommendationCard,
  type Recommendation,
} from "@/components/blocks/recommendation-card";
import { RosterCard, type RosterPerson } from "@/components/blocks/roster-card";
import { ChartCard, StatOverview } from "@/components/blocks/stat-overview";
import { DemoComposedChart, DemoDonutChart } from "@/components/blocks/chart-demos";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DatePicker,
  DatePickerButton,
  DatePickerCalendar,
  DatePickerContent,
  DatePickerTrigger,
} from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import {
  DataTableColumnHeader,
  selectionColumn,
  type ColumnDef,
} from "@/components/ui/data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

/**
 * InsightsDashboardPage — the reference DASHBOARD template (domain-agnostic).
 * Demo copy uses HR-flavored sample data (employees, hiring) only because it
 * exercises people-centric blocks — fork this file for sales pipelines, support
 * queues, inventory, finance KPIs, product analytics, ops command centers, etc.
 *
 * Structure to keep: PageHeader with actions (Export + FormSheet create),
 * StatOverview KPI band, MetricTrendCard + RosterCard band, approve/dismiss
 * RecommendationCard grid, composed + donut ChartCards, score ring + heatmap
 * band, FilteredTable with row detail Sheet + BulkActionBar.
 *
 * Cut bands you don't need; never flatten a kept band into hand-rolled divs.
 */

interface Employee {
  id: string;
  name: string;
  department: string;
  assigned: number;
  completed: number;
  ongoing: number;
  workload: "light" | "balanced" | "heavy";
}

const DEMO_EMPLOYEES: Employee[] = [
  { id: "001235", name: "Aditya Anugrah", department: "Engineering", assigned: 120, completed: 110, ongoing: 10, workload: "balanced" },
  { id: "001236", name: "Fauzan Pradana", department: "Engineering", assigned: 198, completed: 85, ongoing: 113, workload: "heavy" },
  { id: "001237", name: "Salsabila Putri", department: "Design", assigned: 105, completed: 90, ongoing: 15, workload: "balanced" },
  { id: "001238", name: "Marta Vidal", department: "People", assigned: 64, completed: 61, ongoing: 3, workload: "light" },
  { id: "001239", name: "Jon Ansotegui", department: "Engineering", assigned: 142, completed: 118, ongoing: 24, workload: "balanced" },
  { id: "001240", name: "Irene Costa", department: "Design", assigned: 88, completed: 52, ongoing: 36, workload: "heavy" },
  { id: "001241", name: "Peio Etxeberria", department: "Sales", assigned: 76, completed: 70, ongoing: 6, workload: "light" },
  { id: "001242", name: "Nadia Rahma", department: "People", assigned: 93, completed: 81, ongoing: 12, workload: "balanced" },
  { id: "001243", name: "Carles Puig", department: "Sales", assigned: 131, completed: 96, ongoing: 35, workload: "heavy" },
  { id: "001244", name: "Aina Ferrer", department: "Engineering", assigned: 117, completed: 108, ongoing: 9, workload: "balanced" },
  { id: "001245", name: "Hugo Lasa", department: "Design", assigned: 59, completed: 55, ongoing: 4, workload: "light" },
  { id: "001246", name: "Laia Bosch", department: "People", assigned: 102, completed: 74, ongoing: 28, workload: "heavy" },
];

const DEMO_RECOMMENDATIONS: Recommendation[] = [
  {
    id: "rec-eng-workload",
    title: "Engineering workload heavy, rebalance 113 ongoing tasks",
    summary:
      "Two engineers carry 46% of open tasks while four teammates run light.",
    priority: "high",
    details: [
      { label: "Projected impact", value: "-30% overdue tasks next sprint" },
      { label: "Related", value: "Engineering" },
    ],
  },
  {
    id: "rec-sales-attrition",
    title: "Departures up 12%, schedule stay interviews in Sales",
    summary:
      "Attrition is concentrated in Sales; 3 reps flagged heavy workload for 6+ weeks.",
    priority: "high",
    details: [
      { label: "Projected impact", value: "Retain ~3 at-risk employees" },
      { label: "Related", value: "Sales" },
    ],
  },
  {
    id: "rec-onboarding-buddies",
    title: "320 new hires this month, assign onboarding buddies",
    summary:
      "Buddy coverage sits at 61% for this cohort; unassigned hires ramp twice as slowly.",
    priority: "medium",
    details: [
      { label: "Projected impact", value: "Full ramp ~3 weeks sooner" },
      { label: "Related", value: "People" },
    ],
  },
];

/** Payroll trend per range — the MetricTrendCard morphs between these. */
const DEMO_PAYROLL = {
  Weekly: {
    value: "$482,300",
    delta: "+2.1%",
    data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((label, i) => ({
      label,
      value: [64, 71, 69, 78, 82, 58, 52][i],
    })),
  },
  Monthly: {
    value: "$1.94M",
    delta: "+6.8%",
    data: ["W1", "W2", "W3", "W4"].map((label, i) => ({
      label,
      value: [430, 465, 488, 512][i],
    })),
  },
  Yearly: {
    value: "$22.8M",
    delta: "+11.4%",
    data: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map(
      (label, i) => ({
        label,
        value: [1.51, 1.55, 1.62, 1.68, 1.71, 1.79, 1.85, 1.88, 1.94, 1.99, 2.08, 2.18][i],
      }),
    ),
  },
};

const DEMO_HIRES: RosterPerson[] = [
  { id: "h1", name: "June Rodriguez", meta: "Joined today", tag: "Product Designer" },
  { id: "h2", name: "Miguel Santos", meta: "Joined 2 days ago", tag: "Backend Engineer" },
  { id: "h3", name: "Anna Kowalska", meta: "Joined this week", tag: "Account Executive" },
  { id: "h4", name: "Tom Becker", meta: "Joined this week", tag: "Data Analyst" },
  { id: "h5", name: "Leire Zubiri", meta: "Joined last week", tag: "People Partner" },
  { id: "h6", name: "Oriol Serra", meta: "Joined last week", tag: "Frontend Engineer" },
  { id: "h7", name: "Claire Dubois", meta: "Joined last week", tag: "QA Engineer" },
  { id: "h8", name: "Iker Mendoza", meta: "Joined 2 weeks ago", tag: "Solutions Architect" },
];

/** Engagement score ring segments + companion breakdown rows. */
const DEMO_ENGAGEMENT = {
  score: 82,
  segments: [
    { value: 34, tone: 1, label: "Recognition" } as const,
    { value: 28, tone: 3, label: "Growth" } as const,
    { value: 20, tone: 5, label: "Wellbeing" } as const,
  ],
  breakdown: [
    { id: "recognition", label: "Recognition", value: "8.6", tone: 1 as const },
    { id: "growth", label: "Growth", value: "7.9", tone: 3 as const },
    { id: "wellbeing", label: "Wellbeing", value: "7.2", tone: 5 as const },
  ],
};

/** ~26 weeks of deterministic pseudo-random hiring events for the heatmap. */
const DEMO_HIRING_ACTIVITY: HeatmapDatum[] = Array.from({ length: 26 * 7 }, (_, i) => {
  const count = Math.max(0, Math.round(Math.sin(i / 3.1) * 2 + Math.sin(i / 11.7) * 2) + (i % 5 === 0 ? 2 : 0));
  return { count, label: `${count} hiring ${count === 1 ? "event" : "events"}` };
});

const HIRING_MONTH_LABELS: Record<number, string> = {
  0: "Feb", 4: "Mar", 9: "Apr", 13: "May", 17: "Jun", 22: "Jul",
};

const WORKLOAD_BADGE: Record<
  Employee["workload"],
  { label: string; variant: React.ComponentProps<typeof Badge>["variant"] }
> = {
  light: { label: "Light", variant: "success" },
  balanced: { label: "Balanced", variant: "info" },
  heavy: { label: "Heavy", variant: "warning" },
};

function employeeColumns(
  onAction?: (action: string, employee: Employee) => void,
): ColumnDef<Employee>[] {
  return [
    selectionColumn<Employee>(),
    {
      accessorKey: "id",
      header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
      size: 96,
      cell: ({ row }) => (
        <span className="text-muted-foreground tabular-nums">
          {row.original.id}
        </span>
      ),
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Full name" />
      ),
      size: 220,
      cell: ({ row }) => <AvatarChipCell name={row.original.name} />,
    },
    {
      accessorKey: "department",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Department" />
      ),
      size: 140,
    },
    {
      accessorKey: "assigned",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Tasks assigned" />
      ),
      size: 130,
      cell: ({ row }) => (
        <span className="tabular-nums">{row.original.assigned} tasks</span>
      ),
    },
    {
      accessorKey: "completed",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Completed" />
      ),
      size: 120,
      cell: ({ row }) => (
        <span className="tabular-nums">{row.original.completed} tasks</span>
      ),
    },
    {
      accessorKey: "ongoing",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Ongoing" />
      ),
      size: 110,
      cell: ({ row }) => (
        <span className="tabular-nums">{row.original.ongoing} tasks</span>
      ),
    },
    {
      accessorKey: "workload",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Workload" />
      ),
      size: 110,
      cell: ({ row }) => {
        const w = WORKLOAD_BADGE[row.original.workload];
        return <Badge variant={w.variant}>{w.label}</Badge>;
      },
    },
    {
      id: "actions",
      size: 48,
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={`Actions for ${row.original.name}`}
              // Never let the row's onRowClick fire too — two overlays at
              // once (dropdown + sheet) deadlock Radix's pointer-events lock.
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
            <DropdownMenuItem onSelect={() => onAction?.("view", row.original)}>
              <UserIcon />
              View profile
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onAction?.("edit", row.original)}>
              <PencilIcon />
              Edit assignments
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onSelect={() => onAction?.("offboard", row.original)}
            >
              <UserMinusIcon />
              Start offboarding
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];
}

function InsightsDashboardPage({
  employees = DEMO_EMPLOYEES,
  recommendations = DEMO_RECOMMENDATIONS,
  onEmployeeAction,
  onRecommendationAction,
  onExport,
}: {
  employees?: Employee[];
  recommendations?: Recommendation[];
  onEmployeeAction?: (action: string, employee: Employee) => void;
  onRecommendationAction?: (action: string, rec: Recommendation) => void;
  /** Header "Export" action. */
  onExport?: () => void;
}) {
  const [range, setRange] = React.useState("monthly");
  const [member, setMember] = React.useState<Employee | null>(null);
  const [addOpen, setAddOpen] = React.useState(false);
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});

  const handleAction = React.useCallback(
    (action: string, employee: Employee) => {
      if (action === "view") setMember(employee);
      onEmployeeAction?.(action, employee);
    },
    [onEmployeeAction],
  );

  const columns = React.useMemo(
    () => employeeColumns(handleAction),
    [handleAction],
  );

  return (
    <PageBody>
      {/* No breadcrumb: this page is 1 level deep — eyebrow trails are only
          for nested paths (>2 levels) and never start with the app name. */}
      <PageHeader
        title="Insights Dashboard"
        description="KPIs, trends, recommendations, and the records that need attention"
        actions={
          <>
            <Button variant="outline" onClick={onExport}>
              <DownloadIcon />
              Export
            </Button>
            <Button onClick={() => setAddOpen(true)}>
              <PlusIcon />
              Add employee
            </Button>
          </>
        }
      />

      <StatOverview
        columns={3}
        stats={[
          {
            id: "employees",
            label: "Total Employee",
            value: "125,450",
            delta: "20%",
            deltaTone: "positive",
            hint: "Compared to the previous period",
            action: (
              <Button variant="ghost" size="icon-sm" aria-label="Employee stat options">
                <MoreHorizontalIcon />
              </Button>
            ),
          },
          {
            id: "hires",
            label: "New Hires",
            value: "320",
            delta: "12%",
            deltaTone: "positive",
            hint: "Joined this month",
            action: <UserPlusIcon className="size-4 text-muted-foreground/60" />,
          },
          {
            id: "departures",
            label: "Departures",
            value: "45",
            delta: "12%",
            deltaTone: "negative",
            hint: "Compared to the previous period",
            action: <UsersIcon className="size-4 text-muted-foreground/60" />,
          },
        ]}
      />

      {/* Trend + roster band — MetricTrendCard morphs between ranges,
          RosterCard pages through recent hires. Both are standalone blocks. */}
      <div className="grid items-stretch gap-4 lg:grid-cols-2">
        <MetricTrendCard
          title="Payroll cost"
          ranges={DEMO_PAYROLL}
          defaultRange="Monthly"
          tone={5}
          seriesLabel="Payroll"
        />
        <RosterCard
          title="Recent hires"
          count={DEMO_HIRES.length}
          people={DEMO_HIRES}
          pageSize={4}
          action={
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Recent hires options"
            >
              <MoreHorizontalIcon />
            </Button>
          }
        />
      </div>

      <section className="flex min-w-0 flex-col gap-3">
        <div className="flex flex-col gap-0.5">
          <h2 className="text-lg font-medium tracking-tight text-foreground">
            Recommended actions
          </h2>
          <p className="text-sm text-muted-foreground">
            What's winning, what you're missing, what's next.
          </p>
        </div>
        <div className="grid items-stretch gap-4 md:grid-cols-2 2xl:grid-cols-3">
          {recommendations.map((rec) => (
            <RecommendationCard
              key={rec.id}
              recommendation={rec}
              onApprove={(r) => onRecommendationAction?.("approve", r)}
              onDismiss={(r) => onRecommendationAction?.("dismiss", r)}
              onEdit={(r) => onRecommendationAction?.("edit", r)}
            />
          ))}
        </div>
      </section>

      {/* Charts band — the composed trend keeps the lead slot; the donut
          carries the categorical breakdown beside it. */}
      <div className="grid items-stretch gap-4 lg:grid-cols-[3fr_2fr]">
        <ChartCard
          title="Workforce Overview"
          description="Track employee growth and attrition trends over time."
          height="18rem"
          action={
            <Select value={range} onValueChange={setRange}>
              <SelectTrigger size="sm" className="w-28" aria-label="Chart range">
                <SelectValue />
              </SelectTrigger>
              <SelectContent align="end">
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          }
        >
          <DemoComposedChart className="h-full w-full" />
        </ChartCard>
        <ChartCard
          title="Headcount by department"
          description="Current distribution across teams."
          height="18rem"
        >
          <div className="flex h-full items-center justify-center">
            <DemoDonutChart />
          </div>
        </ChartCard>
      </div>

      {/* Engagement + hiring-activity band — the interactive-charts kit:
          segmented score ring with breakdown rows, contribution heatmap. */}
      <div className="grid items-stretch gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Engagement score</CardTitle>
            <CardDescription>
              Quarterly pulse survey across all departments.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col gap-5">
            <div className="flex flex-1 items-center justify-center">
              <SegmentedScoreRing segments={DEMO_ENGAGEMENT.segments} size={140}>
                <span className="text-4xl font-medium tracking-tight tabular-nums">
                  {DEMO_ENGAGEMENT.score}
                </span>
              </SegmentedScoreRing>
            </div>
            <ScoreBreakdownList items={DEMO_ENGAGEMENT.breakdown} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Hiring activity</CardTitle>
            <CardDescription>
              Offers, starts, and interviews over the last six months.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-1 items-center">
            <ContributionHeatmap
              data={DEMO_HIRING_ACTIVITY}
              tone={1}
              columnLabels={HIRING_MONTH_LABELS}
              className="w-full"
            />
          </CardContent>
        </Card>
      </div>

      <section className="flex min-w-0 flex-col gap-3">
        <div className="flex flex-col gap-0.5">
          <h2 className="text-lg font-medium tracking-tight text-foreground">
            Team Performance Tracker
          </h2>
          <p className="text-sm text-muted-foreground">
            Monitor task assignments and team workload.
          </p>
        </div>
        <FilteredTable
          columns={columns}
          data={employees}
          searchPlaceholder="Search employees…"
          facets={[
            {
              id: "department",
              label: "All departments",
              getValue: (row) => row.department,
              options: [
                { value: "Engineering", label: "Engineering" },
                { value: "Design", label: "Design" },
                { value: "People", label: "People" },
                { value: "Sales", label: "Sales" },
              ],
            },
          ]}
          moreFilters={[
            {
              id: "workload",
              label: "Workload",
              getValue: (row) => row.workload,
              options: [
                { value: "light", label: "Light" },
                { value: "balanced", label: "Balanced" },
                { value: "heavy", label: "Heavy" },
              ],
            },
          ]}
          pagination
          pageSize={8}
          itemsLabel="employees"
          rowSelection={rowSelection}
          onRowSelectionChange={setRowSelection}
          onRowClick={(row) => handleAction("view", row.original)}
        />
      </section>

      {/* Selection surfaces the bulk bubble; row click opens the big
          member sheet — both are standalone blocks, reusable anywhere. */}
      <BulkActionBar
        count={Object.keys(rowSelection).length}
        itemsLabel="members selected"
        onClear={() => setRowSelection({})}
        actions={[
          {
            id: "edit",
            label: "Edit",
            icon: PencilIcon,
            onClick: () => setRowSelection({}),
          },
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

      <MemberDetailSheet
        member={member}
        onOpenChange={(open) => {
          if (!open) setMember(null);
        }}
        onAction={onEmployeeAction}
      />

      <AddEmployeeSheet
        open={addOpen}
        onOpenChange={setAddOpen}
        onCreate={(employee) => onEmployeeAction?.("create", employee)}
      />
    </PageBody>
  );
}

/* ---------------------------------------------------------------------------
 * AddEmployeeSheet — the standard create flow: FormSheet (floating right
 * sheet, scrollable body, pinned Cancel/Save) with FormField-wrapped
 * controls — Input, Select, and the house DatePicker. Fork for any
 * "primary action opens a create form" surface.
 * ------------------------------------------------------------------------- */

function AddEmployeeSheet({
  open,
  onOpenChange,
  onCreate,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate?: (employee: Employee) => void;
}) {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [department, setDepartment] = React.useState("Engineering");
  const [startDate, setStartDate] = React.useState<Date | undefined>();
  const [dateOpen, setDateOpen] = React.useState(false);
  const [error, setError] = React.useState<string>();

  const submit = () => {
    if (!name.trim()) {
      setError("Full name is required.");
      return;
    }
    setError(undefined);
    onCreate?.({
      id: String(Date.now()).slice(-6),
      name: name.trim(),
      department,
      assigned: 0,
      completed: 0,
      ongoing: 0,
      workload: "light",
    });
    onOpenChange(false);
    setName("");
    setEmail("");
    setStartDate(undefined);
  };

  return (
    <FormSheet
      open={open}
      onOpenChange={onOpenChange}
      title="Add employee"
      description="Create the profile — assignments come later."
      submitLabel="Add employee"
      onSubmit={submit}
    >
      <FormGrid>
        <FormField label="Full name" htmlFor="new-employee-name" required error={error}>
          <Input
            id="new-employee-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jane Cooper"
          />
        </FormField>
        <FormField
          label="Work email"
          htmlFor="new-employee-email"
          help="They'll receive the onboarding invite here."
        >
          <Input
            id="new-employee-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="jane@acme.co"
          />
        </FormField>
        <FormGrid columns={2}>
          <FormField label="Department">
            <Select value={department} onValueChange={setDepartment}>
              <SelectTrigger className="w-full" aria-label="Department">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Engineering">Engineering</SelectItem>
                <SelectItem value="Design">Design</SelectItem>
                <SelectItem value="People">People</SelectItem>
                <SelectItem value="Sales">Sales</SelectItem>
              </SelectContent>
            </Select>
          </FormField>
          <FormField label="Start date">
            <DatePicker open={dateOpen} onOpenChange={setDateOpen}>
              <DatePickerTrigger asChild>
                <DatePickerButton date={startDate} className="w-full" />
              </DatePickerTrigger>
              <DatePickerContent>
                <DatePickerCalendar
                  mode="single"
                  selected={startDate}
                  onSelect={(d: Date | undefined) => {
                    setStartDate(d);
                    setDateOpen(false);
                  }}
                />
              </DatePickerContent>
            </DatePicker>
          </FormField>
        </FormGrid>
      </FormGrid>
    </FormSheet>
  );
}

/* ---------------------------------------------------------------------------
 * MemberDetailSheet — the BIG record sheet: identity header, KPI chips,
 * workload progress, profile fields, and an activity trail, all inside a
 * floating xl sheet. Fork for any "row → full record" surface.
 * ------------------------------------------------------------------------- */

/** Deterministic demo contact info derived from the name. */
function demoContact(member: Employee) {
  const slug = member.name.toLowerCase().replace(/[^a-z]+/g, ".");
  return {
    email: `${slug}@acme.co`,
    phone: `+34 6${String(Math.abs([...member.id].reduce((a, c) => a * 7 + c.charCodeAt(0), 3)) % 90000000 + 10000000)}`,
    location: ["Barcelona, ES", "Donostia, ES", "Madrid, ES", "Remote"][
      Number(member.id) % 4
    ],
    manager: "Marta Vidal",
    started: ["Mar 2021", "Jun 2022", "Jan 2023", "Sep 2024"][Number(member.id) % 4],
  };
}

function MemberDetailSheet({
  member,
  onOpenChange,
  onAction,
}: {
  member: Employee | null;
  onOpenChange: (open: boolean) => void;
  onAction?: (action: string, employee: Employee) => void;
}) {
  const contact = member ? demoContact(member) : null;
  const completion = member
    ? Math.round((member.completed / member.assigned) * 100)
    : 0;
  const workload = member ? WORKLOAD_BADGE[member.workload] : null;

  return (
    <Sheet open={member !== null} onOpenChange={onOpenChange}>
      <SheetContent size="xl" className="flex flex-col gap-0">
        {member && contact && workload ? (
          <>
            <SheetHeader className="gap-3 border-b border-border">
              <div className="flex items-center gap-3">
                <AvatarChip name={member.name} size="lg" />
                <div className="flex min-w-0 flex-col gap-0.5">
                  <SheetTitle className="text-xl">{member.name}</SheetTitle>
                  <SheetDescription>
                    {member.department} · Employee {member.id}
                  </SheetDescription>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                <Badge variant={workload.variant}>{workload.label} workload</Badge>
                <Badge variant="outline">{member.department}</Badge>
                <Badge variant="secondary">Full-time</Badge>
              </div>
            </SheetHeader>

            <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto p-4">
              <DetailSection title="Task completion">
                <div className="flex flex-col gap-2 rounded-xl border border-border bg-muted/40 p-3.5">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-2xl font-medium tracking-tight tabular-nums">
                      {completion}%
                    </span>
                    <span className="text-xs text-muted-foreground tabular-nums">
                      {member.completed} of {member.assigned} tasks · {member.ongoing} ongoing
                    </span>
                  </div>
                  <Progress value={completion} />
                </div>
              </DetailSection>

              <DetailDivider />

              <DetailSection
                title="Profile"
                action={
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onAction?.("edit", member)}
                  >
                    <PencilIcon />
                    Edit
                  </Button>
                }
              >
                <FieldList>
                  <Field label="Email">
                    <span className="flex items-center gap-1.5">
                      <MailIcon className="size-3.5 text-muted-foreground/70" />
                      {contact.email}
                    </span>
                  </Field>
                  <Field label="Phone">
                    <span className="flex items-center gap-1.5">
                      <PhoneIcon className="size-3.5 text-muted-foreground/70" />
                      {contact.phone}
                    </span>
                  </Field>
                  <Field label="Location">
                    <span className="flex items-center gap-1.5">
                      <MapPinIcon className="size-3.5 text-muted-foreground/70" />
                      {contact.location}
                    </span>
                  </Field>
                  <Field label="Manager">{contact.manager}</Field>
                  <Field label="Started">
                    <span className="flex items-center gap-1.5">
                      <CalendarIcon className="size-3.5 text-muted-foreground/70" />
                      {contact.started}
                    </span>
                  </Field>
                  <Field label="Role">
                    <span className="flex items-center gap-1.5">
                      <BriefcaseIcon className="size-3.5 text-muted-foreground/70" />
                      {member.department} team
                    </span>
                  </Field>
                </FieldList>
              </DetailSection>

              <DetailDivider />

              <DetailSection title="Recent activity">
                <ActivityFeed
                  items={[
                    {
                      id: "1",
                      title: (
                        <>
                          Completed <span className="font-medium">Q3 planning review</span>
                        </>
                      ),
                      timestamp: "2 hours ago",
                    },
                    {
                      id: "2",
                      title: `Assigned ${member.ongoing} new tasks`,
                      timestamp: "Yesterday",
                    },
                    {
                      id: "3",
                      title: "Updated availability to hybrid",
                      timestamp: "3 days ago",
                    },
                  ]}
                />
              </DetailSection>
            </div>

            <SheetFooter className="flex-row justify-end gap-2 border-t border-border">
              <Button
                variant="ghost"
                className="mr-auto text-destructive hover:bg-destructive/10 hover:text-destructive"
                onClick={() => onAction?.("offboard", member)}
              >
                <UserMinusIcon />
                Offboard
              </Button>
              <Button variant="outline" onClick={() => onAction?.("export", member)}>
                <DownloadIcon />
                Export
              </Button>
              <Button onClick={() => onAction?.("edit", member)}>
                <PencilIcon />
                Edit assignments
              </Button>
            </SheetFooter>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}

export {
  AddEmployeeSheet,
  DEMO_EMPLOYEES,
  DEMO_RECOMMENDATIONS,
  InsightsDashboardPage,
  MemberDetailSheet,
};
export type { Employee };
