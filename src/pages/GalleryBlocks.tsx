import * as React from "react";
import {
  LayoutDashboardIcon,
  PencilIcon,
  PlusIcon,
  ReceiptIcon,
  SettingsIcon,
  SparklesIcon,
  UsersIcon,
} from "lucide-react";

import { useIsMobile } from "@/hooks/use-mobile";
import { AppShell } from "@/components/blocks/app-shell";
import {
  ActivityFeed,
  DetailDivider,
  DetailSection,
  Field,
  FieldList,
} from "@/components/blocks/detail-panel";
import { FormField, FormGrid, FormSheet } from "@/components/blocks/entity-form";
import { FilteredTable } from "@/components/blocks/filtered-table";
import { ListDetailLayout } from "@/components/blocks/list-detail";
import {
  DangerZone,
  SettingsRow,
  SettingsSection,
  SettingsStack,
} from "@/components/blocks/settings-page";
import { ChartCard, StatOverview } from "@/components/blocks/stat-overview";
import { Page, Section } from "@/components/app/page";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTableColumnHeader, type ColumnDef } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

/**
 * Blocks gallery — a realistic screen composed ONLY from the block kit
 * (`src/components/blocks/`), rendered inside AppShell. Dev/CI surface gated
 * by VITE_GALLERY; the screenshot smoke check pins these compositions at
 * desktop + mobile so block layout regressions can't land unseen.
 *
 * This page doubles as the reference for agents: this is what "compose from
 * blocks" looks like.
 */

interface Invoice {
  id: string;
  customer: string;
  status: "paid" | "pending" | "overdue";
  amount: number;
  issued: string;
}

const INVOICES: Invoice[] = [
  { id: "INV-2041", customer: "Herradura Cafe", status: "paid", amount: 1290, issued: "Jun 28, 2026" },
  { id: "INV-2040", customer: "Vinoveo", status: "pending", amount: 860, issued: "Jun 26, 2026" },
  { id: "INV-2039", customer: "Deportes Alvarado", status: "overdue", amount: 2140, issued: "Jun 20, 2026" },
  { id: "INV-2038", customer: "WGM Villas", status: "paid", amount: 460, issued: "Jun 18, 2026" },
  { id: "INV-2037", customer: "Rhein Logistics", status: "pending", amount: 3320, issued: "Jun 15, 2026" },
];

const fmtEur = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "EUR" }).format(n);

const invoiceColumns: ColumnDef<Invoice>[] = [
  { accessorKey: "id", header: "Invoice", size: 110 },
  { accessorKey: "customer", header: "Customer" },
  {
    accessorKey: "status",
    header: "Status",
    size: 110,
    cell: ({ row }) => {
      const status = row.getValue<Invoice["status"]>("status");
      const variant =
        status === "paid" ? "success" : status === "pending" ? "warning" : "destructive";
      return <Badge variant={variant}>{status}</Badge>;
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" className="-mr-2 ml-auto flex" />
    ),
    size: 120,
    cell: ({ row }) => (
      <div className="text-right tabular-nums">{fmtEur(row.getValue("amount"))}</div>
    ),
  },
];

/** Static bar sketch so ChartCard has real content without a chart lib. */
function DemoBars() {
  const heights = ["h-1/3", "h-1/2", "h-2/3", "h-1/2", "h-full", "h-3/4", "h-2/3", "h-5/6"];
  return (
    <div className="flex h-full items-end gap-2">
      {heights.map((h, i) => (
        <div key={i} className={`w-full rounded-t-sm bg-chart-1/70 ${h}`} />
      ))}
    </div>
  );
}

export default function GalleryBlocks() {
  const isMobile = useIsMobile();
  const [selectedId, setSelectedId] = React.useState<string | null>("INV-2041");
  const [formOpen, setFormOpen] = React.useState(false);

  // Mobile renders the detail in a Sheet — start closed there.
  React.useEffect(() => {
    if (isMobile) setSelectedId(null);
  }, [isMobile]);

  const selected = INVOICES.find((i) => i.id === selectedId) ?? null;

  return (
    <AppShell
      brand={
        <div className="flex items-center gap-2 px-2 py-1">
          <span className="flex size-6 items-center justify-center rounded-md bg-primary text-xs font-semibold text-primary-foreground">
            T
          </span>
          <span className="truncate text-sm font-semibold group-data-[collapsible=icon]:hidden">
            Blocks Gallery
          </span>
        </div>
      }
      nav={[
        {
          label: "General",
          items: [
            { id: "dashboard", label: "Dashboard", icon: LayoutDashboardIcon },
            { id: "invoices", label: "Invoices", icon: ReceiptIcon, badge: 5 },
            { id: "customers", label: "Customers", icon: UsersIcon },
          ],
        },
        {
          label: "Workspace",
          items: [{ id: "settings", label: "Settings", icon: SettingsIcon }],
        },
      ]}
      activeId="invoices"
      footer={
        <div className="flex items-center gap-2 px-2 py-1">
          <Avatar className="size-6">
            <AvatarFallback>PO</AvatarFallback>
          </Avatar>
          <span className="truncate text-sm group-data-[collapsible=icon]:hidden">
            Pedro O.
          </span>
        </div>
      }
      topbar={<span className="truncate text-sm font-medium">Invoices</span>}
      dock={
        <Button className="rounded-full shadow-lg" size="sm">
          <SparklesIcon />
          Ask AI
        </Button>
      }
    >
      <Page
        title="Block kit"
        description="Every block composed as a real screen. Dev/CI only — not a product surface."
        width="wide"
      >
        <Section title="Stat overview" id="stats">
          <StatOverview
            stats={[
              { id: "rev", label: "Revenue", value: "€48.2k", delta: "+8.1%", deltaTone: "positive", hint: "vs last month" },
              { id: "out", label: "Outstanding", value: "€6.3k", delta: "+2 invoices", deltaTone: "neutral" },
              { id: "overdue", label: "Overdue", value: "1", deltaTone: "negative", hint: "oldest 18 days" },
              { id: "cust", label: "Active customers", value: "1,284" },
            ]}
          >
            <ChartCard
              title="Collections"
              description="Payments received per week"
              action={
                <Select defaultValue="8w">
                  <SelectTrigger className="h-8 w-auto" aria-label="Range">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="8w">Last 8 weeks</SelectItem>
                    <SelectItem value="6m">Last 6 months</SelectItem>
                  </SelectContent>
                </Select>
              }
            >
              <DemoBars />
            </ChartCard>
          </StatOverview>
        </Section>

        <Section title="List + detail" id="list-detail">
          <div className="flex h-[30rem] overflow-hidden rounded-lg border border-border bg-background">
            <ListDetailLayout
              detailOpen={selected != null}
              onDetailClose={() => setSelectedId(null)}
              detailTitle={selected?.id ?? ""}
              detailDescription={selected?.customer}
              list={
                <div className="h-full overflow-auto p-4">
                  <FilteredTable
                    columns={invoiceColumns}
                    data={INVOICES}
                    searchPlaceholder="Search invoices…"
                    facets={[
                      {
                        id: "status",
                        label: "Status",
                        getValue: (row) => row.status,
                        options: [
                          { value: "paid", label: "Paid" },
                          { value: "pending", label: "Pending" },
                          { value: "overdue", label: "Overdue" },
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
                                : selected.status === "pending"
                                  ? "warning"
                                  : "destructive"
                            }
                          >
                            {selected.status}
                          </Badge>
                        </Field>
                        <Field label="Issued">{selected.issued}</Field>
                      </FieldList>
                    </DetailSection>
                    <DetailDivider />
                    <DetailSection title="Activity">
                      <ActivityFeed
                        items={[
                          { id: "a1", title: "Reminder email sent", timestamp: "2 days ago" },
                          { id: "a2", title: "Invoice viewed by customer", timestamp: "5 days ago" },
                          { id: "a3", title: `Invoice ${selected.id} created`, timestamp: selected.issued },
                        ]}
                      />
                    </DetailSection>
                  </div>
                ) : null
              }
            />
          </div>
        </Section>

        <Section title="Entity form" id="form">
          <div className="max-w-xl rounded-lg border border-border bg-card p-4">
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
              <FormField
                label="Reference"
                htmlFor="bf-ref"
                error="Reference already exists."
                className="sm:col-span-2"
              >
                <Input id="bf-ref" aria-invalid defaultValue="INV-2041" />
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
        </Section>

        <Section title="Settings" id="settings">
          <SettingsStack>
            <SettingsSection title="Notifications" description="What we email you about.">
              <SettingsRow label="Payment received" description="Email when an invoice is paid.">
                <Switch defaultChecked aria-label="Payment received" />
              </SettingsRow>
              <SettingsRow label="Weekly digest" description="Summary of outstanding invoices.">
                <Switch aria-label="Weekly digest" />
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
        </Section>
      </Page>
    </AppShell>
  );
}
