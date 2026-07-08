import * as React from "react";
import { XIcon } from "@/components/icons";

import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

/**
 * ListDetailLayout — master list + detail panel with overlay discipline.
 *
 * Desktop: side-by-side split; the detail column has a real minimum width
 * (24rem) so forms never cramp or truncate. Mobile: the detail renders in a
 * single Sheet. There is exactly ONE detail surface at a time — never stack
 * a second panel/sheet on top of this layout; navigate the detail's content
 * instead.
 */
function ListDetailLayout({
  list,
  detail,
  detailOpen,
  onDetailClose,
  detailTitle,
  detailDescription,
  detailWidth = "26rem",
  className,
}: {
  /** The master column — a table, kanban, or list. */
  list: React.ReactNode;
  /** Detail content for the current selection (header is provided). */
  detail: React.ReactNode;
  /** Whether a row is selected. Drive from `selected != null`. */
  detailOpen: boolean;
  onDetailClose: () => void;
  detailTitle: React.ReactNode;
  detailDescription?: React.ReactNode;
  /** Desktop detail column width. Keep ≥ 24rem so forms don't cramp. */
  detailWidth?: string;
  className?: string;
}) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className={cn("flex min-h-0 flex-1 flex-col", className)}>
        <div className="min-h-0 flex-1">{list}</div>
        <Sheet open={detailOpen} onOpenChange={(open) => !open && onDetailClose()}>
          <SheetContent side="right" className="w-full sm:max-w-lg">
            <SheetHeader className="border-b border-border">
              <SheetTitle>{detailTitle}</SheetTitle>
              {detailDescription ? (
                <SheetDescription>{detailDescription}</SheetDescription>
              ) : null}
            </SheetHeader>
            <ScrollArea className="min-h-0 flex-1 px-4 pb-4">{detail}</ScrollArea>
          </SheetContent>
        </Sheet>
      </div>
    );
  }

  return (
    <div className={cn("flex min-h-0 min-w-0 flex-1", className)}>
      <div className="min-h-0 min-w-0 flex-1">{list}</div>
      {detailOpen ? (
        <aside
          className="flex min-h-0 shrink-0 flex-col border-l border-border bg-card"
          style={{ width: detailWidth, minWidth: "24rem" }}
        >
          <div className="flex items-start justify-between gap-2 border-b border-border p-4">
            <div className="flex min-w-0 flex-col gap-0.5">
              <h2 className="truncate font-medium text-foreground">{detailTitle}</h2>
              {detailDescription ? (
                <p className="truncate text-sm text-muted-foreground">
                  {detailDescription}
                </p>
              ) : null}
            </div>
            <button
              type="button"
              onClick={onDetailClose}
              className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              aria-label="Close detail"
            >
              <XIcon className="size-4" />
            </button>
          </div>
          <ScrollArea className="min-h-0 flex-1">
            <div className="p-4">{detail}</div>
          </ScrollArea>
        </aside>
      ) : null}
    </div>
  );
}

export { ListDetailLayout };
