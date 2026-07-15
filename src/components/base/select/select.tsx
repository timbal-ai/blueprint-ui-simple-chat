"use client";

import { createContext, useContext, useRef, useState } from "react";
import type { ReactNode, Ref } from "react";
import {
  Button as AriaButton,
  ListBox as AriaListBox,
  ListBoxItem as AriaListBoxItem,
  Popover as AriaPopover,
  Select as AriaSelect,
  SelectValue as AriaSelectValue,
} from "react-aria-components";
import type {
  ListBoxItemProps as AriaListBoxItemProps,
  SelectProps as AriaSelectProps,
  SelectValueRenderProps as AriaSelectValueRenderProps,
} from "react-aria-components";
import { ChevronDownSmall } from "@/components/foundations/icons/chevrons";
import { cx } from "@/utils/cx";
import { useDismissOnOutsidePress, useTriggerToggle } from "@/utils/use-dismiss-on-outside-press";

/**
 * Figma source: Board UI → dashboard 1 dropdown triggers ("All prices" filter
 * node 3731:3208, table status dropdown node 3731:3264).
 *
 * Select with a button trigger styled 1:1 with Figma:
 *   trigger  bg color/white, 1px border/button/default, shadow/xs,
 *            px 10 py 8, radius/2lg (10px), gap 6,
 *            Body 1/Medium text color/neutral/950,
 *            16px chevron (custom stroke glyph) in text/secondary
 *
 * The open popover/listbox is not designed in Figma yet — it borrows the
 * trigger surface tokens (white, border/button/default, radius/2lg,
 * shadow/lg). Flag for a design pass.
 *
 * Item content is free-form: pass a `StatusDot` + text for status selects.
 */

export type SelectSize = "sm" | "md";

const SelectSizeContext = createContext<SelectSize>("md");

export interface SelectProps<T extends object>
  extends Omit<AriaSelectProps<T>, "children"> {
  /** Trigger + listbox width. Defaults to hug content. */
  className?: string;
  triggerClassName?: string;
  /** Classes for the open popover (e.g. constrain its width). */
  popoverClassName?: string;
  /** `md` (default) or `sm` for compact/dense contexts (e.g. compact tables). */
  size?: SelectSize;
  children: ReactNode;
  items?: Iterable<T>;
  /** Customise the trigger's rendered value (e.g. a compact flag + dial code).
   *  Falls back to the selected item's own content when omitted. */
  renderValue?: ReactNode | ((values: AriaSelectValueRenderProps<T>) => ReactNode);
  ref?: Ref<HTMLDivElement>;
}

export function Select<T extends object>({
  className,
  triggerClassName,
  popoverClassName,
  size = "md",
  children,
  items,
  renderValue,
  ref,
  ...props
}: SelectProps<T>) {
  // The popover is `isNonModal`: react-aria's modal scroll lock puts
  // `overflow: hidden` on <html>, which — with this app's `h-full` root —
  // collapses the page scroll position and visibly yanks the sticky
  // sidebar upward every time a select opens. Non-modal skips the lock,
  // but also disables react-aria's outside-press dismissal (`isDismissable`
  // is hard-coupled to `!isNonModal` in usePopover), so open state is
  // controlled here and dismissal restored manually — the same fix as the
  // date-picker family (see utils/use-dismiss-on-outside-press.ts).
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  useDismissOnOutsidePress(isOpen, () => setIsOpen(false), [triggerRef, popoverRef]);
  // Pressing the trigger while open closes the popover instead of reopening
  const allowOpenChange = useTriggerToggle(isOpen, triggerRef);

  return (
    <AriaSelect
      ref={ref}
      {...props}
      isOpen={isOpen}
      onOpenChange={(o) => allowOpenChange(o) && setIsOpen(o)}
      className={cx("group flex flex-col", className)}
    >
      {({ isOpen }) => (
        <>
          <AriaButton
            ref={triggerRef}
            className={cx(
              "flex w-full cursor-pointer items-center justify-between rounded-2lg",
              "border border-border-button-default bg-background-primary-default shadow-xs",
              "text-text-primary",
              "transition-[background-color,border-color,box-shadow,padding,font-size] duration-200 ease",
              "hover:bg-background-primary-hover hover:border-border-button-hover",
              "outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-border-focus-ring",
              "disabled:cursor-not-allowed disabled:bg-background-primary-disabled disabled:text-text-tertiary disabled:shadow-none",
              size === "sm"
                ? "gap-1 px-[7px] py-1 text-body-2-medium"
                : "gap-1.5 px-2.5 py-2 text-body-medium",
              triggerClassName,
            )}
          >
            <AriaSelectValue
              className={cx(
                "flex min-w-0 items-center truncate",
                size === "sm" ? "gap-1" : "gap-[5px]",
              )}
            >
              {renderValue as never /* RAC accepts node or render-prop */}
            </AriaSelectValue>
            <ChevronDownSmall
              className={cx(
                "shrink-0 text-text-secondary transition-transform duration-200 ease",
                size === "sm" ? "size-3.5" : "size-4",
                isOpen && "rotate-180",
              )}
            />
          </AriaButton>
          <AriaPopover
            ref={popoverRef}
            isNonModal
            offset={2}
            className={cx(
              // Radix modals (Dialog/Sheet/Drawer) set `pointer-events: none`
              // on <body> while open; this popover portals under <body>, so
              // it must restore its own pointer events or every option is
              // dead inside a modal.
              "pointer-events-auto",
              "min-w-(--trigger-width) origin-top overflow-auto rounded-2lg",
              "border border-border-button-default bg-background-primary-default p-1 shadow-sidebar",
              "transition duration-150 ease-out",
              "data-[entering]:opacity-0 data-[entering]:scale-90 data-[entering]:blur-[2px]",
              "data-[exiting]:opacity-0 data-[exiting]:scale-90 data-[exiting]:blur-[2px]",
              popoverClassName,
            )}
          >
            <AriaListBox items={items} className="flex max-h-[200px] flex-col gap-0.5 overflow-auto outline-none">
              <SelectSizeContext.Provider value={size}>{children}</SelectSizeContext.Provider>
            </AriaListBox>
          </AriaPopover>
        </>
      )}
    </AriaSelect>
  );
}

export interface SelectItemProps extends Omit<AriaListBoxItemProps, "children"> {
  children?: ReactNode;
}

export function SelectItem({ className, children, ...props }: SelectItemProps) {
  const size = useContext(SelectSizeContext);
  return (
    <AriaListBoxItem
      {...props}
      className={(state) =>
        cx(
          "flex cursor-pointer items-center rounded-md text-text-primary outline-none",
          size === "sm" ? "gap-1 px-2 py-1.5 text-body-2-medium" : "gap-[5px] px-2.5 py-2 text-body-medium",
          state.isFocused && "bg-background-primary-hover",
          state.isSelected && "bg-background-secondary-default",
          state.isDisabled && "cursor-not-allowed text-text-disabled",
          typeof className === "function" ? className(state) : className,
        )
      }
    >
      {children}
    </AriaListBoxItem>
  );
}
