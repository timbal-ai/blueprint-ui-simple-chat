import { useMemo, useState, type ReactNode } from "react";
import {
  RiAddFill,
  RiArchiveLine,
  RiCheckDoubleLine,
  RiDeleteBin6Line,
  RiExternalLinkLine,
  RiQuestionLine,
} from "@remixicon/react";
import type { CalendarDate } from "@internationalized/date";
import { getLocalTimeZone, startOfMonth } from "@internationalized/date";
import type { ColumnDef } from "@tanstack/react-table";
import { Button as AriaButton } from "react-aria-components";
import { CALENDAR_SHOWCASE_MONTH } from "@/components/application/calendar/calendar-data";
import { CalendarMonthGrid } from "@/components/application/calendar/calendar-month-grid";
import { CalendarMonthSwitcher } from "@/components/application/calendar/calendar-month-switcher";
import { Avatar } from "@/components/base/avatar/avatar";
import { Chip } from "@/components/base/badges/chip";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { Select, SelectItem } from "@/components/base/select/select";
import { Switch } from "@/components/base/switch/switch";
import { DataTable, DataTableMoreMenu, DataTableRowAction } from "@/components/timbal/data-table";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Popover,
  PopoverTrigger,
  Sheet,
  SheetBody,
  SheetFooter,
  SheetHeader,
  toast,
} from "@/components/timbal/overlays";

/**
 * Demo pages shared by the shell examples. Demos, not templates — and on
 * purpose not a KPI dashboard: the stat-tiles + trend-chart + table screen is
 * the one every generated app drifts to (it lives at /templates/dashboard for
 * briefs that really ask for it). These show the two shells hosting the two
 * commonest product screens instead: a queue of records with a detail sheet,
 * and a schedule.
 */

/* ------------------------------------------------------------- tickets */

type TicketStatus = "open" | "waiting" | "escalated" | "resolved";
type TicketPriority = "low" | "normal" | "high";

interface Ticket {
  id: string;
  subject: string;
  requester: { name: string; initials: string; color: "neutral" | "blue" | "lime" | "pink" };
  status: TicketStatus;
  priority: TicketPriority;
  channel: "Email" | "Chat" | "Phone";
  updated: string;
  updatedTs: number;
}

const STATUS: Record<TicketStatus, { label: string; color: "cyan" | "yellow" | "rose" | "lime" }> = {
  open: { label: "Open", color: "cyan" },
  waiting: { label: "Waiting on customer", color: "yellow" },
  escalated: { label: "Escalated", color: "rose" },
  resolved: { label: "Resolved", color: "lime" },
};

const PRIORITY: Record<TicketPriority, string> = { low: "Low", normal: "Normal", high: "High" };

const TICKETS: Ticket[] = [
  { id: "T-4821", subject: "Invoice PDF shows the wrong VAT rate", requester: { name: "Livia Saris", initials: "LS", color: "blue" }, status: "escalated", priority: "high", channel: "Email", updated: "12 min ago", updatedTs: 12 },
  { id: "T-4820", subject: "Can't add a second workspace admin", requester: { name: "Jaydon Aminoff", initials: "JA", color: "neutral" }, status: "open", priority: "normal", channel: "Chat", updated: "38 min ago", updatedTs: 38 },
  { id: "T-4818", subject: "Export to CSV drops the last column", requester: { name: "Maria Lubin", initials: "ML", color: "lime" }, status: "open", priority: "high", channel: "Email", updated: "1 h ago", updatedTs: 60 },
  { id: "T-4815", subject: "Refund for duplicate August charge", requester: { name: "Ann Press", initials: "AP", color: "pink" }, status: "waiting", priority: "normal", channel: "Phone", updated: "2 h ago", updatedTs: 120 },
  { id: "T-4811", subject: "SSO login loops back to the sign-in page", requester: { name: "Kianna Vaccaro", initials: "KV", color: "neutral" }, status: "escalated", priority: "high", channel: "Chat", updated: "3 h ago", updatedTs: 180 },
  { id: "T-4809", subject: "Request: dark mode for the mobile app", requester: { name: "Michael Ekstrom", initials: "ME", color: "blue" }, status: "waiting", priority: "low", channel: "Email", updated: "5 h ago", updatedTs: 300 },
  { id: "T-4803", subject: "Webhook retries stop after three attempts", requester: { name: "Aspen Lubin", initials: "AL", color: "lime" }, status: "open", priority: "normal", channel: "Email", updated: "Yesterday", updatedTs: 1440 },
  { id: "T-4799", subject: "Team page shows removed members", requester: { name: "John Clarkson", initials: "JC", color: "pink" }, status: "resolved", priority: "normal", channel: "Chat", updated: "Yesterday", updatedTs: 1500 },
  { id: "T-4790", subject: "Slow report generation for Q2", requester: { name: "Livia Saris", initials: "LS", color: "blue" }, status: "resolved", priority: "low", channel: "Email", updated: "2 days ago", updatedTs: 2880 },
  { id: "T-4786", subject: "Change billing email on the enterprise plan", requester: { name: "Ann Press", initials: "AP", color: "pink" }, status: "resolved", priority: "low", channel: "Phone", updated: "3 days ago", updatedTs: 4320 },
  { id: "T-4780", subject: "API key rotated but old key still works", requester: { name: "Jaydon Aminoff", initials: "JA", color: "neutral" }, status: "open", priority: "high", channel: "Email", updated: "3 days ago", updatedTs: 4400 },
  { id: "T-4771", subject: "Calendar sync misses recurring events", requester: { name: "Maria Lubin", initials: "ML", color: "lime" }, status: "waiting", priority: "normal", channel: "Chat", updated: "4 days ago", updatedTs: 5760 },
];

/** Tickets: `DataTable` (filters, search, selection, row actions) + a detail `Sheet`. */
export function TicketsDemo() {
  const [status, setStatus] = useState<"all" | TicketStatus>("all");
  const [priority, setPriority] = useState<"all" | TicketPriority>("all");
  const [query, setQuery] = useState("");
  const [openTicket, setOpenTicket] = useState<Ticket | null>(null);

  const data = useMemo(() => {
    const q = query.trim().toLowerCase();
    return TICKETS.filter(
      (t) =>
        (status === "all" || t.status === status) &&
        (priority === "all" || t.priority === priority) &&
        (q === "" || t.subject.toLowerCase().includes(q) || t.requester.name.toLowerCase().includes(q) || t.id.toLowerCase().includes(q)),
    );
  }, [status, priority, query]);

  const columns = useMemo<ColumnDef<Ticket, unknown>[]>(
    () => [
      {
        accessorKey: "subject",
        header: "Ticket",
        meta: { width: "w-[40%]" },
        cell: ({ row }) => (
          <span className="flex min-w-0 flex-col">
            <span className="truncate text-body-medium text-text-primary">{row.original.subject}</span>
            <span className="text-body-2-regular text-text-tertiary">
              {row.original.id} · {row.original.channel}
            </span>
          </span>
        ),
      },
      {
        id: "requester",
        accessorFn: (t) => t.requester.name,
        header: "Requester",
        cell: ({ row }) => (
          <span className="flex min-w-0 items-center gap-2">
            <Avatar size="sm" color={row.original.requester.color} initials={row.original.requester.initials} />
            <span className="truncate text-body-medium text-text-primary">{row.original.requester.name}</span>
          </span>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <Chip variant="bold" color={STATUS[row.original.status].color}>
            {STATUS[row.original.status].label}
          </Chip>
        ),
      },
      {
        accessorKey: "priority",
        header: "Priority",
        cell: ({ row }) => (
          <Chip variant="subtle" color={row.original.priority === "high" ? "gray" : "neutral"}>
            {PRIORITY[row.original.priority]}
          </Chip>
        ),
      },
      {
        accessorKey: "updatedTs",
        header: "Updated",
        cell: ({ row }) => (
          <span className="whitespace-nowrap text-body-medium text-text-secondary">{row.original.updated}</span>
        ),
      },
      {
        id: "actions",
        enableSorting: false,
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-2.5">
            <DataTableRowAction icon={RiExternalLinkLine} label="Open ticket" onClick={() => setOpenTicket(row.original)} />
            <DataTableMoreMenu
              ariaLabel={`More actions for ${row.original.id}`}
              items={[
                { icon: RiCheckDoubleLine, label: "Mark resolved", onSelect: () => toast.success(`${row.original.id} resolved`) },
                { icon: RiArchiveLine, label: "Archive", onSelect: () => toast.info(`${row.original.id} archived`) },
                { icon: RiDeleteBin6Line, label: "Delete", onSelect: () => toast.error(`${row.original.id} deleted`) },
              ]}
            />
          </div>
        ),
      },
    ],
    [],
  );

  return (
    <>
      <DataTable
        data={data}
        columns={columns}
        getRowId={(t) => t.id}
        aria-label="Support tickets"
        selectable
        pageSize={8}
        summary={
          <>
            <p className="text-body-medium whitespace-nowrap text-text-tertiary">Queue</p>
            <p className="text-body-medium whitespace-nowrap text-text-primary">
              {data.length} of {TICKETS.length} tickets
            </p>
          </>
        }
        filters={
          <>
            <Select
              aria-label="Filter by status"
              className="shrink-0"
              popoverClassName="min-w-44"
              selectedKey={status}
              onSelectionChange={(k) => setStatus(k as typeof status)}
            >
              <SelectItem id="all" textValue="All statuses">All statuses</SelectItem>
              {(Object.keys(STATUS) as TicketStatus[]).map((s) => (
                <SelectItem key={s} id={s} textValue={STATUS[s].label}>
                  {STATUS[s].label}
                </SelectItem>
              ))}
            </Select>
            <Select
              aria-label="Filter by priority"
              className="shrink-0"
              popoverClassName="min-w-40"
              selectedKey={priority}
              onSelectionChange={(k) => setPriority(k as typeof priority)}
            >
              <SelectItem id="all" textValue="All priorities">All priorities</SelectItem>
              {(Object.keys(PRIORITY) as TicketPriority[]).map((p) => (
                <SelectItem key={p} id={p} textValue={PRIORITY[p]}>
                  {PRIORITY[p]}
                </SelectItem>
              ))}
            </Select>
          </>
        }
        search={{ value: query, onChange: setQuery, placeholder: "Search tickets" }}
        empty={
          <div className="flex flex-col items-center gap-1 py-10 text-center">
            <p className="text-body-medium text-text-primary">No tickets match</p>
            <p className="text-body-regular text-text-secondary">Clear a filter or search for an id like T-4821.</p>
          </div>
        }
      />

      <Sheet isOpen={openTicket !== null} onOpenChange={(open) => !open && setOpenTicket(null)} side="right" size="md">
        {openTicket ? (
          <>
            <SheetHeader title={openTicket.subject} description={`${openTicket.id} · ${openTicket.channel} · updated ${openTicket.updated}`} />
            <SheetBody className="flex flex-col gap-4">
              <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 text-body-regular">
                <dt className="text-text-tertiary">Status</dt>
                <dd>
                  <Chip variant="bold" color={STATUS[openTicket.status].color}>
                    {STATUS[openTicket.status].label}
                  </Chip>
                </dd>
                <dt className="text-text-tertiary">Priority</dt>
                <dd className="text-text-primary">{PRIORITY[openTicket.priority]}</dd>
                <dt className="text-text-tertiary">Requester</dt>
                <dd className="flex items-center gap-2 text-text-primary">
                  <Avatar size="xs" color={openTicket.requester.color} initials={openTicket.requester.initials} />
                  {openTicket.requester.name}
                </dd>
              </dl>
              <p className="text-body-regular text-text-secondary">
                Customer reports the issue since the last release. Reproduced on the staging workspace; waiting on an
                engineering owner before replying.
              </p>
            </SheetBody>
            <SheetFooter>
              <Button variant="secondary" onClick={() => setOpenTicket(null)}>
                Close
              </Button>
              <Button
                leadingIcon={RiCheckDoubleLine}
                onClick={() => {
                  toast.success(`${openTicket.id} resolved`);
                  setOpenTicket(null);
                }}
              >
                Mark resolved
              </Button>
            </SheetFooter>
          </>
        ) : null}
      </Sheet>
    </>
  );
}

/* ------------------------------------------------------------ schedule */

/** Schedule: the BoardUI month grid + switcher (`application/calendar`) under the shell's own header. */
export function ScheduleDemo() {
  const [month, setMonth] = useState(CALENDAR_SHOWCASE_MONTH);
  const [highlightedDate, setHighlightedDate] = useState<CalendarDate | null>(null);
  const monthLabel = useMemo(
    () => new Intl.DateTimeFormat(undefined, { month: "long", year: "numeric" }).format(month.toDate(getLocalTimeZone())),
    [month],
  );

  return (
    <div className="flex w-full flex-col gap-2.5">
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <CalendarMonthSwitcher
          month={month}
          monthLabel={monthLabel}
          onPrevMonth={() => setMonth((m) => m.subtract({ months: 1 }))}
          onNextMonth={() => setMonth((m) => m.add({ months: 1 }))}
          onSelectDate={(date) => {
            setMonth(startOfMonth(date));
            setHighlightedDate(date);
          }}
        />
        <Button leadingIcon={RiAddFill} onClick={() => toast.success("Event created")}>
          New event
        </Button>
      </div>
      <div className="-mx-3 overflow-hidden bg-background-secondary-default sm:mx-0 sm:rounded-3xl sm:p-3">
        <CalendarMonthGrid month={month} highlightedDate={highlightedDate} onHighlightEnd={() => setHighlightedDate(null)} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ settings */

function SettingsRow({ title, hint, children }: { title: string; hint: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 flex-col gap-0.5">
        <span className="text-body-medium text-text-primary">{title}</span>
        <span className="text-body-regular text-text-secondary">{hint}</span>
      </div>
      <div className="flex flex-wrap items-center gap-2">{children}</div>
    </div>
  );
}

const TOAST_DEMOS = [
  { label: "Success", fire: () => toast.success("Saved", { description: "Your changes are live." }) },
  { label: "Error", fire: () => toast.error("Export failed", { action: { label: "Retry", onClick: () => toast.info("Retrying…") } }) },
  { label: "Info", fire: () => toast.info("New version available") },
  { label: "Warning", fire: () => toast.warning("Storage almost full", { description: "92% of 10 GB used." }) },
];

/** Settings: opens the Modal and a Sheet, fires every toast kind, a Popover. */
export function SettingsDemo() {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <section className="flex flex-col divide-y divide-separator-border rounded-3xl border border-border-button-default bg-background-primary-default p-6">
      <SettingsRow title="Profile" hint="Name and email shown to your team.">
        <Button variant="secondary" onClick={() => setProfileOpen(true)}>
          Edit profile
        </Button>
      </SettingsRow>
      <SettingsRow title="Notifications" hint="Choose what reaches your inbox.">
        <Button variant="secondary" onClick={() => setNotificationsOpen(true)}>
          Open panel
        </Button>
      </SettingsRow>
      <SettingsRow title="Toasts" hint="Feedback for saves, failures and warnings.">
        {TOAST_DEMOS.map(({ label, fire }) => (
          <Button key={label} size="small" variant="secondary" onClick={fire}>
            {label}
          </Button>
        ))}
      </SettingsRow>
      <SettingsRow title="Help" hint="An anchored popover for inline guidance.">
        <PopoverTrigger>
          <AriaButton className="inline-flex h-8 cursor-pointer items-center gap-1 rounded-lg border border-border-button-default bg-background-primary-default px-2 text-body-medium text-text-primary shadow-xs outline-none transition-colors duration-150 ease hover:bg-background-primary-hover focus-visible:ring-2 focus-visible:ring-border-focus-ring">
            <RiQuestionLine className="size-[18px] text-foreground-icon-secondary" aria-hidden />
            Why these settings?
          </AriaButton>
          <Popover aria-label="About settings" placement="bottom end" className="w-72 p-4" dialogClassName="gap-2">
            {({ close }) => (
              <>
                <p className="text-body-medium text-text-primary">Workspace defaults</p>
                <p className="text-body-regular text-text-secondary">
                  These apply to every member unless they override them in their own profile.
                </p>
                <Button size="small" variant="secondary" className="self-end" onClick={close}>
                  Got it
                </Button>
              </>
            )}
          </Popover>
        </PopoverTrigger>
      </SettingsRow>

      <Modal isOpen={profileOpen} onOpenChange={setProfileOpen} size="md">
        <ModalHeader title="Edit profile" description="Changes apply across the workspace." />
        <ModalBody className="flex flex-col gap-4">
          <Input label="Full name" defaultValue="Ada Lovelace" />
          <Input label="Email" type="email" defaultValue="ada@acme.com" />
        </ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={() => setProfileOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              setProfileOpen(false);
              toast.success("Profile updated");
            }}
          >
            Save changes
          </Button>
        </ModalFooter>
      </Modal>

      <Sheet isOpen={notificationsOpen} onOpenChange={setNotificationsOpen} side="right" size="md">
        <SheetHeader title="Notifications" description="Delivered to ada@acme.com." />
        <SheetBody className="flex flex-col gap-4">
          {["Weekly digest", "Mentions", "Billing alerts"].map((label) => (
            <Switch key={label} size="sm" defaultSelected className="w-full flex-row-reverse justify-between">
              {label}
            </Switch>
          ))}
        </SheetBody>
        <SheetFooter>
          <Button
            onClick={() => {
              setNotificationsOpen(false);
              toast.success("Preferences saved");
            }}
          >
            Done
          </Button>
        </SheetFooter>
      </Sheet>
    </section>
  );
}
