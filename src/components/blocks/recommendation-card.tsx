import * as React from "react";
import { CheckIcon, PencilIcon, XIcon } from "@/components/icons";

import { Chip } from "@/components/base/badges/chip";
import { Button } from "@/components/base/buttons/button";
import { IconButton } from "@/components/base/buttons/icon-button";
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
  { label: string; color: React.ComponentProps<typeof Chip>["color"] }
> = {
  high: { label: "High", color: "lime" },
  medium: { label: "Medium", color: "yellow" },
  low: { label: "Low", color: "soft" },
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
        <Chip variant="caption" color={priority.color} className="mt-0.5 rounded-full px-2.5">
          {priority.label}
        </Chip>
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
        <IconButton
          icon={PencilIcon}
          size="small"
          aria-label="Edit recommendation"
          onClick={() => onEdit?.(recommendation)}
        />
        <Button
          variant="secondary"
          size="small"
          leadingIcon={XIcon}
          className="flex-1"
          onClick={() => onDismiss?.(recommendation)}
        >
          Dismiss
        </Button>
        <Button
          size="small"
          leadingIcon={CheckIcon}
          className="flex-1"
          onClick={() => onApprove?.(recommendation)}
        >
          Approve
        </Button>
      </div>
    </Card>
  );
}

export { RecommendationCard };
export type { Recommendation };
