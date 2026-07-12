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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  { label: string; variant: React.ComponentProps<typeof Badge>["variant"] }
> = {
  active: { label: "Active", variant: "success" },
  delinquent: { label: "Delinquent", variant: "warning" },
  canceled: { label: "Canceled", variant: "outline" },
};

const PAYMENT_BADGE: Record<
  Payment["status"],
  { label: string; variant: React.ComponentProps<typeof Badge>["variant"] }
> = {
  succeeded: { label: "Succeeded", variant: "success" },
  failed: { label: "Failed", variant: "destructive" },
  refunded: { label: "Refunded", variant: "outline" },
};

function PaymentsTable({ payments }: { payments: Payment[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="text-right">ID</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {payments.map((payment) => {
          const badge = PAYMENT_BADGE[payment.status];
          return (
            <TableRow key={payment.id}>
              <TableCell className="font-medium tabular-nums">{payment.amount}</TableCell>
              <TableCell>
                <Badge variant={badge.variant}>{badge.label}</Badge>
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

  return (
    <PageBody className="gap-4">
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
        badges={<Badge variant={status.variant}>{status.label}</Badge>}
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => onAction?.("edit")}>
              <PencilIcon />
              Edit
            </Button>
            <Button variant="outline" size="sm" onClick={() => onAction?.("invoice")}>
              <MailIcon />
              Send invoice
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon-sm" aria-label="More actions">
                  <MoreHorizontalIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={() => onAction?.("export")}>
                  <DownloadIcon />
                  Export
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => onAction?.("copy-id")}>
                  <CopyIcon />
                  Copy customer ID
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        }
      />

      <MetadataGrid
        items={[
          { label: "Customer ID", value: customer.id },
          { label: "Created", value: customer.created },
          { label: "Default payment", value: customer.defaultPayment },
          { label: "Total spend", value: customer.totalSpend },
          { label: "MRR", value: customer.mrr },
          { label: "Country", value: customer.country },
        ]}
      />

      <Tabs defaultValue="overview" className="gap-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="flex flex-col gap-4">
          <DetailSection
            title="Recent payments"
            action={
              <Button variant="ghost" size="sm" onClick={() => onAction?.("refresh")}>
                <RefreshIcon />
                Refresh
              </Button>
            }
          >
            <PaymentsTable payments={payments.slice(0, 4)} />
          </DetailSection>
        </TabsContent>
        <TabsContent value="payments">
          <PaymentsTable payments={payments} />
        </TabsContent>
        <TabsContent value="subscriptions" className="flex flex-col gap-3">
          <div className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
            <div className="flex items-center gap-3">
              <WalletIcon className="size-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Growth plan</p>
                <p className="text-xs text-muted-foreground">$1,240.00 / month · Renews Aug 1</p>
              </div>
            </div>
            <Badge variant="success">Active</Badge>
          </div>
        </TabsContent>
        <TabsContent value="events">
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
        </TabsContent>
      </Tabs>
    </PageBody>
  );
}

export { CustomerDetailPage, DEMO_CUSTOMER, DEMO_PAYMENTS };
export type { Customer, Payment };
