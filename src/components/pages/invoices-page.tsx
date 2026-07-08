import * as React from "react";
import {
  CalendarIcon,
  CheckIcon,
  CircleSlashIcon,
  DownloadIcon,
  HashIcon,
  MoreHorizontalIcon,
} from "lucide-react";
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
import { selectionColumn, type ColumnDef } from "@/components/ui/data-table";
import {
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

function invoiceColumns(onAction?: (action: string, invoice: Invoice) => void): ColumnDef<Invoice>[] {
  return [
    selectionColumn<Invoice>(),
    {
      accessorKey: "id",
      header: "Invoice",
      size: 150,
      cell: ({ row }) => <IconCell icon={HashIcon}>{row.original.id}</IconCell>,
    },
    {
      accessorKey: "date",
      header: "Date",
      size: 140,
      cell: ({ row }) => <IconCell icon={CalendarIcon}>{row.original.date}</IconCell>,
    },
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
      accessorKey: "dueDate",
      header: "Due date",
      size: 140,
      cell: ({ row }) => <IconCell icon={CalendarIcon}>{row.original.dueDate}</IconCell>,
    },
    {
      accessorKey: "amount",
      header: "Amount",
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
  const columns = React.useMemo(() => invoiceColumns(onRowAction), [onRowAction]);

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-auto px-6 py-6 lg:px-8">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">
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
        toolbarEnd={
          <Button size="sm" className="gap-1.5" onClick={onExport}>
            <DownloadIcon className="size-3.5" />
            Export
          </Button>
        }
        bordered={false}
        pageSize={10}
        itemsLabel={itemsLabel}
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
      />
    </div>
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

export { DEMO_INVOICES, InvoicesPage, StatusBadge };
export type { Invoice };
