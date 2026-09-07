"use client";

import { useContext, type ReactNode } from "react";
import { Heading, OverlayTriggerStateContext } from "react-aria-components";
import { CloseButton } from "@/components/base/buttons/close-button";
import { cx } from "@/utils/cx";

/**
 * Header / body / footer slots shared by `Modal` and `Sheet`.
 *
 * Padding follows BoardUI's settings modal (title row pinned, page scrolls
 * underneath, 24px inset). The header's title is a React Aria `Heading
 * slot="title"`, which the surrounding `Dialog` picks up as its accessible
 * name; the close control reads the overlay state from context, so the same
 * header works inside a Modal, a Sheet or a Popover without wiring.
 */

export interface OverlayHeaderProps {
  title?: ReactNode;
  description?: ReactNode;
  /** Accessible name of the close control. */
  closeLabel?: string;
  /** Drop the close control (e.g. a confirm dialog that must be answered). */
  hideClose?: boolean;
  className?: string;
  /** Extra content under the title/description (tabs, a search field…). */
  children?: ReactNode;
}

export function OverlayHeader({
  title,
  description,
  closeLabel = "Close",
  hideClose = false,
  className,
  children,
}: OverlayHeaderProps) {
  const state = useContext(OverlayTriggerStateContext);
  return (
    <div className={cx("flex shrink-0 items-start justify-between gap-4 px-6 pt-6 pb-2", className)}>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        {title !== undefined && title !== null ? (
          <Heading slot="title" className="text-title-3-medium text-text-primary">
            {title}
          </Heading>
        ) : null}
        {description !== undefined && description !== null ? (
          <p className="text-body-regular text-text-secondary">{description}</p>
        ) : null}
        {children}
      </div>
      {!hideClose && state ? (
        <CloseButton
          size="sm"
          aria-label={closeLabel}
          onClick={() => state.close()}
          className="-mt-0.5 -mr-1 shrink-0"
        />
      ) : null}
    </div>
  );
}

export interface OverlayBodyProps {
  className?: string;
  children?: ReactNode;
}

/** The scrolling region: `min-h-0 flex-1` so the header/footer stay pinned. */
export function OverlayBody({ className, children }: OverlayBodyProps) {
  return (
    <div className={cx("min-h-0 flex-1 overflow-y-auto px-6 py-4 text-body-regular text-text-primary", className)}>
      {children}
    </div>
  );
}

export interface OverlayFooterProps {
  className?: string;
  children?: ReactNode;
}

/** Right-aligned action row (Cancel / Confirm). */
export function OverlayFooter({ className, children }: OverlayFooterProps) {
  return (
    <div className={cx("flex shrink-0 flex-wrap items-center justify-end gap-2.5 px-6 pt-2 pb-6", className)}>
      {children}
    </div>
  );
}
