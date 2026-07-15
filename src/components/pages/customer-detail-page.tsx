import * as React from "react";
import {
  ArrowLeftIcon,
  CopyIcon,
  CreditCardIcon,
  DownloadIcon,
  MailIcon,
  MoreHorizontalIcon,
  PencilIcon,
  RefreshIcon,
  WalletIcon,
} from "@/components/icons";

import { PageBody } from "@/components/blocks/page-body";
import { PageHeader } from "@/components/blocks/page-header";
import {
  ActivityFeed,
  DetailSection,
  MetadataGrid,
  RecordDetailHeader,
} from "@/components/blocks/detail-panel";
import { AvatarChip } from "@/components/blocks/filtered-table";
import { Chip } from "@/components/base/badges/chip";
import { Button } from "@/components/base/buttons/button";
import { SECONDARY_CHROME } from "@/components/base/buttons/secondary-chrome";
import { cx as cn } from "@/utils/cx";
import {
  Dropdown,
  DropdownGroup,
  DropdownItem,
  DropdownPopover,
  DropdownTrigger,
} from "@/components/base/dropdown/dropdown";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@/components/base/table/table";
import { Tab, TabList, TabPanel, Tabs } from "@/components/base/tabs/tabs";

/**
 * CustomerDetailPage — condensed full-page record detail (Stripe dashboard
 * grammar): breadcrumb eyebrow (parent / record — never the app name),
 * compact RecordDetailHeader, MetadataGrid, tabbed sections (Overview,
 * Payments, Subscriptions, Events). Fork for any billing/customer/tenant
 * record route — pair with an index page that links here.
 */

interface Customer {
  id: string;
  name: string;
  email: string;
  status: "active" | "delinquent" | "canceled";
  created: string;
  defaultPayment: string;
  totalSpend: string;
  mrr: string;
  country: string;
}

interface Payment {
  id: string;
  amount: string;
  status: "succeeded" | "failed" | "refunded";
  date: string;
}

const DEMO_CUSTOMER: Customer = {
  id: "cus_Nx8k2mPqL9vR",
  name: "Acme Corp",
  email: "billing@acme.co",
  status: "active",
  created: "Jan 12, 2024",
  defaultPayment: "Visa •••• 4242",
  totalSpend: "$48,290.00",
  mrr: "$1,240.00",
  country: "United States",
};

const DEMO_PAYMENTS: Payment[] = [
  { id: "pi_3Nx8k", amount: "$1,240.00", status: "succeeded", date: "Jul 1, 2026" },
  { id: "pi_3Nx7j", amount: "$1,240.00", status: "succeeded", date: "Jun 1, 2026" },
  { id: "pi_3Nx6h", amount: "$1,240.00", status: "succeeded", date: "May 1, 2026" },
  { id: "pi_3Nx5g", amount: "$620.00", status: "refunded", date: "Apr 14, 2026" },
];

const STATUS_BADGE: Record<
  Customer["status"],
  { label: string; color: React.ComponentProps<typeof Chip>["color"] }
> = {
  active: { label: "Active", color: "lime" },
  delinquent: { label: "Delinquent", color: "yellow" },
  canceled: { label: "Canceled", color: "soft" },
};

const PAYMENT_BADGE: Record<
  Payment["status"],
  { label: string; color: React.ComponentProps<typeof Chip>["color"] }
> = {
  succeeded: { label: "Succeeded", color: "lime" },
  failed: { label: "Failed", color: "rose" },
  refunded: { label: "Refunded", color: "soft" },
};

function PaymentsTable({ payments }: { payments: Payment[] }) {
  return (
    <Table aria-label="Payments" size="sm">
      <TableHeader>
        <TableColumn isRowHeader>Amount</TableColumn>
        <TableColumn>Status</TableColumn>
        <TableColumn>Date</TableColumn>
        <TableColumn className="text-right">ID</TableColumn>
      </TableHeader>
      <TableBody>
        {payments.map((payment) => {
          const badge = PAYMENT_BADGE[payment.status];
          return (
            <TableRow key={payment.id}>
              <TableCell className="font-medium tabular-nums">{payment.amount}</TableCell>
              <TableCell>
                <Chip variant="caption" color={badge.color}>{badge.label}</Chip>
              </TableCell>
              <TableCell className="text-muted-foreground">{payment.date}</TableCell>
              <TableCell className="text-right font-mono text-xs text-muted-foreground">
                {payment.id}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

function CustomerDetailPage({
  customer = DEMO_CUSTOMER,
  payments = DEMO_PAYMENTS,
  parentLabel = "Customers",
  onBack,
  onAction,
}: {
  customer?: Customer;
  payments?: Payment[];
  /** Parent crumb — never the app/product name. */
  parentLabel?: string;
  onBack?: () => void;
  onAction?: (action: string) => void;
}) {
  const status = STATUS_BADGE[customer.status];
  const [menuOpen, setMenuOpen] = React.useState(false);
  const selectMenuAction = (action: string) => {
    setMenuOpen(false);
    onAction?.(action);
  };

  return (
    <PageBody className="mx-auto w-full max-w-3xl gap-10">
      <div className="flex flex-col gap-5">
        <PageHeader
          eyebrow={
            <button
              type="button"
              className="inline-flex items-center gap-1.5 hover:text-foreground"
              onClick={onBack}
            >
              <ArrowLeftIcon className="size-3.5" />
              <span>
                {parentLabel}
                <span className="text-muted-foreground/50"> / </span>
                <span className="text-foreground">{customer.name}</span>
              </span>
            </button>
          }
          title=""
          description=""
          className="gap-2"
        />

        <RecordDetailHeader
          leading={<AvatarChip name={customer.name} size="lg" />}
          title={customer.name}
          subtitle={customer.email}
          badges={<Chip variant="caption" color={status.color}>{status.label}</Chip>}
          actions={
            <>
              <Button
                variant="secondary"
                size="small"
                leadingIcon={PencilIcon}
                onClick={() => onAction?.("edit")}
              >
                Edit
              </Button>
              <Button
                variant="secondary"
                size="small"
                leadingIcon={MailIcon}
                onClick={() => onAction?.("invoice")}
              >
                Send invoice
              </Button>
              <Dropdown isOpen={menuOpen} onOpenChange={setMenuOpen}>
                <DropdownTrigger
                  aria-label="More actions"
                  className={cn(
                    "inline-flex size-8 shrink-0 items-center justify-center rounded-lg text-foreground-icon-primary transition-colors [&_svg]:size-4",
                    SECONDARY_CHROME,
                  )}
                >
                  <MoreHorizontalIcon />
                </DropdownTrigger>
                <DropdownPopover aria-label="More actions" placement="bottom end" className="w-56">
                  <DropdownGroup>
                    <DropdownItem onSelect={() => selectMenuAction("export")}>
                      <DownloadIcon className="size-4 shrink-0 text-foreground-icon-secondary" />
                      <span className="text-body-medium text-text-primary">Export</span>
                    </DropdownItem>
                    <DropdownItem onSelect={() => selectMenuAction("copy-id")}>
                      <CopyIcon className="size-4 shrink-0 text-foreground-icon-secondary" />
                      <span className="text-body-medium text-text-primary">Copy customer ID</span>
                    </DropdownItem>
                  </DropdownGroup>
                </DropdownPopover>
              </Dropdown>
            </>
          }
        />
      </div>

      <MetadataGrid
        className="gap-y-4 lg:grid-cols-2"
        items={[
          { label: "Customer ID", value: customer.id },
          { label: "Created", value: customer.created },
          { label: "Default payment", value: customer.defaultPayment },
          { label: "Total spend", value: customer.totalSpend },
          { label: "MRR", value: customer.mrr },
          { label: "Country", value: customer.country },
        ]}
      />

      <Tabs defaultSelectedKey="overview" className="gap-6">
        <TabList aria-label="Customer sections">
          <Tab id="overview">Overview</Tab>
          <Tab id="payments">Payments</Tab>
          <Tab id="subscriptions">Subscriptions</Tab>
          <Tab id="events">Events</Tab>
        </TabList>
        <TabPanel id="overview" className="flex flex-col gap-5">
          <DetailSection
            title="Recent payments"
            action={
              <Button
                variant="ghost"
                size="small"
                leadingIcon={RefreshIcon}
                onClick={() => onAction?.("refresh")}
              >
                Refresh
              </Button>
            }
          >
            <PaymentsTable payments={payments.slice(0, 4)} />
          </DetailSection>
        </TabPanel>
        <TabPanel id="payments">
          <PaymentsTable payments={payments} />
        </TabPanel>
        <TabPanel id="subscriptions" className="flex flex-col gap-3">
          <div className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
            <div className="flex items-center gap-3">
              <WalletIcon className="size-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Growth plan</p>
                <p className="text-xs text-muted-foreground">$1,240.00 / month · Renews Aug 1</p>
              </div>
            </div>
            <Chip variant="caption" color="lime">Active</Chip>
          </div>
        </TabPanel>
        <TabPanel id="events">
          <ActivityFeed
            items={[
              {
                id: "1",
                title: "Payment succeeded for $1,240.00",
                timestamp: "2 hours ago",
                leading: <CreditCardIcon />,
              },
              {
                id: "2",
                title: "Invoice INV-2041 sent",
                timestamp: "Yesterday",
                leading: <MailIcon />,
              },
              {
                id: "3",
                title: "Default payment method updated",
                timestamp: "Jun 28, 2026",
                leading: <CreditCardIcon />,
              },
            ]}
          />
        </TabPanel>
      </Tabs>
    </PageBody>
  );
}

export { CustomerDetailPage, DEMO_CUSTOMER, DEMO_PAYMENTS };
export type { Customer, Payment };
