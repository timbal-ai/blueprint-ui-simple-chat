import * as React from "react";
import { CheckIcon, PencilIcon, XIcon } from "@/components/icons";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

/**
 * RecommendationCard — one approve/dismiss suggestion (the "Command Center"
 * reference grammar): 17px medium title + rounded priority chip, muted
 * summary, a hairline-separated label/value detail block ("Projected
 * impact", "Related", …), and a pinned action row (outline edit icon,
 * outline Dismiss, dark Approve).
 *
 * Lay several out in a `grid gap-4 md:grid-cols-2 2xl:grid-cols-3` with
 * `items-stretch` so footers align across the row.
 */

interface Recommendation {
  id: string;
  title: string;
  summary: string;
  priority: "high" | "medium" | "low";
  /** Label/value detail rows — e.g. Projected impact, Related. */
  details: { label: string; value: string }[];
}

const PRIORITY_META: Record<
  Recommendation["priority"],
  { label: string; variant: React.ComponentProps<typeof Badge>["variant"] }
> = {
  high: { label: "High", variant: "success" },
  medium: { label: "Medium", variant: "warning" },
  low: { label: "Low", variant: "outline" },
};

function RecommendationCard({
  recommendation,
  onApprove,
  onDismiss,
  onEdit,
}: {
  recommendation: Recommendation;
  onApprove?: (rec: Recommendation) => void;
  onDismiss?: (rec: Recommendation) => void;
  onEdit?: (rec: Recommendation) => void;
}) {
  const priority = PRIORITY_META[recommendation.priority];
  return (
    <Card className="gap-0 py-0">
      <div className="flex items-start justify-between gap-3 px-5 pt-5">
        {/* Card titles match page-title weight — medium, never bold. */}
        <h3 className="text-[17px] leading-snug font-medium tracking-tight text-foreground">
          {recommendation.title}
        </h3>
        <Badge variant={priority.variant} className="mt-0.5 rounded-full px-2.5">
          {priority.label}
        </Badge>
      </div>
      <p className="px-5 pt-2 pb-4 text-sm leading-relaxed text-muted-foreground">
        {recommendation.summary}
      </p>
      <div className="flex flex-1 flex-col gap-1.5 border-t border-border px-5 py-4">
        {recommendation.details.map((detail) => (
          <div key={detail.label} className="flex flex-wrap items-baseline gap-x-2 text-sm">
            <span className="text-muted-foreground">{detail.label}</span>
            <span className="font-medium text-foreground">{detail.value}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 border-t border-border p-3">
        <Button
          variant="outline"
          size="icon"
          aria-label="Edit recommendation"
          onClick={() => onEdit?.(recommendation)}
        >
          <PencilIcon />
        </Button>
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => onDismiss?.(recommendation)}
        >
          <XIcon />
          Dismiss
        </Button>
        <Button className="flex-1" onClick={() => onApprove?.(recommendation)}>
          <CheckIcon />
          Approve
        </Button>
      </div>
    </Card>
  );
}

export { RecommendationCard };
export type { Recommendation };
