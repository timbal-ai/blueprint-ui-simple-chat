import * as React from "react";
import { XIcon, type IconComponent } from "@/components/icons";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

/**
 * BulkActionBar — the floating selection bubble.
 *
 * When rows are selected in a table (or cards in a grid), this pill floats
 * bottom-center with the count and the bulk actions (edit, export,
 * remove…). It is a STANDALONE component: render it as a sibling of the
 * table, give it the selection count, and it handles visibility,
 * positioning, and enter animation itself. Renders nothing at count 0.
 *
 * Wiring with DataTable:
 *
 *   const [rowSelection, setRowSelection] = React.useState({});
 *   <DataTable rowSelection={rowSelection} onRowSelectionChange={setRowSelection} … />
 *   <BulkActionBar
 *     count={Object.keys(rowSelection).length}
 *     onClear={() => setRowSelection({})}
 *     actions={[
 *       { id: "edit", label: "Edit", icon: PencilIcon, onClick: … },
 *       { id: "delete", label: "Delete", icon: Trash2Icon, tone: "destructive", onClick: … },
 *     ]}
 *   />
 */

interface BulkAction {
  id: string;
  label: string;
  icon?: IconComponent;
  /** "destructive" renders the label/icon in the destructive tone. */
  tone?: "default" | "destructive";
  onClick: () => void;
}

function BulkActionBar({
  count,
  actions,
  onClear,
  itemsLabel = "selected",
  className,
}: {
  /** Number of selected items — the bar hides itself at 0. */
  count: number;
  actions: BulkAction[];
  /** Clears the selection (the trailing ✕). */
  onClear: () => void;
  /** e.g. "members selected". Default "selected". */
  itemsLabel?: string;
  className?: string;
}) {
  if (count === 0) return null;

  return (
    <div
      data-slot="bulk-action-bar"
      className={cn(
        "pointer-events-none fixed inset-x-0 bottom-6 z-40 flex justify-center px-4",
        className,
      )}
    >
      <div
        role="toolbar"
        aria-label="Bulk actions"
        className="pointer-events-auto flex items-center gap-1 rounded-full border border-border bg-card py-1.5 pr-1.5 pl-4 shadow-[0_4px_12px_-2px_color-mix(in_srgb,black_16%,transparent),0_12px_32px_-8px_color-mix(in_srgb,black_20%,transparent)] duration-200 ease-out-strong animate-in fade-in-0 slide-in-from-bottom-3"
      >
        <span className="text-sm whitespace-nowrap text-foreground tabular-nums">
          {count} {itemsLabel}
        </span>
        <Separator orientation="vertical" className="mx-2 !h-4" />
        <div className="flex items-center gap-0.5">
          {actions.map((action) => (
            <Button
              key={action.id}
              variant="ghost"
              size="sm"
              className={cn(
                "h-7 gap-1.5 rounded-full px-2.5",
                action.tone === "destructive" &&
                  "text-destructive hover:bg-destructive/10 hover:text-destructive",
              )}
              onClick={action.onClick}
            >
              {action.icon ? <action.icon className="size-3.5" /> : null}
              {action.label}
            </Button>
          ))}
        </div>
        <Separator orientation="vertical" className="mx-1 !h-4" />
        <Button
          variant="ghost"
          size="icon-sm"
          className="size-7 rounded-full text-muted-foreground hover:text-foreground"
          onClick={onClear}
          aria-label="Clear selection"
        >
          <XIcon className="size-3.5" />
        </Button>
      </div>
    </div>
  );
}

export { BulkActionBar };
export type { BulkAction };
