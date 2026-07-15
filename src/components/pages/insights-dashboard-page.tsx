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
  ContributionsGrid,
  type ContributionDatum,
} from "@/components/application/dashboard/contributions-card";
import {
  RecentHiresCard,
  type RosterPerson,
} from "@/components/application/dashboard/recent-hires-card";
import {
  RevenueTrendCard,
  type TrendPeriod,
} from "@/components/application/dashboard/revenue-trend-card";
import { SleepScoreCard } from "@/components/application/medical/sleep-score-card";
import { PageHeader } from "@/components/blocks/page-header";
import { PageBody } from "@/components/blocks/page-body";
import {
  RecommendationCard,
  type Recommendation,
} from "@/components/blocks/recommendation-card";
import { ChartCard, StatOverview } from "@/components/blocks/stat-overview";
import { DemoComposedChart, DemoDonutChart } from "@/components/blocks/chart-demos";
import { Chip } from "@/components/base/badges/chip";
import { Button } from "@/components/base/buttons/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DatePicker } from "@/components/base/date-picker/date-picker";
import type { CalendarDate } from "@internationalized/date";
import { InputBase } from "@/components/base/input/input";
import {
  DataTableColumnHeader,
  selectionColumn,
  type ColumnDef,
} from "@/components/blocks/filtered-table";
import {
  Dropdown,
  DropdownDivider,
  DropdownGroup,
  DropdownItem,
  DropdownPopover,
  DropdownTrigger,
} from "@/components/base/dropdown/dropdown";
import { Progress } from "@/components/ui/progress";
import { Select, SelectItem } from "@/components/base/select/select";
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

/** Payroll trend per range — the RevenueTrendCard morphs between these. */
const DEMO_PAYROLL: Record<string, TrendPeriod> = {
  weekly: {
    id: "weekly",
    total: 482_300,
    delta: "+2.1%",
    deltaColor: "lime",
    data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((label, i) => ({
      label,
      value: [64_000, 71_000, 69_000, 78_000, 82_000, 58_000, 52_000][i],
    })),
  },
  monthly: {
    id: "monthly",
    total: 1_940_000,
    delta: "+6.8%",
    deltaColor: "lime",
    data: ["W1", "W2", "W3", "W4"].map((label, i) => ({
      label,
      value: [430_000, 465_000, 488_000, 512_000][i],
    })),
  },
  yearly: {
    id: "yearly",
    total: 22_800_000,
    delta: "+11.4%",
    deltaColor: "lime",
    data: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map(
      (label, i) => ({
        label,
        value: [1.51, 1.55, 1.62, 1.68, 1.71, 1.79, 1.85, 1.88, 1.94, 1.99, 2.08, 2.18][i] * 1_000_000,
      }),
    ),
  },
};

const DEMO_HIRES: RosterPerson[] = [
  { name: "June Rodriguez", meta: "Joined today", tag: "Product Designer" },
  { name: "Miguel Santos", meta: "Joined 2 days ago", tag: "Backend Engineer" },
  { name: "Anna Kowalska", meta: "Joined this week", tag: "Account Executive" },
  { name: "Tom Becker", meta: "Joined this week", tag: "Data Analyst" },
  { name: "Leire Zubiri", meta: "Joined last week", tag: "People Partner" },
  { name: "Oriol Serra", meta: "Joined last week", tag: "Frontend Engineer" },
  { name: "Claire Dubois", meta: "Joined last week", tag: "QA Engineer" },
  { name: "Iker Mendoza", meta: "Joined 2 weeks ago", tag: "Solutions Architect" },
];

/**
 * Engagement score metrics for the SleepScoreCard ring — arc share = score
 * (34 + 28 + 20 = the 82 headline; maxes sum to 100 so the grey track
 * shows the unearned 18), right column shows the survey averages.
 */
const DEMO_ENGAGEMENT = [
  { label: "Recognition", score: 34, max: 40, display: "8.6", color: "var(--color-chart-1)" },
  { label: "Growth", score: 28, max: 35, display: "7.9", color: "var(--color-chart-3)" },
  { label: "Wellbeing", score: 20, max: 25, display: "7.2", color: "var(--color-chart-6)" },
];

/** ~26 weeks of deterministic pseudo-random hiring events for the heatmap. */
const DEMO_HIRING_ACTIVITY: ContributionDatum[] = Array.from({ length: 26 * 7 }, (_, i) => {
  const count = Math.max(0, Math.round(Math.sin(i / 3.1) * 2 + Math.sin(i / 11.7) * 2) + (i % 5 === 0 ? 2 : 0));
  return { count, label: `${count} hiring ${count === 1 ? "event" : "events"}` };
});

const HIRING_MONTH_LABELS = ["Feb", "Mar", "Apr", "May", "Jun", "Jul"];

const WORKLOAD_BADGE: Record<
  Employee["workload"],
  { label: string; color: React.ComponentProps<typeof Chip>["color"] }
> = {
  light: { label: "Light", color: "lime" },
  balanced: { label: "Balanced", color: "blue" },
  heavy: { label: "Heavy", color: "yellow" },
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
        return <Chip variant="caption" color={w.color}>{w.label}</Chip>;
      },
    },
    {
      id: "actions",
      size: 48,
      cell: ({ row }) => (
        <EmployeeRowActions employee={row.original} onAction={onAction} />
      ),
    },
  ];
}

/** Per-row overflow menu — owns its open state so item clicks can close it. */
function EmployeeRowActions({
  employee,
  onAction,
}: {
  employee: Employee;
  onAction?: (action: string, employee: Employee) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const select = (action: string) => {
    setOpen(false);
    onAction?.(action, employee);
  };

  return (
    // Never let the row's onRowClick fire too — two overlays at once
    // (dropdown + sheet) fight over focus and pointer interception.
    <span onClick={(e) => e.stopPropagation()}>
      <Dropdown isOpen={open} onOpenChange={setOpen}>
        <DropdownTrigger
          aria-label={`Actions for ${employee.name}`}
          className="inline-flex size-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-background-primary-hover hover:text-text-primary [&_svg]:size-4"
        >
          <MoreHorizontalIcon />
        </DropdownTrigger>
        <DropdownPopover
          aria-label={`Actions for ${employee.name}`}
          placement="bottom end"
          className="w-56"
        >
          <DropdownGroup>
            <DropdownItem onSelect={() => select("view")}>
              <UserIcon className="size-4 shrink-0 text-foreground-icon-secondary" />
              <span className="text-body-medium text-text-primary">View profile</span>
            </DropdownItem>
            <DropdownItem onSelect={() => select("edit")}>
              <PencilIcon className="size-4 shrink-0 text-foreground-icon-secondary" />
              <span className="text-body-medium text-text-primary">Edit assignments</span>
            </DropdownItem>
          </DropdownGroup>
          <DropdownDivider />
          <DropdownGroup>
            <DropdownItem onSelect={() => select("offboard")}>
              <UserMinusIcon className="size-4 shrink-0 text-destructive" />
              <span className="text-body-medium text-destructive">Start offboarding</span>
            </DropdownItem>
          </DropdownGroup>
        </DropdownPopover>
      </Dropdown>
    </span>
  );
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
            <Button
              variant="secondary"
              size="small"
              leadingIcon={DownloadIcon}
              onClick={onExport}
            >
              Export
            </Button>
            <Button size="small" leadingIcon={PlusIcon} onClick={() => setAddOpen(true)}>
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
              <Button
                variant="ghost"
                size="xs"
                iconOnly
                leadingIcon={MoreHorizontalIcon}
                aria-label="Employee stat options"
              />
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

      {/* Trend + roster band — the BoardUI Pro cards: RevenueTrendCard
          morphs between periods (hover rolls the headline to that point),
          RecentHiresCard pages through people 4-up. */}
      <div className="grid items-stretch gap-4 lg:grid-cols-2">
        <RevenueTrendCard title="Payroll cost" periods={DEMO_PAYROLL} />
        <RecentHiresCard
          title="Recent hires"
          count={DEMO_HIRES.length}
          people={DEMO_HIRES}
          action={
            <Button
              variant="ghost"
              size="xs"
              iconOnly
              leadingIcon={MoreHorizontalIcon}
              aria-label="Recent hires options"
            />
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
            <Select
              aria-label="Chart range"
              size="sm"
              selectedKey={range}
              onSelectionChange={(k) => setRange(String(k))}
              className="w-28"
            >
              <SelectItem id="monthly" textValue="Monthly">Monthly</SelectItem>
              <SelectItem id="quarterly" textValue="Quarterly">Quarterly</SelectItem>
              <SelectItem id="yearly" textValue="Yearly">Yearly</SelectItem>
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

      {/* Engagement + hiring-activity band — the BoardUI Pro score-ring
          card (segmented arcs + breakdown rows) and contributions grid. */}
      <div className="grid items-stretch gap-4 lg:grid-cols-2">
        <SleepScoreCard
          title="Engagement score"
          headline="Good"
          rangeLabel="This quarter"
          metrics={DEMO_ENGAGEMENT}
          className="h-auto"
        />
        <Card>
          <CardHeader>
            <CardTitle>Hiring activity</CardTitle>
            <CardDescription>
              Offers, starts, and interviews over the last six months.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col justify-center gap-1.5">
            <ContributionsGrid data={DEMO_HIRING_ACTIVITY} accent="teal" />
            <div className="flex w-full justify-between text-body-2-medium text-text-tertiary">
              {HIRING_MONTH_LABELS.map((month) => (
                <span key={month}>{month}</span>
              ))}
            </div>
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
  const [startDate, setStartDate] = React.useState<CalendarDate | null>(null);
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
    setStartDate(null);
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
          <InputBase
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
          <InputBase
            id="new-employee-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="jane@acme.co"
          />
        </FormField>
        <FormGrid columns={2}>
          <FormField label="Department">
            <Select
              aria-label="Department"
              selectedKey={department}
              onSelectionChange={(k) => setDepartment(String(k))}
              className="w-full"
            >
              <SelectItem id="Engineering" textValue="Engineering">Engineering</SelectItem>
              <SelectItem id="Design" textValue="Design">Design</SelectItem>
              <SelectItem id="People" textValue="People">People</SelectItem>
              <SelectItem id="Sales" textValue="Sales">Sales</SelectItem>
            </Select>
          </FormField>
          <FormField label="Start date">
            <DatePicker
              aria-label="Start date"
              value={startDate}
              onChange={setStartDate}
              className="w-full"
            />
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
                <Chip variant="caption" color={workload.color}>{workload.label} workload</Chip>
                <Chip variant="caption" color="soft">{member.department}</Chip>
                <Chip variant="caption" color="gray">Full-time</Chip>
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
                    size="small"
                    leadingIcon={PencilIcon}
                    onClick={() => onAction?.("edit", member)}
                  >
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
                size="small"
                leadingIcon={UserMinusIcon}
                className="mr-auto text-destructive hover:bg-destructive/10 hover:text-destructive"
                onClick={() => onAction?.("offboard", member)}
              >
                Offboard
              </Button>
              <Button
                variant="secondary"
                size="small"
                leadingIcon={DownloadIcon}
                onClick={() => onAction?.("export", member)}
              >
                Export
              </Button>
              <Button
                size="small"
                leadingIcon={PencilIcon}
                onClick={() => onAction?.("edit", member)}
              >
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
