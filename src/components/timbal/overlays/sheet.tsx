"use client";

import {
  Dialog as AriaDialog,
  DialogTrigger as AriaDialogTrigger,
  Modal as AriaModal,
  ModalOverlay as AriaModalOverlay,
  type DialogProps as AriaDialogProps,
  type ModalOverlayProps as AriaModalOverlayProps,
} from "react-aria-components";
import { cx } from "@/utils/cx";
import { OverlayBody, OverlayFooter, OverlayHeader } from "./overlay-parts";

/**
 * Sheet — a side panel on the same React Aria stack as `Modal` (focus trap,
 * Escape, outside press, focus restore).
 *
 * Floats 12px off the viewport edge, fully rounded, on the BoardUI panel
 * tokens; below `sm` every size except `sm` goes full-width (a right/left
 * sheet fills the screen, a bottom sheet keeps its rounded top). `size="sm"`
 * stays a narrow floating drawer on phones — it is the navigation drawer
 * the shells use, where a strip of backdrop to tap is part of the pattern.
 *
 * Motion is the house condense-in (fade + slight scale + 4px blur) anchored
 * to the edge the sheet hangs from, plus an 8px nudge from that edge.
 *
 * ```tsx
 * <Sheet isOpen={open} onOpenChange={setOpen} side="right" size="md">
 *   <SheetHeader title="Filters" />
 *   <SheetBody>…</SheetBody>
 *   <SheetFooter>…</SheetFooter>
 * </Sheet>
 * ```
 */

export type SheetSide = "right" | "left" | "bottom";
export type SheetSize = "sm" | "md" | "lg" | "xl" | "full";

const OVERLAY_SIDE: Record<SheetSide, string> = {
  right: "justify-end",
  left: "justify-start",
  bottom: "items-end justify-center",
};

const PANEL_WIDTH: Record<SheetSize, string> = {
  sm: "w-[300px]",
  md: "w-[440px]",
  lg: "w-[600px]",
  xl: "w-[800px]",
  full: "w-full",
};

const PANEL_SIDE: Record<SheetSide, string> = {
  right: "h-full origin-right data-[entering]:translate-x-2 data-[exiting]:translate-x-2",
  left: "h-full origin-left data-[entering]:-translate-x-2 data-[exiting]:-translate-x-2",
  bottom: "max-h-[85dvh] w-full origin-bottom data-[entering]:translate-y-2 data-[exiting]:translate-y-2",
};

const SHEET_PANEL_MOTION = [
  "transform-gpu transition-[opacity,transform,translate,scale,filter] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] will-change-[opacity,transform,filter]",
  "data-[entering]:scale-95 data-[entering]:opacity-0 data-[entering]:blur-[4px]",
  "data-[exiting]:scale-95 data-[exiting]:opacity-0 data-[exiting]:blur-[4px] data-[exiting]:duration-200 data-[exiting]:ease-in",
  "motion-reduce:transition-none",
].join(" ");

export interface SheetProps
  extends Pick<
    AriaModalOverlayProps,
    "isOpen" | "defaultOpen" | "onOpenChange" | "isDismissable" | "isKeyboardDismissDisabled" | "shouldCloseOnInteractOutside"
  > {
  side?: SheetSide;
  size?: SheetSize;
  /** Accessible name when the sheet has no `SheetHeader` title. */
  "aria-label"?: string;
  /** Extra classes on the panel (surface overrides, padding). */
  className?: string;
  /** Extra classes on the backdrop (e.g. `bg-black/10` for a nav drawer). */
  backdropClassName?: string;
  children: AriaDialogProps["children"];
}

export function Sheet({
  side = "right",
  size = "md",
  "aria-label": ariaLabel,
  className,
  backdropClassName,
  children,
  isDismissable = true,
  ...overlayProps
}: SheetProps) {
  const mobileFull = size !== "sm";
  return (
    <AriaModalOverlay
      {...overlayProps}
      isDismissable={isDismissable}
      className={cx(
        "fixed inset-0 z-100 flex bg-black/40 p-3",
        OVERLAY_SIDE[side],
        mobileFull && "max-sm:p-0",
        "transition-opacity duration-300 ease-out motion-reduce:transition-none",
        "data-[entering]:opacity-0 data-[exiting]:opacity-0 data-[exiting]:duration-200",
        backdropClassName,
      )}
    >
      <AriaModal
        className={cx(
          "relative flex max-w-full flex-col overflow-hidden outline-none",
          "rounded-3xl border border-border-button-default bg-background-primary-default shadow-xl",
          PANEL_WIDTH[size],
          PANEL_SIDE[side],
          mobileFull &&
            (side === "bottom"
              ? "max-sm:rounded-b-none max-sm:border-x-0 max-sm:border-b-0"
              : "max-sm:w-full max-sm:rounded-none max-sm:border-0"),
          SHEET_PANEL_MOTION,
          className,
        )}
      >
        <AriaDialog aria-label={ariaLabel} className="flex min-h-0 max-h-full flex-1 flex-col outline-none">
          {children}
        </AriaDialog>
      </AriaModal>
    </AriaModalOverlay>
  );
}

/** Wrap a trigger element + `<Sheet>` for uncontrolled open state. */
export const SheetTrigger = AriaDialogTrigger;

export const SheetHeader = OverlayHeader;
export const SheetBody = OverlayBody;
export const SheetFooter = OverlayFooter;
