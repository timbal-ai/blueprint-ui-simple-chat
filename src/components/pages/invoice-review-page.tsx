import * as React from "react";
import { Link } from "react-router-dom";

import {
  ArrowLeftIcon,
  CircleCheckIcon,
  PencilIcon,
  SparklesIcon,
} from "@/components/icons";

import { PageBody } from "@/components/blocks/page-body";
import { ActivityFeed } from "@/components/blocks/detail-panel";
import {
  DocumentReviewLayout,
  ReviewActionBar,
} from "@/components/blocks/document-review-layout";
import { PdfViewer } from "@/components/blocks/pdf-viewer";
import {
  ExtractedFieldRow,
  ExtractionSummaryBand,
  ReviewLineItemEditor,
  ReviewQueueHeader,
  ReviewTotalsStrip,
  VendorMatchCard,
  type FieldConfidence,
  type ReviewLineItem,
} from "@/components/blocks/review-extraction";
import { AvatarChip } from "@/components/blocks/filtered-table";
import {
  DEMO_INVOICES,
  StatusBadge,
  type Invoice,
} from "@/components/pages/invoices-page";
import { Chip } from "@/components/base/badges/chip";
import {
  SegmentedControl,
  SegmentedControlItem,
} from "@/components/base/segmented-control/segmented-control";
import { cn } from "@/lib/utils";

/**
 * InvoiceReviewPage — the reference DOCUMENT REVIEW template: clean 50/50
 * split (Mercury grammar), source PDF on the left, extraction workflow on
 * the right. The review pane is whitespace-only — NO rule lines: quiet
 * section labels, hover rows with dot confidence chips, segmented tabs for
 * Fields / Line items / Activity, and a pinned approve/reject footer.
 *
 * Mount as its own route (e.g. `/invoices/:id/review`) — never a sheet over
 * the index table. Pair with InvoicesPage: row action → navigate here.
 */

type ReviewStatus = "pending" | "approved" | "rejected";

interface ExtractedField {
  id: string;
  label: string;
  value: string;
  /** Vendor-master value when it differs from the extraction. */
  onFileValue?: string;
  confidence: FieldConfidence;
}

interface InvoiceReviewRecord extends Invoice {
  reviewStatus: ReviewStatus;
  vendor: string;
  vendorMatched: boolean;
  taxId?: string;
  taxAmount: number;
  subtotal: number;
  pdfUrl: string;
  extractionPct: number;
  fields: ExtractedField[];
  lineItems: ReviewLineItem[];
}

const fmtUsd = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(n);

const REVIEW_STATUS_BADGE: Record<
  ReviewStatus,
  { label: string; color: React.ComponentProps<typeof Chip>["color"] }
> = {
  pending: { label: "Pending review", color: "yellow" },
  approved: { label: "Approved", color: "lime" },
  rejected: { label: "Rejected", color: "rose" },
};

/** Build review-ready demo records from the shared invoice index dataset. */
function buildReviewRecords(invoices: Invoice[]): InvoiceReviewRecord[] {
  return invoices.map((invoice, index) => {
    const first = Math.round(invoice.amount * 0.6 * 100) / 100;
    const second = Math.round((invoice.amount - first) * 100) / 100;
    const tax = Math.round(invoice.amount * 0.08 * 100) / 100;
    const subtotal = Math.round((invoice.amount - tax) * 100) / 100;
    const vendorMatched = index % 7 !== 0;

    return {
      ...invoice,
      reviewStatus:
        invoice.status === "paid"
          ? "approved"
          : invoice.status === "overdue"
            ? "pending"
            : index % 3 === 0
              ? "rejected"
              : "pending",
      vendor: invoice.customer,
      vendorMatched,
      taxId: vendorMatched ? "12-8459201" : undefined,
      subtotal,
      taxAmount: tax,
      pdfUrl: "/samples/report.pdf",
      extractionPct: vendorMatched ? 92 + (index % 7) : 78 + (index % 5),
      fields: [
        {
          id: "vendor",
          label: "Vendor",
          value: invoice.customer,
          onFileValue: vendorMatched ? undefined : "Acme Design LLC",
          confidence: vendorMatched ? "high" : "low",
        },
        { id: "number", label: "Invoice no.", value: invoice.id, confidence: "high" },
        { id: "date", label: "Issued", value: invoice.date, confidence: "high" },
        {
          id: "due",
          label: "Due date",
          value: invoice.dueDate,
          confidence: index % 6 === 0 ? "medium" : "high",
        },
        {
          id: "tax",
          label: "Tax",
          value: fmtUsd(tax),
          onFileValue: index % 5 === 0 ? fmtUsd(tax * 0.9) : undefined,
          confidence: index % 5 === 0 ? "low" : "high",
        },
        { id: "terms", label: "Terms", value: "Net 30", confidence: "high" },
      ],
      lineItems: [
        {
          id: `${invoice.id}-1`,
          description: "Design services",
          qty: 1,
          unitPrice: first,
          glCode: "6100",
          confidence: "high",
        },
        {
          id: `${invoice.id}-2`,
          description: "Implementation support",
          qty: 2,
          unitPrice: Math.round((second / 2) * 100) / 100,
          glCode: index % 4 === 0 ? undefined : "6200",
          confidence: index % 4 === 0 ? "low" : "medium",
        },
      ],
    };
  });
}

const DEMO_REVIEW_INVOICES = buildReviewRecords(DEMO_INVOICES);

/**
 * Quiet section label — whitespace-only sectioning (Beacon legend-header
 * grammar: muted sentence case, never uppercase eyebrows or rule lines).
 */
function SectionLabel({
  children,
  action,
}: {
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between">
      <h3 className="text-sm text-muted-foreground">{children}</h3>
      {action}
    </div>
  );
}

function InvoiceReviewPage({
  invoices = DEMO_REVIEW_INVOICES,
  initialIndex = 0,
  backHref = "/gallery",
  backLabel = "Invoices",
  onAction,
}: {
  invoices?: InvoiceReviewRecord[];
  initialIndex?: number;
  backHref?: string;
  backLabel?: string;
  onAction?: (action: string, invoice: InvoiceReviewRecord) => void;
}) {
  const pending = React.useMemo(
    () => invoices.filter((inv) => inv.reviewStatus === "pending"),
    [invoices],
  );
  const queue = pending.length > 0 ? pending : invoices;

  const [index, setIndex] = React.useState(() =>
    Math.min(Math.max(initialIndex, 0), Math.max(queue.length - 1, 0)),
  );
  const [tab, setTab] = React.useState("fields");
  const [selectedFieldId, setSelectedFieldId] = React.useState<string | null>(null);
  const [selectedLineId, setSelectedLineId] = React.useState<string | null>(null);
  const [lineItemsByInvoice, setLineItemsByInvoice] = React.useState<
    Record<string, ReviewLineItem[]>
  >({});

  React.useEffect(() => {
    setIndex((current) => Math.min(current, Math.max(queue.length - 1, 0)));
  }, [queue.length]);

  // Arrow keys page through the queue (skipped while typing in an input).
  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement)
        return;
      if (e.key === "ArrowLeft") setIndex((i) => Math.max(i - 1, 0));
      if (e.key === "ArrowRight") setIndex((i) => Math.min(i + 1, queue.length - 1));
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [queue.length]);

  const invoice = queue[index];

  React.useEffect(() => {
    setSelectedFieldId(null);
    setSelectedLineId(null);
    setTab("fields");
  }, [invoice?.id]);

  if (!invoice) {
    return (
      <PageBody>
        <p className="text-sm text-muted-foreground">No invoices to review.</p>
      </PageBody>
    );
  }

  const lineItems = lineItemsByInvoice[invoice.id] ?? invoice.lineItems;
  const setLineItems = (items: ReviewLineItem[]) =>
    setLineItemsByInvoice((prev) => ({ ...prev, [invoice.id]: items }));

  const flaggedFields = invoice.fields.filter((f) => f.confidence !== "high").length;
  const flaggedLines = lineItems.filter((l) => l.confidence !== "high").length;
  const reviewBadge = REVIEW_STATUS_BADGE[invoice.reviewStatus];

  return (
    // `flex-1 shrink` re-enables viewport capping — this page inner-scrolls.
    <PageBody className="min-h-0 flex-1 shrink gap-4">
      <ReviewQueueHeader
        position={index}
        total={queue.length}
        backLink={
          <Link
            to={backHref}
            aria-label={`Back to ${backLabel}`}
            className="-ml-2 inline-flex h-8 items-center gap-1.5 rounded-lg px-2 text-body-medium text-text-secondary transition-colors outline-none hover:bg-background-primary-hover hover:text-text-primary focus-visible:ring-2 focus-visible:ring-border-focus-ring"
          >
            <ArrowLeftIcon className="size-3.5" />
            {/* Icon-only on phones — the label costs the row its single line. */}
            <span className="hidden sm:inline">{backLabel}</span>
          </Link>
        }
        onPrevious={() => setIndex((i) => Math.max(i - 1, 0))}
        onNext={() => setIndex((i) => Math.min(i + 1, queue.length - 1))}
      />

      <DocumentReviewLayout
        fill
        documentTitle={`${invoice.id}.pdf`}
        documentMeta="Original invoice · tap to verify"
        document={
          <PdfViewer
            src={invoice.pdfUrl}
            title={`${invoice.id}.pdf`}
            height="100%"
            // Match the review card surface exactly (house Card recipe).
            className="h-full rounded-2xl shadow-[0_1px_2px_0_color-mix(in_srgb,black_3%,transparent),0_3px_8px_-4px_color-mix(in_srgb,black_4%,transparent)]"
          />
        }
        reviewHeader={
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <AvatarChip name={invoice.vendor} size="lg" />
                <h2 className="min-w-0 flex-1 truncate text-base font-medium tracking-tight text-foreground">
                  {invoice.vendor}
                </h2>
                <div className="shrink-0 text-right">
                  <p className="text-lg font-medium tabular-nums tracking-tight text-foreground sm:text-xl">
                    {fmtUsd(invoice.amount)}
                  </p>
                  <p className="text-xs text-muted-foreground">Total due</p>
                </div>
              </div>
              {/* Meta line spans the FULL pane width (not the squeezed column
                  between avatar and amount) so the chips stay on one line on
                  phones instead of stacking. */}
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="truncate text-sm text-muted-foreground">
                  {invoice.id} · Due {invoice.dueDate}
                </span>
                <Chip variant="caption" color={reviewBadge.color}>
                  {reviewBadge.label}
                </Chip>
                <StatusBadge status={invoice.status} />
              </div>
            </div>

            <SegmentedControl
              aria-label="Review sections"
              selectedKeys={[tab]}
              onSelectionChange={(keys) => {
                const next = [...keys][0];
                if (next) setTab(String(next));
              }}
              className="flex w-full"
            >
              <SegmentedControlItem id="fields" className="flex-1 gap-1.5">
                Fields
                {flaggedFields > 0 ? (
                  <span className="text-xs text-warning">{flaggedFields}</span>
                ) : null}
              </SegmentedControlItem>
              <SegmentedControlItem id="lines" className="flex-1 gap-1.5">
                Line items
                {flaggedLines > 0 ? (
                  <span className="text-xs text-warning">{flaggedLines}</span>
                ) : null}
              </SegmentedControlItem>
              <SegmentedControlItem id="activity" className="flex-1">
                Activity
              </SegmentedControlItem>
            </SegmentedControl>
          </div>
        }
        reviewFooter={
          // Totals live WITH the decision (Mercury grammar): verify the
          // number, then approve — no scrolling back up.
          <div className="flex flex-col gap-3">
            <ReviewTotalsStrip
              subtotal={fmtUsd(invoice.subtotal)}
              tax={fmtUsd(invoice.taxAmount)}
              total={fmtUsd(invoice.amount)}
            />
            <ReviewActionBar
              leading={{
                id: "reject",
                label: "Reject",
                onClick: () => onAction?.("reject", invoice),
              }}
              secondary={[
                {
                  id: "draft",
                  label: "Save draft",
                  icon: <PencilIcon />,
                  onClick: () => onAction?.("draft", invoice),
                },
              ]}
              primary={{
                id: "approve",
                label: "Approve & post",
                icon: <CircleCheckIcon />,
                shortcut: "⌘↵",
                onClick: () => onAction?.("approve", invoice),
                disabled: invoice.reviewStatus === "approved",
              }}
            />
          </div>
        }
      >
        {tab === "fields" ? (
          <>
            <ExtractionSummaryBand
              matchedPct={invoice.extractionPct}
              flaggedCount={flaggedFields + flaggedLines}
              totalLabel={fmtUsd(invoice.amount)}
            />

            <VendorMatchCard
              vendor={invoice.vendor}
              matched={invoice.vendorMatched}
              taxId={invoice.taxId}
            />

            <div className="flex flex-col gap-2">
              <SectionLabel>Extracted fields</SectionLabel>
              <div className="flex flex-col gap-0.5">
                {invoice.fields.map((field) => (
                  <ExtractedFieldRow
                    key={field.id}
                    label={field.label}
                    value={field.value}
                    onFileValue={field.onFileValue}
                    confidence={field.confidence}
                    selected={selectedFieldId === field.id}
                    onSelect={() =>
                      setSelectedFieldId((id) => (id === field.id ? null : field.id))
                    }
                  />
                ))}
              </div>
            </div>
          </>
        ) : null}

        {tab === "lines" ? (
          <div className="flex flex-col gap-2">
            <SectionLabel
              action={
                <span
                  className={cn(
                    "text-xs",
                    flaggedLines > 0 ? "text-warning" : "text-muted-foreground",
                  )}
                >
                  {flaggedLines > 0
                    ? `${flaggedLines} to review`
                    : "All matched"}
                </span>
              }
            >
              Categorize line items
            </SectionLabel>
            <ReviewLineItemEditor
              items={lineItems}
              onChange={setLineItems}
              selectedId={selectedLineId}
              onSelect={(id) =>
                setSelectedLineId((current) => (current === id ? null : id))
              }
            />
          </div>
        ) : null}

        {tab === "activity" ? (
          <div className="flex flex-col gap-2">
            <SectionLabel>Timeline</SectionLabel>
            <ActivityFeed
              items={[
                {
                  id: "1",
                  title: "Document uploaded & OCR started",
                  timestamp: invoice.date,
                },
                {
                  id: "2",
                  title: "AI extraction completed",
                  timestamp: invoice.date,
                  leading: <SparklesIcon className="size-3.5" />,
                },
                {
                  id: "3",
                  title: invoice.vendorMatched
                    ? "Vendor matched to master record"
                    : "Vendor match failed — manual review required",
                  timestamp: invoice.dueDate,
                },
                { id: "4", title: "Queued for human review", timestamp: "Today" },
              ]}
            />
          </div>
        ) : null}
      </DocumentReviewLayout>
    </PageBody>
  );
}

export {
  DEMO_REVIEW_INVOICES,
  InvoiceReviewPage,
  buildReviewRecords,
};
export type { ExtractedField, InvoiceReviewRecord, ReviewStatus };
