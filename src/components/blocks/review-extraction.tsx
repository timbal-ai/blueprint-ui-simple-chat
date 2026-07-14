import * as React from "react";

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CircleCheckIcon,
  InfoIcon,
  PlusIcon,
  XIcon,
} from "@/components/icons";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/**
 * Review extraction kit — field rows, editable line items, queue chrome, and
 * summary bands for document-review screens (AP automation, OCR validation).
 *
 * House grammar: NO rule lines between rows or sections — hierarchy comes
 * from whitespace, size, and tone. Confidence reads as a small dot chip,
 * never a loud badge per row. Selection is a soft tinted fill.
 */

type FieldConfidence = "high" | "medium" | "low";

const CONFIDENCE_META: Record<
  FieldConfidence,
  { label: string; dot: string; text: string }
> = {
  high: { label: "Matched", dot: "bg-success", text: "text-success" },
  medium: { label: "Review", dot: "bg-warning", text: "text-warning" },
  low: { label: "Flagged", dot: "bg-destructive", text: "text-destructive" },
};

/** Small dot + word — the quiet confidence indicator used on every row. */
function ConfidenceChip({
  confidence,
  className,
}: {
  confidence: FieldConfidence;
  className?: string;
}) {
  const meta = CONFIDENCE_META[confidence];
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 text-xs font-medium",
        meta.text,
        className,
      )}
    >
      <span aria-hidden className={cn("size-1.5 rounded-full", meta.dot)} />
      {meta.label}
    </span>
  );
}

/** Single extracted header field — clean hover row, no borders. */
function ExtractedFieldRow({
  label,
  value,
  confidence,
  onFileValue,
  selected,
  onSelect,
  className,
}: {
  label: string;
  value: React.ReactNode;
  confidence: FieldConfidence;
  /** Vendor master value — shown when extraction differs. */
  onFileValue?: React.ReactNode;
  selected?: boolean;
  onSelect?: () => void;
  className?: string;
}) {
  const mismatched =
    onFileValue != null &&
    String(onFileValue).trim() !== "" &&
    String(onFileValue) !== String(value);

  return (
    <button
      type="button"
      onClick={onSelect}
      // Negative margin lets the hover pill bleed past the text column while
      // labels stay aligned with the pane content. No explicit width — the
      // flex column stretches it (a calc width overflows Radix ScrollArea's
      // display:table viewport and clips the trailing chip).
      className={cn(
        "-mx-2.5 flex items-center gap-3 rounded-lg px-2.5 py-2 text-left transition-colors duration-150",
        selected ? "bg-selection/8" : onSelect && "hover:bg-muted/50",
        !onSelect && "cursor-default",
        className,
      )}
    >
      <span className="w-28 shrink-0 text-sm text-muted-foreground">{label}</span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-sm font-medium text-foreground">{value}</span>
        {mismatched ? (
          <span className="truncate text-xs text-muted-foreground">
            On file: <span className="text-foreground">{onFileValue}</span>
          </span>
        ) : null}
      </span>
      <ConfidenceChip confidence={confidence} />
    </button>
  );
}

interface ReviewLineItem {
  id: string;
  description: string;
  qty: number;
  unitPrice: number;
  glCode?: string;
  confidence: FieldConfidence;
}

const DEMO_GL_CODES = [
  { value: "6100", label: "6100 · Professional services" },
  { value: "6200", label: "6200 · Consulting" },
  { value: "6300", label: "6300 · Software & tools" },
  { value: "6400", label: "6400 · Travel & expenses" },
] as const;

const fmtUsd = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

function ReviewLineItemEditor({
  items,
  onChange,
  selectedId,
  onSelect,
  className,
}: {
  items: ReviewLineItem[];
  onChange: (items: ReviewLineItem[]) => void;
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  className?: string;
}) {
  const updateItem = (id: string, patch: Partial<ReviewLineItem>) => {
    onChange(items.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  };

  const removeItem = (id: string) => {
    onChange(items.filter((item) => item.id !== id));
  };

  const addItem = () => {
    onChange([
      ...items,
      {
        id: `li-${Date.now()}`,
        description: "",
        qty: 1,
        unitPrice: 0,
        glCode: "6100",
        confidence: "medium",
      },
    ]);
  };

  const lineTotal = (item: ReviewLineItem) =>
    Math.round(item.qty * item.unitPrice * 100) / 100;

  const total = items.reduce((sum, item) => sum + lineTotal(item), 0);

  return (
    <div className={cn("flex flex-col gap-2.5", className)}>
      {items.map((item) => {
        const selected = selectedId === item.id;
        return (
          <div
            key={item.id}
            role="button"
            tabIndex={0}
            onClick={() => onSelect?.(item.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") onSelect?.(item.id);
            }}
            className={cn(
              "flex flex-col gap-2 rounded-xl p-3 transition-colors duration-150",
              selected ? "bg-selection/8" : "bg-muted/40 hover:bg-muted/60",
            )}
          >
            <div className="flex items-center justify-between gap-2">
              <ConfidenceChip confidence={item.confidence} />
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium tabular-nums text-foreground">
                  {fmtUsd(lineTotal(item))}
                </span>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="size-7 text-muted-foreground"
                  aria-label="Remove line item"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeItem(item.id);
                  }}
                >
                  <XIcon />
                </Button>
              </div>
            </div>
            <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_4.5rem_6.5rem]">
              <Input
                value={item.description}
                placeholder="Line description"
                aria-label="Description"
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => updateItem(item.id, { description: e.target.value })}
              />
              <Input
                type="number"
                min={0}
                value={item.qty}
                aria-label="Quantity"
                className="tabular-nums"
                onClick={(e) => e.stopPropagation()}
                onChange={(e) =>
                  updateItem(item.id, { qty: Number(e.target.value) || 0 })
                }
              />
              <Input
                type="number"
                min={0}
                step={0.01}
                value={item.unitPrice}
                aria-label="Unit price"
                className="tabular-nums"
                onClick={(e) => e.stopPropagation()}
                onChange={(e) =>
                  updateItem(item.id, { unitPrice: Number(e.target.value) || 0 })
                }
              />
            </div>
            <div onClick={(e) => e.stopPropagation()}>
              <Select
                value={item.glCode ?? "6100"}
                onValueChange={(v) => updateItem(item.id, { glCode: v })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select GL code" />
                </SelectTrigger>
                <SelectContent>
                  {DEMO_GL_CODES.map((code) => (
                    <SelectItem key={code.value} value={code.value}>
                      {code.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      })}

      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          className="-ml-2 gap-1.5 text-muted-foreground hover:text-foreground"
          onClick={addItem}
        >
          <PlusIcon />
          Add line item
        </Button>
        <span className="text-sm text-muted-foreground">
          Total{" "}
          <span className="font-medium tabular-nums text-foreground">
            {fmtUsd(total)}
          </span>
        </span>
      </div>
    </div>
  );
}

/** Inline extraction health band — three quiet stats, whitespace only. */
function ExtractionSummaryBand({
  matchedPct,
  flaggedCount,
  totalLabel,
  className,
}: {
  matchedPct: number;
  flaggedCount: number;
  totalLabel: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-start gap-x-8 gap-y-3", className)}>
      <SummaryCell value={`${matchedPct}%`} hint="fields matched" />
      <SummaryCell
        value={String(flaggedCount)}
        hint={flaggedCount === 1 ? "needs review" : "need review"}
        tone={flaggedCount > 0 ? "warning" : "default"}
      />
      <SummaryCell value={totalLabel} hint="invoice total" />
    </div>
  );
}

function SummaryCell({
  value,
  hint,
  tone = "default",
}: {
  value: React.ReactNode;
  hint: string;
  tone?: "default" | "warning";
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <span
        className={cn(
          "text-xl leading-tight font-medium tabular-nums tracking-tight",
          tone === "warning" ? "text-warning" : "text-foreground",
        )}
      >
        {value}
      </span>
      <span className="text-xs text-muted-foreground">{hint}</span>
    </div>
  );
}

/** Vendor match confirmation — one quiet tinted row, no border. */
function VendorMatchCard({
  vendor,
  matched,
  onFileName,
  taxId,
  className,
}: {
  vendor: string;
  matched: boolean;
  onFileName?: string;
  taxId?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-2.5 rounded-xl px-3 py-2.5",
        matched ? "bg-success/8" : "bg-warning/10",
        className,
      )}
    >
      {matched ? (
        <CircleCheckIcon className="size-4 shrink-0 text-success" />
      ) : (
        <InfoIcon className="size-4 shrink-0 text-warning" />
      )}
      <span className="min-w-0 flex-1 truncate text-sm text-foreground">
        <span className="font-medium">
          {matched ? "Vendor matched" : "Vendor needs confirmation"}
        </span>
        <span className="text-muted-foreground">
          {" "}
          · {onFileName ?? vendor}
          {taxId ? ` · Tax ID ${taxId}` : null}
        </span>
      </span>
      <span
        className={cn(
          "shrink-0 text-xs font-medium",
          matched ? "text-success" : "text-warning",
        )}
      >
        {matched ? "Verified" : "Review"}
      </span>
    </div>
  );
}

/**
 * Queue chrome — ONE calm line, each fact said once: back link, "Invoice N
 * of M" with a COMPACT inline progress meter (never a full-width bar — at
 * page width it reads as a stray divider), and prev/next buttons (arrow
 * keys also work — the page wires them; no Kbd hint chrome). No "X left in
 * queue" line — that's the same number as N of M.
 */
function ReviewQueueHeader({
  position,
  total,
  backLink,
  onPrevious,
  onNext,
  className,
}: {
  position: number;
  total: number;
  backLink?: React.ReactNode;
  onPrevious?: () => void;
  onNext?: () => void;
  className?: string;
}) {
  const progress = total > 0 ? ((position + 1) / total) * 100 : 0;

  return (
    <div className={cn("flex items-center justify-between gap-3", className)}>
      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        {backLink}
        <span className="text-sm whitespace-nowrap text-muted-foreground">
          Invoice{" "}
          <span className="font-medium tabular-nums text-foreground">
            {position + 1}
          </span>{" "}
          of <span className="tabular-nums">{total}</span>
        </span>
        <Progress
          value={progress}
          className="h-1 w-14 sm:w-24"
          aria-label={`Invoice ${position + 1} of ${total}`}
        />
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon-sm"
          aria-label="Previous invoice"
          disabled={position <= 0}
          onClick={onPrevious}
        >
          <ChevronLeftIcon />
        </Button>
        <Button
          variant="outline"
          size="icon-sm"
          aria-label="Next invoice"
          disabled={position >= total - 1}
          onClick={onNext}
        >
          <ChevronRightIcon />
        </Button>
      </div>
    </div>
  );
}

/**
 * Compact one-row totals — designed to sit right above the action bar so
 * the reviewer verifies the number and approves without scrolling back.
 * Muted breakdown left, the total (the decision number) right.
 */
function ReviewTotalsStrip({
  subtotal,
  tax,
  total,
  className,
}: {
  subtotal: React.ReactNode;
  tax: React.ReactNode;
  total: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1",
        className,
      )}
    >
      <span className="text-xs text-muted-foreground">
        Subtotal <span className="tabular-nums text-foreground">{subtotal}</span>
        <span className="mx-1.5" aria-hidden>
          ·
        </span>
        Tax <span className="tabular-nums text-foreground">{tax}</span>
      </span>
      <span className="flex items-baseline gap-2">
        <span className="text-xs text-muted-foreground">Total</span>
        <span className="text-lg font-medium tabular-nums tracking-tight text-foreground">
          {total}
        </span>
      </span>
    </div>
  );
}

export {
  ConfidenceChip,
  DEMO_GL_CODES,
  ExtractedFieldRow,
  ExtractionSummaryBand,
  ReviewLineItemEditor,
  ReviewQueueHeader,
  ReviewTotalsStrip,
  VendorMatchCard,
};
export type { FieldConfidence, ReviewLineItem };
