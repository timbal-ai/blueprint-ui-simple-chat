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
import {
  AvatarChip,
  AvatarChipCell,
  FilteredTable,
} from "@/components/blocks/filtered-table";
import { PageHeader } from "@/components/blocks/page-header";
import { PageBody } from "@/components/blocks/page-body";
import { ChartCard, StatOverview } from "@/components/blocks/stat-overview";
import { DemoComposedChart } from "@/components/blocks/chart-demos";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
 * HrDashboardPage — the reference DASHBOARD template: breadcrumb + header,
 * a 3-up KPI band with vibrant delta badges, a composed line+bar chart in a
 * titled card with a range select, and a performance tracker table with
 * search, facets, sorting, selection, and row actions.
 *
 * Fork this file for any analytics/overview screen: swap the stats, chart
 * data, and columns — keep the structure (PageHeader → StatOverview →
 * ChartCard → FilteredTable) and the spacing rhythm.
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

function HrDashboardPage({
  employees = DEMO_EMPLOYEES,
  onEmployeeAction,
}: {
  employees?: Employee[];
  onEmployeeAction?: (action: string, employee: Employee) => void;
}) {
  const [range, setRange] = React.useState("monthly");
  const [member, setMember] = React.useState<Employee | null>(null);
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
      <PageHeader
        eyebrow={
          <span>
            Dashboard <span className="text-muted-foreground/50">/</span>{" "}
            <span className="text-foreground">Overview</span>
          </span>
        }
        title="HR Insights Dashboard"
        description="Actionable HR data for better decision-making"
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
    </PageBody>
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

export { DEMO_EMPLOYEES, HrDashboardPage, MemberDetailSheet };
export type { Employee };
