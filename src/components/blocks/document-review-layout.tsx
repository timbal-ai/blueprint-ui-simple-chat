import * as React from "react";

import { ChevronRightIcon, FileTextIcon } from "@/components/icons";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

/**
 * DocumentReviewLayout — the canonical 50/50 document review split: source
 * file on the left, extracted entries + actions on the right.
 *
 * Clean grammar (hard-won): the two panes are FLOATING CARDS with generous
 * whitespace — NO rule lines inside the review pane. Header, body, and
 * footer separate through spacing alone; the pinned footer gets a soft
 * scroll-fade instead of a border.
 *
 * Desktop: equal resizable panes with a drag handle. Mobile: NEVER a
 * squeezed stacked split — the review card owns the screen and the source
 * document opens in a full-height bottom Drawer from a file trigger row
 * (reviewers work the entries and pull the document up to double-check).
 *
 * Pair `PdfViewer` (height="100%") in the document slot. Pass `reviewHeader`
 * for record identity, `reviewFooter` for approve/reject (ReviewActionBar),
 * and the scrollable review content as `children`.
 */
function DocumentReviewLayout({
  document,
  documentTitle = "Source document",
  documentMeta,
  children,
  reviewHeader,
  reviewFooter,
  defaultSplit = 50,
  resizable = true,
  fill = false,
  className,
}: {
  /** Left pane — typically `<PdfViewer height="100%" />`. */
  document: React.ReactNode;
  /** File name shown on the mobile drawer trigger, e.g. "INV-2026-117.pdf". */
  documentTitle?: string;
  /** Muted second line on the mobile trigger, e.g. "PDF · 2 pages". */
  documentMeta?: React.ReactNode;
  /** Scrollable review body — fields, line items, totals. */
  children: React.ReactNode;
  /** Pinned header above the review scroll (identity, amount, chips). */
  reviewHeader?: React.ReactNode;
  /** Pinned footer below the review scroll (approve/reject actions). */
  reviewFooter?: React.ReactNode;
  /** Initial left pane size in percent (default 50). */
  defaultSplit?: number;
  /** Allow drag-resize between panes on desktop. */
  resizable?: boolean;
  /** Stretch to fill the shell content area (use on dedicated review routes). */
  fill?: boolean;
  className?: string;
}) {
  const isMobile = useIsMobile();

  // `fill` sizes through the flex chain (PageBody → shell content own the
  // viewport height) instead of a magic svh calc — the cards always end
  // ABOVE the shell's bottom inset, so their shadows never clip on the
  // viewport edge. The min-h floor kicks in on short screens (page scrolls).
  const heightClass = fill ? "flex-1 min-h-[26rem]" : "min-h-[28rem]";

  if (isMobile) {
    return (
      <div
        data-slot="document-review-layout"
        // Natural page flow on phones — the shell grows with content, so a
        // viewport-pinned card layout can't work here. The review card flows
        // with the page scroll and the ACTIONS pin in a fixed bottom bar
        // (pb clears it); the document lives in a bottom drawer.
        className={cn("flex flex-col gap-3 pb-36", className)}
      >
        <Drawer direction="bottom">
          <DrawerTrigger asChild>
            <button
              type="button"
              className="flex shrink-0 items-center gap-3 rounded-xl border border-border bg-card px-3.5 py-3 text-left shadow-[0_1px_2px_0_color-mix(in_srgb,black_3%,transparent),0_3px_8px_-4px_color-mix(in_srgb,black_4%,transparent)] transition-colors active:bg-muted/50"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/50 text-muted-foreground [&_svg]:size-4.5">
                <FileTextIcon />
              </span>
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-sm font-medium text-foreground">
                  {documentTitle}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {documentMeta ?? "Tap to view the original"}
                </span>
              </span>
              <ChevronRightIcon className="size-4 shrink-0 text-muted-foreground" />
            </button>
          </DrawerTrigger>
          <DrawerContent size="full">
            <DrawerTitle className="sr-only">{documentTitle}</DrawerTitle>
            {/* Near-fullscreen document — the PdfViewer brings its own
                toolbar (zoom, open, download); the grab handle closes.
                Explicit height: DrawerContent is h-auto, so a flex-1 child
                would collapse to zero. */}
            <div className="h-[85dvh] min-h-0 p-3 pt-2">{document}</div>
          </DrawerContent>
        </Drawer>
        <ReviewPane header={reviewHeader}>{children}</ReviewPane>
        {reviewFooter ? (
          <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur">
            {reviewFooter}
          </div>
        ) : null}
      </div>
    );
  }

  if (!resizable) {
    return (
      <div
        data-slot="document-review-layout"
        className={cn("flex min-h-0 min-w-0 gap-4", heightClass, className)}
      >
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">{document}</div>
        <ReviewPane
          header={reviewHeader}
          footer={reviewFooter}
          className="w-1/2 min-w-[24rem] shrink-0"
        >
          {children}
        </ReviewPane>
      </div>
    );
  }

  // Panels default to `overflow: hidden` (react-resizable-panels inline
  // style) which crops the cards' soft shadows — override to visible; the
  // cards clip their own content.
  const panelStyle: React.CSSProperties = { overflow: "visible" };

  return (
    <ResizablePanelGroup
      data-slot="document-review-layout"
      direction="horizontal"
      className={cn("min-h-0 min-w-0 !overflow-visible", heightClass, className)}
    >
      <ResizablePanel
        defaultSize={defaultSplit}
        minSize={32}
        style={panelStyle}
        className="min-h-0 min-w-0"
      >
        <div className="flex h-full min-h-0 flex-col pr-2">{document}</div>
      </ResizablePanel>
      <ResizableHandle
        withHandle
        className="bg-transparent after:hidden"
      />
      <ResizablePanel
        defaultSize={100 - defaultSplit}
        minSize={32}
        style={panelStyle}
        className="min-h-0 min-w-0"
      >
        <ReviewPane
          header={reviewHeader}
          footer={reviewFooter}
          className="ml-2 h-full"
        >
          {children}
        </ReviewPane>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

/**
 * The review card: floating surface, spacing-only structure. The footer is
 * a flex sibling of the scroller (never displaced) and separates via a
 * soft fade instead of a border line.
 */
function ReviewPane({
  header,
  footer,
  children,
  className,
}: {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <aside
      data-slot="document-review-pane"
      // The house Card surface (Beacon recipe) — same corners, border, and
      // quiet two-layer shadow as ui/card, structured as a flex column.
      className={cn(
        "flex min-h-0 min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-[0_1px_2px_0_color-mix(in_srgb,black_3%,transparent),0_3px_8px_-4px_color-mix(in_srgb,black_4%,transparent)]",
        className,
      )}
    >
      {header ? (
        <div className="shrink-0 px-4 pt-4 pb-4 sm:px-5 sm:pt-5">{header}</div>
      ) : null}
      {/* Plain overflow scroller (NOT Radix ScrollArea): its display:table
          viewport wrapper sizes to content, so hover rows that bleed via
          negative margins would widen it and clip against the card edge. */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div
          className={cn(
            "flex flex-col gap-6 px-4 pb-6 sm:px-5",
            !header && "pt-4 sm:pt-5",
          )}
        >
          {children}
        </div>
      </div>
      {footer ? (
        <div className="relative shrink-0 px-4 pt-1 pb-4 sm:px-5">
          {/* Soft scroll fade — replaces the border line above the actions. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 -top-6 h-6 bg-gradient-to-t from-card to-transparent"
          />
          {footer}
        </div>
      ) : null}
    </aside>
  );
}

interface ReviewAction {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  /** Optional keyboard hint rendered inside the primary button. */
  shortcut?: string;
}

/**
 * ReviewActionBar — pinned approve / reject / secondary actions for the
 * review pane footer. Desktop: reject left (white outline, red label, no
 * icon), primary right. Mobile: the primary goes FULL-WIDTH on top
 * (thumb-first), reject + secondary share the row below it.
 */
function ReviewActionBar({
  leading,
  secondary = [],
  primary,
  className,
}: {
  /** Left-aligned action — typically reject or void. */
  leading?: ReviewAction;
  /** Middle actions — save draft, request changes. */
  secondary?: ReviewAction[];
  /** Right-aligned primary — approve, post, publish. */
  primary?: ReviewAction;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {primary ? (
        <Button
          className="order-first w-full sm:order-last sm:w-auto"
          disabled={primary.disabled}
          onClick={primary.onClick}
        >
          {primary.icon}
          {primary.label}
          {primary.shortcut ? (
            <span className="ml-0.5 hidden text-[10px] opacity-60 lg:inline">
              {primary.shortcut}
            </span>
          ) : null}
        </Button>
      ) : null}
      {leading ? (
        <Button
          variant="outline"
          className="mr-auto text-destructive hover:bg-destructive/10 hover:text-destructive"
          disabled={leading.disabled}
          onClick={leading.onClick}
        >
          {leading.label}
        </Button>
      ) : null}
      {secondary.map((action) => (
        <Button
          key={action.id}
          variant="outline"
          disabled={action.disabled}
          onClick={action.onClick}
        >
          {action.icon}
          {action.label}
        </Button>
      ))}
    </div>
  );
}

export { DocumentReviewLayout, ReviewActionBar };
export type { ReviewAction };
