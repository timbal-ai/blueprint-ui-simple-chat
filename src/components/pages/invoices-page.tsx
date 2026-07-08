import * as React from "react";
import {
  CalendarIcon,
  CheckIcon,
  CircleSlashIcon,
  DownloadIcon,
  HashIcon,
  MailIcon,
  MoreHorizontalIcon,
  Trash2Icon,
} from "@/components/icons";
import type { RowSelectionState } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  DataTableColumnHeader,
  selectionColumn,
  type ColumnDef,
} from "@/components/ui/data-table";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  IconCell,
} from "@/components/blocks/filtered-table";

/**
 * InvoicesPage — the reference page template: a billing index inside the
 * inset AppShell. Fork this file to build any entity index with the same
 * grammar: big title, search + facet toolbar with a dark primary action,
 * selectable rows with icon/avatar cells and soft status badges, numbered
 * pagination.
 *
 * Render inside `<AppShell variant="inset">` — the page owns its header.
 */

interface Invoice {
  id: string;
  date: string;
  customer: string;
  status: "paid" | "overdue" | "draft";
  dueDate: string;
  amount: number;
}

const STATUS_META: Record<
  Invoice["status"],
  { label: string; variant: "success" | "destructive" | "secondary"; icon?: React.ReactNode }
> = {
  paid: { label: "Paid", variant: "success", icon: <CheckIcon /> },
  overdue: { label: "Overdue", variant: "destructive", icon: <CircleSlashIcon /> },
  draft: { label: "Draft", variant: "secondary" },
};

function StatusBadge({ status }: { status: Invoice["status"] }) {
  const meta = STATUS_META[status];
  return (
    <Badge variant={meta.variant} className="gap-1 rounded-md px-1.5 [&>svg]:size-3">
      {meta.icon}
      {meta.label}
    </Badge>
  );
}

const fmtUsd = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(n);

/** Chronological sort for the human-readable date strings the demo uses. */
const byParsedDate =
  (key: "date" | "dueDate") =>
  (a: { original: Invoice }, b: { original: Invoice }) =>
    Date.parse(a.original[key]) - Date.parse(b.original[key]);

function invoiceColumns(onAction?: (action: string, invoice: Invoice) => void): ColumnDef<Invoice>[] {
  return [
    selectionColumn<Invoice>(),
    {
      accessorKey: "id",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Invoice" />,
      size: 150,
      cell: ({ row }) => <IconCell icon={HashIcon}>{row.original.id}</IconCell>,
    },
    {
      accessorKey: "date",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Date" />,
      size: 140,
      sortingFn: byParsedDate("date"),
      cell: ({ row }) => <IconCell icon={CalendarIcon}>{row.original.date}</IconCell>,
    },
    {
      accessorKey: "customer",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Customer" />,
      cell: ({ row }) => <AvatarChipCell name={row.original.customer} />,
    },
    {
      accessorKey: "status",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      size: 110,
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: "dueDate",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Due date" />,
      size: 140,
      sortingFn: byParsedDate("dueDate"),
      cell: ({ row }) => <IconCell icon={CalendarIcon}>{row.original.dueDate}</IconCell>,
    },
    {
      accessorKey: "amount",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Amount" />,
      size: 110,
      cell: ({ row }) => (
        <span className="tabular-nums">{fmtUsd(row.original.amount)}</span>
      ),
    },
    {
      id: "actions",
      size: 40,
      enableSorting: false,
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              className="size-7 text-muted-foreground data-[state=open]:bg-accent"
              aria-label={`Actions for ${row.original.id}`}
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
            <DropdownMenuItem onClick={() => onAction?.("view", row.original)}>
              View invoice
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAction?.("download", row.original)}>
              Download PDF
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={() => onAction?.("void", row.original)}
            >
              Void invoice
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];
}

function InvoicesPage({
  title = "Invoices",
  invoices,
  itemsLabel = "invoices",
  onExport,
  onRowAction,
}: {
  title?: string;
  invoices: Invoice[];
  itemsLabel?: string;
  onExport?: () => void;
  onRowAction?: (action: string, invoice: Invoice) => void;
}) {
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const [detail, setDetail] = React.useState<Invoice | null>(null);

  const handleAction = React.useCallback(
    (action: string, invoice: Invoice) => {
      if (action === "view") setDetail(invoice);
      onRowAction?.(action, invoice);
    },
    [onRowAction],
  );

  const columns = React.useMemo(() => invoiceColumns(handleAction), [handleAction]);

  return (
    <div className="flex min-h-0 flex-1 animate-in fade-in-0 slide-in-from-bottom-1 flex-col gap-5 overflow-auto px-6 py-6 duration-300 lg:px-8">
      <h1 className="text-2xl font-medium tracking-tight text-foreground">
        {title}
      </h1>
      <FilteredTable
        columns={columns}
        data={invoices}
        searchPlaceholder="Search..."
        facets={[
          {
            id: "status",
            label: "All Statuses",
            getValue: (row) => row.status,
            options: [
              { value: "paid", label: "Paid" },
              { value: "overdue", label: "Overdue" },
              { value: "draft", label: "Draft" },
            ],
          },
        ]}
        moreFilters={[
          {
            id: "amount",
            label: "Amount",
            getValue: (row) => (row.amount >= 1000 ? "high" : "low"),
            options: [
              { value: "low", label: "Under $1,000" },
              { value: "high", label: "$1,000 and up" },
            ],
          },
          {
            id: "due",
            label: "Due date",
            getValue: (row) =>
              Date.parse(row.dueDate) < Date.now() ? "past" : "upcoming",
            options: [
              { value: "past", label: "Past due" },
              { value: "upcoming", label: "Upcoming" },
            ],
          },
        ]}
        toolbarEnd={
          <Button className="gap-1.5" onClick={onExport}>
            <DownloadIcon className="size-3.5" />
            Export
          </Button>
        }
        pageSize={10}
        itemsLabel={itemsLabel}
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
        onRowClick={(row) => handleAction("view", row.original)}
      />

      <BulkActionBar
        count={Object.keys(rowSelection).length}
        itemsLabel="invoices selected"
        onClear={() => setRowSelection({})}
        actions={[
          {
            id: "download",
            label: "Download",
            icon: DownloadIcon,
            onClick: () => setRowSelection({}),
          },
          {
            id: "send",
            label: "Send",
            icon: MailIcon,
            onClick: () => setRowSelection({}),
          },
          {
            id: "void",
            label: "Void",
            icon: Trash2Icon,
            tone: "destructive",
            onClick: () => setRowSelection({}),
          },
        ]}
      />

      <InvoiceDetailSheet
        invoice={detail}
        onOpenChange={(open) => {
          if (!open) setDetail(null);
        }}
        onAction={onRowAction}
      />
    </div>
  );
}

/* ---------------------------------------------------------------------------
 * InvoiceDetailSheet — row click → the full record in a floating lg sheet:
 * status header, billing fields, line items in a real Table, activity, and
 * the primary actions in the footer.
 * ------------------------------------------------------------------------- */

/** Deterministic demo line items so every invoice sums to its amount. */
function demoLineItems(invoice: Invoice) {
  const first = Math.round(invoice.amount * 0.6 * 100) / 100;
  const second = Math.round((invoice.amount - first) * 100) / 100;
  return [
    { id: "li-1", description: "Design services", qty: 1, amount: first },
    { id: "li-2", description: "Implementation support", qty: 2, amount: second },
  ];
}

function InvoiceDetailSheet({
  invoice,
  onOpenChange,
  onAction,
}: {
  invoice: Invoice | null;
  onOpenChange: (open: boolean) => void;
  onAction?: (action: string, invoice: Invoice) => void;
}) {
  return (
    <Sheet open={invoice !== null} onOpenChange={onOpenChange}>
      <SheetContent size="lg" className="flex flex-col gap-0">
        {invoice ? (
          <>
            <SheetHeader className="gap-3 border-b border-border">
              <div className="flex items-center gap-3">
                <AvatarChip name={invoice.customer} size="lg" />
                <div className="flex min-w-0 flex-col gap-0.5">
                  <SheetTitle className="text-xl">{invoice.id}</SheetTitle>
                  <SheetDescription>{invoice.customer}</SheetDescription>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                <StatusBadge status={invoice.status} />
                <Badge variant="outline">Due {invoice.dueDate}</Badge>
              </div>
            </SheetHeader>

            <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto p-4">
              <DetailSection title="Billing">
                <FieldList>
                  <Field label="Issued">{invoice.date}</Field>
                  <Field label="Due date">{invoice.dueDate}</Field>
                  <Field label="Customer">{invoice.customer}</Field>
                  <Field label="Total">
                    <span className="font-medium tabular-nums">
                      {fmtUsd(invoice.amount)}
                    </span>
                  </Field>
                </FieldList>
              </DetailSection>

              <DetailDivider />

              <DetailSection title="Line items">
                <Table>
                  <TableHeader className="[&_tr]:border-0">
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="rounded-l-lg bg-muted">Description</TableHead>
                      <TableHead className="bg-muted text-right">Qty</TableHead>
                      <TableHead className="rounded-r-lg bg-muted text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {demoLineItems(invoice).map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.description}</TableCell>
                        <TableCell className="text-right tabular-nums">{item.qty}</TableCell>
                        <TableCell className="text-right tabular-nums">
                          {fmtUsd(item.amount)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </DetailSection>

              <DetailDivider />

              <DetailSection title="Activity">
                <ActivityFeed
                  items={[
                    { id: "1", title: "Invoice sent to customer", timestamp: invoice.date },
                    {
                      id: "2",
                      title:
                        invoice.status === "paid"
                          ? "Payment received"
                          : invoice.status === "overdue"
                            ? "Payment reminder sent"
                            : "Saved as draft",
                      timestamp: invoice.dueDate,
                    },
                  ]}
                />
              </DetailSection>
            </div>

            <SheetFooter className="flex-row justify-end gap-2 border-t border-border">
              <Button
                variant="ghost"
                className="mr-auto text-destructive hover:bg-destructive/10 hover:text-destructive"
                onClick={() => onAction?.("void", invoice)}
              >
                <CircleSlashIcon />
                Void
              </Button>
              <Button variant="outline" onClick={() => onAction?.("send", invoice)}>
                <MailIcon />
                Send reminder
              </Button>
              <Button onClick={() => onAction?.("download", invoice)}>
                <DownloadIcon />
                Download PDF
              </Button>
            </SheetFooter>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}

/** Demo dataset shaped like the reference screenshot. */
const DEMO_INVOICES: Invoice[] = [
  { id: "INV-2026-111", date: "May 20, 2026", customer: "Acme design", status: "paid", dueDate: "May 20, 2026", amount: 1200 },
  { id: "INV-2026-112", date: "May 21, 2026", customer: "Pixel perfect", status: "paid", dueDate: "May 20, 2026", amount: 600 },
  { id: "INV-2026-113", date: "May 22, 2026", customer: "Design studio", status: "paid", dueDate: "Jul 20, 2026", amount: 750 },
  { id: "INV-2026-114", date: "May 22, 2026", customer: "Design studio", status: "draft", dueDate: "Jul 1, 2026", amount: 750 },
  { id: "INV-2026-115", date: "May 22, 2026", customer: "Creative agency", status: "paid", dueDate: "Jun 20, 2026", amount: 750 },
  { id: "INV-2026-116", date: "May 22, 2026", customer: "Design studio", status: "paid", dueDate: "Jun 19, 2026", amount: 750 },
  { id: "INV-2026-117", date: "May 23, 2026", customer: "Product people", status: "overdue", dueDate: "May 22, 2026", amount: 450 },
  { id: "INV-2026-118", date: "May 24, 2026", customer: "Code craft", status: "overdue", dueDate: "May 22, 2026", amount: 2100 },
  { id: "INV-2026-119", date: "May 25, 2026", customer: "Super energic", status: "overdue", dueDate: "May 22, 2026", amount: 1500 },
  { id: "INV-2026-120", date: "May 25, 2026", customer: "Bright labs", status: "paid", dueDate: "Jun 20, 2026", amount: 400 },
  { id: "INV-2026-121", date: "May 20, 2026", customer: "Unlimited creative", status: "draft", dueDate: "Jun 17, 2026", amount: 550 },
  { id: "INV-2026-122", date: "May 20, 2026", customer: "Code craft", status: "draft", dueDate: "Jun 9, 2026", amount: 2000 },
  { id: "INV-2026-123", date: "May 20, 2026", customer: "Clean design", status: "paid", dueDate: "Jun 7, 2026", amount: 1000 },
  { id: "INV-2026-124", date: "May 20, 2026", customer: "Straight product", status: "paid", dueDate: "Jun 8, 2026", amount: 1200 },
  { id: "INV-2026-125", date: "May 20, 2026", customer: "UI design collective", status: "paid", dueDate: "Jun 10, 2026", amount: 100 },
  { id: "INV-2026-126", date: "May 20, 2026", customer: "Nextgen inc", status: "paid", dueDate: "Jul 4, 2026", amount: 350 },
  { id: "INV-2026-127", date: "May 20, 2026", customer: "Product people", status: "overdue", dueDate: "May 10, 2026", amount: 2400 },
  { id: "INV-2026-128", date: "May 26, 2026", customer: "Herradura Cafe", status: "paid", dueDate: "Jun 26, 2026", amount: 1290 },
  { id: "INV-2026-129", date: "May 27, 2026", customer: "Vinoveo", status: "paid", dueDate: "Jun 27, 2026", amount: 860 },
  { id: "INV-2026-130", date: "May 28, 2026", customer: "Rhein Logistics", status: "draft", dueDate: "Jun 28, 2026", amount: 3320 },
  { id: "INV-2026-131", date: "May 29, 2026", customer: "WGM Villas", status: "paid", dueDate: "Jun 29, 2026", amount: 460 },
  { id: "INV-2026-132", date: "May 30, 2026", customer: "Deportes Alvarado", status: "overdue", dueDate: "May 30, 2026", amount: 2140 },
  { id: "INV-2026-133", date: "May 31, 2026", customer: "Bright labs", status: "paid", dueDate: "Jun 30, 2026", amount: 900 },
  { id: "INV-2026-134", date: "Jun 1, 2026", customer: "Acme design", status: "draft", dueDate: "Jul 1, 2026", amount: 1750 },
];

export { DEMO_INVOICES, InvoiceDetailSheet, InvoicesPage, StatusBadge };
export type { Invoice };
