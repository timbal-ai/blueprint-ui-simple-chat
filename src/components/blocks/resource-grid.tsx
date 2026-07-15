import * as React from "react";

import { cn } from "@/lib/utils";
import { Chip } from "@/components/base/badges/chip";
import { Switch } from "@/components/base/switch/switch";

const BADGE_COLOR: Record<
  NonNullable<NonNullable<ResourceGridItem["badge"]>["variant"]>,
  React.ComponentProps<typeof Chip>["color"]
> = {
  success: "lime",
  secondary: "gray",
  info: "blue",
  warning: "yellow",
};

/**
 * ResourceGrid — a responsive grid of resource cards: integrations,
 * templates, data sources, catalog items. Each card is an icon tile +
 * name + description with an optional status badge and a trailing
 * action (enable switch or custom node).
 *
 * Cards animate in and lift subtly on hover; the whole card is clickable
 * when `onSelect` is provided.
 */

interface ResourceGridItem {
  id: string;
  name: string;
  description?: string;
  /** Icon tile content — an icon component instance or an <img>. */
  icon?: React.ReactNode;
  /** Optional status chip, e.g. "Connected", "Beta". */
  badge?: { label: string; variant?: "success" | "secondary" | "info" | "warning" };
  /** Render a Switch bound to this value (omit for no toggle). */
  enabled?: boolean;
  /** Custom trailing node — overrides the Switch. */
  action?: React.ReactNode;
}

function ResourceGrid({
  items,
  onSelect,
  onToggle,
  columns = 3,
  className,
}: {
  items: ResourceGridItem[];
  onSelect?: (id: string) => void;
  onToggle?: (id: string, enabled: boolean) => void;
  /** Max columns at the widest breakpoint. */
  columns?: 2 | 3 | 4;
  className?: string;
}) {
  const gridCols = {
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-2 xl:grid-cols-3",
    4: "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  }[columns];

  return (
    <div className={cn("grid grid-cols-1 gap-3", gridCols, className)}>
      {items.map((item) => {
        const clickable = onSelect != null;
        return (
          <div
            key={item.id}
            role={clickable ? "button" : undefined}
            tabIndex={clickable ? 0 : undefined}
            onClick={clickable ? () => onSelect(item.id) : undefined}
            onKeyDown={
              clickable
                ? (e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onSelect(item.id);
                    }
                  }
                : undefined
            }
            className={cn(
              "flex min-w-0 flex-col gap-3 rounded-xl border border-border bg-card p-4",
              "transition-[box-shadow,border-color,transform] duration-200",
              clickable &&
                "cursor-pointer hover:-translate-y-0.5 hover:border-foreground/15 hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none",
            )}
          >
            <div className="flex items-start justify-between gap-2">
              {item.icon ? (
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/50 text-foreground [&>svg]:size-4.5">
                  {item.icon}
                </span>
              ) : null}
              {item.action ??
                (item.enabled !== undefined ? (
                  <span onClick={(e) => e.stopPropagation()}>
                    <Switch
                      size="sm"
                      isSelected={item.enabled}
                      onChange={(v) => onToggle?.(item.id, v)}
                      aria-label={`Toggle ${item.name}`}
                    />
                  </span>
                ) : null)}
            </div>
            <div className="flex min-w-0 flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="truncate text-sm font-medium text-foreground">
                  {item.name}
                </span>
                {item.badge ? (
                  <Chip
                    variant="caption"
                    color={BADGE_COLOR[item.badge.variant ?? "secondary"]}
                    className="h-5 px-1.5 text-[11px]"
                  >
                    {item.badge.label}
                  </Chip>
                ) : null}
              </div>
              {item.description ? (
                <p className="line-clamp-2 text-[13px] leading-snug text-muted-foreground">
                  {item.description}
                </p>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export { ResourceGrid };
export type { ResourceGridItem };
