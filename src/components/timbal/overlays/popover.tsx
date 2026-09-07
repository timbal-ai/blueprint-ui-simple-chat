"use client";

import {
  Dialog as AriaDialog,
  DialogTrigger as AriaDialogTrigger,
  Popover as AriaPopover,
  type DialogProps as AriaDialogProps,
  type PopoverProps as AriaPopoverProps,
} from "react-aria-components";
import { MENU_POPOVER_SURFACE } from "@/components/base/dropdown/menu-styles";
import { cx } from "@/utils/cx";

/**
 * Popover — a free-form anchored panel (React Aria `Popover` + `Dialog`) on
 * the BoardUI dropdown skin (`MENU_POPOVER_SURFACE`: white panel, hairline
 * border, radius 16, p 10, `shadow-dropdown`, the 150ms fade + scale-95 +
 * 2px blur in/out, transform-origin following placement).
 *
 * Use it for anything that is not a menu of rows (that is `Dropdown` from
 * `base/dropdown`): a help card, a mini form, a date picker, a colour swatch.
 *
 * ```tsx
 * <PopoverTrigger>
 *   <Button variant="secondary">Help</Button>
 *   <Popover aria-label="Help" placement="bottom end" className="w-72">
 *     {({ close }) => <>…<Button onClick={close}>Got it</Button></>}
 *   </Popover>
 * </PopoverTrigger>
 * ```
 * Standalone (no trigger wrapper): pass `triggerRef` + `isOpen`/`onOpenChange`.
 */

export interface PopoverProps
  extends Pick<
    AriaPopoverProps,
    | "placement"
    | "offset"
    | "crossOffset"
    | "shouldFlip"
    | "triggerRef"
    | "isOpen"
    | "defaultOpen"
    | "onOpenChange"
    | "isNonModal"
    | "isKeyboardDismissDisabled"
    | "shouldCloseOnInteractOutside"
  > {
  /** Accessible name of the dialog. */
  "aria-label": string;
  /** Extra classes on the panel — width, padding overrides (default p-2.5). */
  className?: string;
  /** Classes on the inner dialog (a flex column). */
  dialogClassName?: string;
  children: AriaDialogProps["children"];
}

export function Popover({
  "aria-label": ariaLabel,
  placement = "bottom start",
  offset = 4,
  className,
  dialogClassName,
  children,
  ...popoverProps
}: PopoverProps) {
  return (
    <AriaPopover
      {...popoverProps}
      placement={placement}
      offset={offset}
      className={cx(MENU_POPOVER_SURFACE, "motion-reduce:transition-none", className)}
    >
      <AriaDialog aria-label={ariaLabel} className={cx("flex flex-col gap-1 outline-none", dialogClassName)}>
        {children}
      </AriaDialog>
    </AriaPopover>
  );
}

/** Wrap a trigger element (an RAC `Button`, or any BoardUI button) + `<Popover>`. */
export const PopoverTrigger = AriaDialogTrigger;
