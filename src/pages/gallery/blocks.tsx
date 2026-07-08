import * as React from "react";
import { PencilIcon, PlusIcon } from "lucide-react";

import { useIsMobile } from "@/hooks/use-mobile";
import {
  ActivityFeed,
  DetailDivider,
  DetailSection,
  Field,
  FieldList,
} from "@/components/blocks/detail-panel";
import { FormField, FormGrid, FormSheet } from "@/components/blocks/entity-form";
import {
  AvatarChipCell,
  FilteredTable,
} from "@/components/blocks/filtered-table";
import { ListDetailLayout } from "@/components/blocks/list-detail";
import {
  DangerZone,
  SettingsRow,
  SettingsSection,
  SettingsStack,
} from "@/components/blocks/settings-page";
import { ChartCard, StatOverview } from "@/components/blocks/stat-overview";
import { DemoAreaChart } from "@/components/blocks/chart-demos";
import { StatusBadge, type Invoice } from "@/components/pages/invoices-page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { type ColumnDef } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

import { GalleryPage } from "./section";

/** Blocks composed with demo data — the grammar agents copy from. */

const ROWS: Invoice[] = [
  { id: "INV-2041", date: "Jun 28, 2026", customer: "Herradura Cafe", status: "paid", dueDate: "Jul 28, 2026", amount: 1290 },
  { id: "INV-2040", date: "Jun 26, 2026", customer: "Vinoveo", status: "draft", dueDate: "Jul 26, 2026", amount: 860 },
  { id: "INV-2039", date: "Jun 20, 2026", customer: "Deportes Alvarado", status: "overdue", dueDate: "Jun 30, 2026", amount: 2140 },
  { id: "INV-2038", date: "Jun 18, 2026", customer: "WGM Villas", status: "paid", dueDate: "Jul 18, 2026", amount: 460 },
];

const fmtEur = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "EUR" }).format(n);

const columns: ColumnDef<Invoice>[] = [
  { accessorKey: "id", header: "Invoice", size: 110 },
  {
    accessorKey: "customer",
    header: "Customer",
    cell: ({ row }) => <AvatarChipCell name={row.original.customer} />,
  },
  {
    accessorKey: "status",
    header: "Status",
    size: 110,
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "amount",
    header: "Amount",
    size: 110,
    cell: ({ row }) => (
      <span className="tabular-nums">{fmtEur(row.original.amount)}</span>
    ),
  },
];

function SectionShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-sm font-medium text-muted-foreground">{title}</h2>
      {children}
    </section>
  );
}

export default function GalleryBlocksPage() {
  const isMobile = useIsMobile();
  const [selectedId, setSelectedId] = React.useState<string | null>("INV-2041");
  const [formOpen, setFormOpen] = React.useState(false);

  React.useEffect(() => {
    if (isMobile) setSelectedId(null);
  }, [isMobile]);

  const selected = ROWS.find((r) => r.id === selectedId) ?? null;

  return (
    <GalleryPage
      title="Blocks"
      description="Screen-level patterns from src/components/blocks — compose these before touching primitives."
    >
      <SectionShell title="Stat overview + chart card">
        <StatOverview
          stats={[
            { id: "rev", label: "Revenue", value: "€48.2k", delta: "+8.1%", deltaTone: "positive", hint: "vs last month" },
            { id: "out", label: "Outstanding", value: "€6.3k", delta: "+2 invoices", deltaTone: "neutral" },
            { id: "overdue", label: "Overdue", value: "1", hint: "oldest 18 days" },
            { id: "cust", label: "Active customers", value: "1,284" },
          ]}
        >
          <ChartCard title="Collections" description="Payments received per week" height="auto">
            <DemoAreaChart />
          </ChartCard>
        </StatOverview>
      </SectionShell>

      <SectionShell title="List + detail (single overlay discipline)">
        <div className="flex h-[26rem] overflow-hidden rounded-xl border border-border bg-background">
          <ListDetailLayout
            detailOpen={selected != null}
            onDetailClose={() => setSelectedId(null)}
            detailTitle={selected?.id ?? ""}
            detailDescription={selected?.customer}
            list={
              <div className="h-full overflow-auto p-4">
                <FilteredTable
                  columns={columns}
                  data={ROWS}
                  searchPlaceholder="Search invoices…"
                  facets={[
                    {
                      id: "status",
                      label: "Status",
                      getValue: (row) => row.status,
                      options: [
                        { value: "paid", label: "Paid" },
                        { value: "overdue", label: "Overdue" },
                        { value: "draft", label: "Draft" },
                      ],
                    },
                  ]}
                  toolbarEnd={
                    <Button size="sm" onClick={() => setFormOpen(true)}>
                      <PlusIcon />
                      New invoice
                    </Button>
                  }
                  onRowClick={(row) => setSelectedId(row.original.id)}
                  pagination={false}
                />
              </div>
            }
            detail={
              selected ? (
                <div className="flex flex-col gap-4">
                  <DetailSection
                    title="Details"
                    action={
                      <Button variant="ghost" size="sm" onClick={() => setFormOpen(true)}>
                        <PencilIcon />
                        Edit
                      </Button>
                    }
                  >
                    <FieldList>
                      <Field label="Customer">{selected.customer}</Field>
                      <Field label="Amount">{fmtEur(selected.amount)}</Field>
                      <Field label="Status">
                        <Badge
                          variant={
                            selected.status === "paid"
                              ? "success"
                              : selected.status === "overdue"
                                ? "destructive"
                                : "secondary"
                          }
                        >
                          {selected.status}
                        </Badge>
                      </Field>
                      <Field label="Issued">{selected.date}</Field>
                    </FieldList>
                  </DetailSection>
                  <DetailDivider />
                  <DetailSection title="Activity">
                    <ActivityFeed
                      items={[
                        { id: "a1", title: "Reminder email sent", timestamp: "2 days ago" },
                        { id: "a2", title: "Invoice viewed by customer", timestamp: "5 days ago" },
                        { id: "a3", title: `Invoice ${selected.id} created`, timestamp: selected.date },
                      ]}
                    />
                  </DetailSection>
                </div>
              ) : null
            }
          />
        </div>
      </SectionShell>

      <SectionShell title="Entity form (FormGrid + FormField)">
        <div className="max-w-xl rounded-xl border border-border bg-card p-4">
          <FormGrid columns={2}>
            <FormField label="Customer" htmlFor="bf-customer" required className="sm:col-span-2">
              <Input id="bf-customer" placeholder="Acme Inc." />
            </FormField>
            <FormField label="Amount" htmlFor="bf-amount" required>
              <Input id="bf-amount" inputMode="decimal" placeholder="0.00" />
            </FormField>
            <FormField label="Due date" htmlFor="bf-due" help="Defaults to 30 days.">
              <Input id="bf-due" placeholder="Jul 30, 2026" />
            </FormField>
          </FormGrid>
        </div>
        <FormSheet
          open={formOpen}
          onOpenChange={setFormOpen}
          title="New invoice"
          description="Send a new invoice to a customer."
          submitLabel="Create invoice"
          onSubmit={() => setFormOpen(false)}
        >
          <FormGrid>
            <FormField label="Customer" htmlFor="bfs-customer" required>
              <Input id="bfs-customer" placeholder="Acme Inc." />
            </FormField>
            <FormField label="Amount" htmlFor="bfs-amount" required>
              <Input id="bfs-amount" inputMode="decimal" placeholder="0.00" />
            </FormField>
          </FormGrid>
        </FormSheet>
      </SectionShell>

      <SectionShell title="Settings (SettingsSection + SettingsRow + DangerZone)">
        <SettingsStack>
          <SettingsSection title="Notifications" description="What we email you about.">
            <SettingsRow label="Payment received" description="Email when an invoice is paid.">
              <Switch defaultChecked aria-label="Payment received" />
            </SettingsRow>
            <SettingsRow label="Default currency">
              <Select defaultValue="eur">
                <SelectTrigger className="w-32" aria-label="Default currency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="eur">EUR</SelectItem>
                  <SelectItem value="usd">USD</SelectItem>
                </SelectContent>
              </Select>
            </SettingsRow>
          </SettingsSection>
          <DangerZone>
            <SettingsRow
              label="Delete workspace"
              description="Removes all invoices and customers. This cannot be undone."
            >
              <Button variant="destructive" size="sm">
                Delete workspace
              </Button>
            </SettingsRow>
          </DangerZone>
        </SettingsStack>
      </SectionShell>
    </GalleryPage>
  );
}
