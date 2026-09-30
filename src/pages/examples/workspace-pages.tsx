import { useMemo, useState, type ReactNode } from "react";
import {
  RiAddFill,
  RiBillLine,
  RiBox3Line,
  RiCheckLine,
  RiExternalLinkLine,
  RiMailSendLine,
  RiPhoneLine,
  RiShoppingCartLine,
  RiTruckLine,
} from "@remixicon/react";
import type { ColumnDef } from "@tanstack/react-table";
import { Chip, type ChipProps } from "@/components/base/badges/chip";
import { Button } from "@/components/base/buttons/button";
import { Select, SelectItem } from "@/components/base/select/select";
import { DataTable, DataTableRowAction } from "@/components/timbal/data-table";
import { Sheet, SheetBody, SheetFooter, SheetHeader, toast } from "@/components/timbal/overlays";
import { PageHeader } from "@/components/timbal/shells";
import { WorkQueue, type WorkQueueGroup } from "@/components/timbal/work-queue";

/**
 * Pages for the workspace example: a back office with several modules
 * (sales follow-ups, invoicing, stock, purchasing). Its `/` is the one
 * question such a product answers first — what needs me now — as a
 * `WorkQueue`, not a strip of counters. The numbers a KPI row would have
 * shown are the header's one line and each group's count; the rows behind
 * them are right there, each with its verb.
 */

/* ---------------------------------------------------------------- data */

type InvoiceStatus = "overdue" | "disputed" | "open" | "paid";

interface Invoice {
  id: string;
  customer: string;
  contact: string;
  amount: number;
  issued: string;
  due: string;
  daysLate: number;
  status: InvoiceStatus;
}

const INVOICES: Invoice[] = [
  { id: "INV-2041", customer: "Brightline Logistics", contact: "Marta Ruiz", amount: 6480, issued: "31 Aug", due: "14 Sep", daysLate: 16, status: "overdue" },
  { id: "INV-2037", customer: "Harbor & Pine", contact: "Kofi Mensah", amount: 3209.3, issued: "5 Sep", due: "19 Sep", daysLate: 11, status: "overdue" },
  { id: "INV-2029", customer: "Oakridge Dental", contact: "Lena Park", amount: 1430, issued: "11 Sep", due: "25 Sep", daysLate: 5, status: "disputed" },
  { id: "INV-2052", customer: "Fieldstone Farms", contact: "Owen Adler", amount: 2875, issued: "16 Sep", due: "30 Sep", daysLate: 0, status: "open" },
  { id: "INV-2055", customer: "Cedar & Co", contact: "Priya Nair", amount: 940, issued: "20 Sep", due: "4 Oct", daysLate: 0, status: "open" },
  { id: "INV-2058", customer: "Northgate Clinic", contact: "Sam Ortega", amount: 5120, issued: "24 Sep", due: "8 Oct", daysLate: 0, status: "open" },
  { id: "INV-2019", customer: "Brightline Logistics", contact: "Marta Ruiz", amount: 7210, issued: "1 Aug", due: "15 Aug", daysLate: 0, status: "paid" },
  { id: "INV-2023", customer: "Harbor & Pine", contact: "Kofi Mensah", amount: 1980, issued: "12 Aug", due: "26 Aug", daysLate: 0, status: "paid" },
];

const INVOICE_STATUS: Record<InvoiceStatus, { label: string; color: NonNullable<ChipProps["color"]> }> = {
  overdue: { label: "Overdue", color: "rose" },
  disputed: { label: "Disputed", color: "yellow" },
  open: { label: "Open", color: "cyan" },
  paid: { label: "Paid", color: "lime" },
};

const FOLLOW_UPS = [
  { id: "F-311", contact: "Marta Ruiz", company: "Brightline Logistics", task: "Renewal call", due: "Due yesterday", deal: "$22,000 · Negotiation", late: true },
  { id: "F-314", contact: "Kofi Mensah", company: "Harbor & Pine", task: "Send revised proposal", due: "Due today", deal: "$9,500 · Qualification", late: false },
  { id: "F-316", contact: "Lena Park", company: "Oakridge Dental", task: "Trial check-in", due: "Due today", deal: "Trial ends 3 Oct", late: false },
  { id: "F-318", contact: "Owen Adler", company: "Fieldstone Farms", task: "Confirm delivery window", due: "Due tomorrow", deal: "Order SO-884", late: false },
  { id: "F-320", contact: "Priya Nair", company: "Cedar & Co", task: "Intro call", due: "Due Friday", deal: "$4,200 · Prospecting", late: false },
];

const LOW_STOCK = [
  { id: "NS-PALLET-WRAP", name: "Pallet stretch wrap", site: "East Depot", available: 13, reorderAt: 100 },
  { id: "BX-4030", name: "Corrugated box 40×30", site: "Main Warehouse", available: 30, reorderAt: 100 },
];

const PURCHASE_ORDERS = [
  { id: "PO-118", supplier: "Uline", expected: "Expected 27 Sep", lines: "4 lines · $3,140.00", late: true },
  { id: "PO-121", supplier: "Packline", expected: "Expected today", lines: "2 lines · $860.00", late: false },
];

const currency = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

/** What the record Sheet shows: identity, a few fields, the one next step. */
interface RecordDetail {
  title: string;
  description: string;
  fields: [string, ReactNode][];
  note?: string;
  action?: { label: string; onPress: () => void };
}

function RecordSheet({ record, onClose }: { record: RecordDetail | null; onClose: () => void }) {
  return (
    <Sheet isOpen={record !== null} onOpenChange={(open) => !open && onClose()} side="right" size="md">
      {record ? (
        <>
          <SheetHeader title={record.title} description={record.description} />
          <SheetBody className="flex flex-col gap-4">
            <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 text-body-regular">
              {record.fields.map(([label, value]) => (
                <div key={label} className="contents">
                  <dt className="text-text-tertiary">{label}</dt>
                  <dd className="text-text-primary">{value}</dd>
                </div>
              ))}
            </dl>
            {record.note ? <p className="text-body-regular text-text-secondary">{record.note}</p> : null}
          </SheetBody>
          <SheetFooter>
            <Button variant="secondary" onClick={onClose}>
              Close
            </Button>
            {record.action ? (
              <Button
                onClick={() => {
                  record.action?.onPress();
                  onClose();
                }}
              >
                {record.action.label}
              </Button>
            ) : null}
          </SheetFooter>
        </>
      ) : null}
    </Sheet>
  );
}

function invoiceDetail(invoice: Invoice, action?: RecordDetail["action"]): RecordDetail {
  return {
    title: `${invoice.id} · ${invoice.customer}`,
    description: `Issued ${invoice.issued} · due ${invoice.due}`,
    fields: [
      ["Amount", currency(invoice.amount)],
      ["Contact", invoice.contact],
      [
        "Status",
        <Chip key="status" variant="bold" color={INVOICE_STATUS[invoice.status].color}>
          {invoice.status === "overdue" ? `${invoice.daysLate} d late` : INVOICE_STATUS[invoice.status].label}
        </Chip>,
      ],
    ],
    note:
      invoice.status === "disputed"
        ? "The customer disputes two line items on the delivery of 12 Sep. Resolve the dispute before the next reminder."
        : undefined,
    action,
  };
}

/* --------------------------------------------------------------- today */

/** `/`: what needs the user now, across modules, most urgent group first. */
export function TodayDemo({ invoicesPath }: { invoicesPath: string }) {
  const [done, setDone] = useState<ReadonlySet<string>>(new Set());
  const [record, setRecord] = useState<RecordDetail | null>(null);

  const complete = (id: string, message: string) => {
    setDone((prev) => new Set(prev).add(id));
    toast.success(message);
  };

  const followUps = FOLLOW_UPS.filter((f) => !done.has(f.id));
  const overdue = INVOICES.filter((i) => (i.status === "overdue" || i.status === "disputed") && !done.has(i.id));
  const lowStock = LOW_STOCK.filter((s) => !done.has(s.id));
  const receiving = PURCHASE_ORDERS.filter((p) => !done.has(p.id));
  const overdueTotal = overdue.reduce((sum, i) => sum + i.amount, 0);

  const groups: WorkQueueGroup[] = [
    {
      id: "follow-ups",
      label: "Follow-ups due",
      items: followUps.map((f) => {
        const action = { label: "Log call", onPress: () => complete(f.id, `Call with ${f.contact} logged`) };
        return {
          id: f.id,
          icon: RiPhoneLine,
          title: `${f.task} · ${f.contact}`,
          meta: `${f.company} · ${f.deal}`,
          aside: f.due,
          status: f.late ? { label: "Late", color: "rose" as const } : undefined,
          action: { ...action, icon: RiCheckLine },
          onOpen: () =>
            setRecord({
              title: f.task,
              description: `${f.contact} · ${f.company}`,
              fields: [
                ["Due", f.due.replace("Due ", "")],
                ["Deal", f.deal],
              ],
              action,
            }),
        };
      }),
    },
    {
      id: "invoices",
      label: "Overdue invoices",
      summary: currency(overdueTotal),
      href: invoicesPath,
      items: overdue.map((invoice) => {
        const action = { label: "Send reminder", onPress: () => complete(invoice.id, `Reminder sent to ${invoice.contact}`) };
        return {
          id: invoice.id,
          icon: RiBillLine,
          title: `${invoice.id} · ${invoice.customer}`,
          meta: `Due ${invoice.due} · ${invoice.contact}`,
          aside: currency(invoice.amount),
          status:
            invoice.status === "disputed"
              ? { label: "Disputed", color: "yellow" as const }
              : { label: `${invoice.daysLate} d late`, color: "rose" as const },
          action: { ...action, icon: RiMailSendLine },
          onOpen: () => setRecord(invoiceDetail(invoice, action)),
        };
      }),
    },
    {
      id: "stock",
      label: "Below reorder point",
      items: lowStock.map((s) => {
        const action = { label: "Reorder", onPress: () => complete(s.id, `Purchase order drafted for ${s.name}`) };
        return {
          id: s.id,
          icon: RiBox3Line,
          title: s.name,
          meta: `${s.id} · ${s.site} · reorder at ${s.reorderAt}`,
          aside: `${s.available} left`,
          status: s.available < s.reorderAt / 4 ? { label: "Critical", color: "rose" as const } : { label: "Low", color: "yellow" as const },
          action: { ...action, icon: RiShoppingCartLine },
          onOpen: () =>
            setRecord({
              title: s.name,
              description: `${s.id} · ${s.site}`,
              fields: [
                ["Available", String(s.available)],
                ["Reorder point", String(s.reorderAt)],
              ],
              action,
            }),
        };
      }),
    },
    {
      id: "receiving",
      label: "Purchase orders to receive",
      items: receiving.map((p) => {
        const action = { label: "Mark received", onPress: () => complete(p.id, `${p.id} received`) };
        return {
          id: p.id,
          icon: RiTruckLine,
          title: `${p.id} · ${p.supplier}`,
          meta: p.lines,
          aside: p.expected,
          status: p.late ? { label: "Late", color: "rose" as const } : undefined,
          action,
          onOpen: () =>
            setRecord({
              title: `${p.id} · ${p.supplier}`,
              description: p.expected,
              fields: [["Lines", p.lines]],
              action,
            }),
        };
      }),
    },
  ];

  const summary = [
    followUps.length && `${followUps.length} follow-ups due`,
    overdue.length && `${currency(overdueTotal)} overdue`,
    lowStock.length && `${lowStock.length} items below reorder`,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <>
      <PageHeader description={summary || "All clear"} />
      <WorkQueue aria-label="Needs attention" groups={groups} />
      <RecordSheet record={record} onClose={() => setRecord(null)} />
    </>
  );
}

/* ------------------------------------------------------------ invoices */

/** A module page: the full list behind the queue's "Overdue invoices" group. */
export function InvoicesDemo() {
  const [status, setStatus] = useState<"all" | InvoiceStatus>("all");
  const [query, setQuery] = useState("");
  const [record, setRecord] = useState<RecordDetail | null>(null);

  const data = useMemo(() => {
    const q = query.trim().toLowerCase();
    return INVOICES.filter(
      (i) =>
        (status === "all" || i.status === status) &&
        (q === "" || i.id.toLowerCase().includes(q) || i.customer.toLowerCase().includes(q)),
    );
  }, [status, query]);

  const columns = useMemo<ColumnDef<Invoice, unknown>[]>(
    () => [
      {
        accessorKey: "id",
        header: "Invoice",
        meta: { width: "w-[36%]" },
        cell: ({ row }) => (
          <span className="flex min-w-0 flex-col">
            <span className="truncate text-body-medium text-text-primary">{row.original.customer}</span>
            <span className="text-body-2-regular text-text-tertiary">
              {row.original.id} · {row.original.contact}
            </span>
          </span>
        ),
      },
      {
        accessorKey: "amount",
        header: "Amount",
        cell: ({ row }) => <span className="text-body-medium whitespace-nowrap text-text-primary">{currency(row.original.amount)}</span>,
      },
      {
        accessorKey: "due",
        header: "Due",
        cell: ({ row }) => <span className="text-body-medium whitespace-nowrap text-text-secondary">{row.original.due}</span>,
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <Chip variant="bold" color={INVOICE_STATUS[row.original.status].color}>
            {INVOICE_STATUS[row.original.status].label}
          </Chip>
        ),
      },
      {
        id: "actions",
        enableSorting: false,
        header: "",
        cell: ({ row }) => (
          <div className="flex justify-end">
            <DataTableRowAction icon={RiExternalLinkLine} label={`Open ${row.original.id}`} onClick={() => setRecord(invoiceDetail(row.original))} />
          </div>
        ),
      },
    ],
    [],
  );

  const outstanding = INVOICES.filter((i) => i.status !== "paid").reduce((sum, i) => sum + i.amount, 0);

  return (
    <>
      <PageHeader
        description={`${currency(outstanding)} outstanding`}
        actions={
          <Button leadingIcon={RiAddFill} onClick={() => toast.success("Draft invoice created")}>
            New invoice
          </Button>
        }
      />
      <DataTable
        data={data}
        columns={columns}
        getRowId={(i) => i.id}
        aria-label="Invoices"
        pageSize={8}
        filters={
          <Select
            aria-label="Filter by status"
            className="shrink-0"
            popoverClassName="min-w-40"
            selectedKey={status}
            onSelectionChange={(k) => setStatus(k as typeof status)}
          >
            <SelectItem id="all" textValue="All statuses">
              All statuses
            </SelectItem>
            {(Object.keys(INVOICE_STATUS) as InvoiceStatus[]).map((s) => (
              <SelectItem key={s} id={s} textValue={INVOICE_STATUS[s].label}>
                {INVOICE_STATUS[s].label}
              </SelectItem>
            ))}
          </Select>
        }
        search={{ value: query, onChange: setQuery, placeholder: "Search invoices" }}
        empty={
          <div className="flex flex-col items-center gap-1 py-10 text-center">
            <p className="text-body-medium text-text-primary">No invoices match</p>
            <p className="text-body-regular text-text-secondary">Clear the filter or search by customer.</p>
          </div>
        }
      />
      <RecordSheet record={record} onClose={() => setRecord(null)} />
    </>
  );
}
