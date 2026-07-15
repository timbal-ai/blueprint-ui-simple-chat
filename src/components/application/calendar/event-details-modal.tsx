"use client";

import { useRef } from "react";
import {
  RiArrowRightLine,
  RiCornerDownLeftLine,
  RiGlobalLine,
  RiGroupLine,
  RiNotification2Line,
  RiTimeLine,
} from "@remixicon/react";
import { Dialog, Popover } from "react-aria-components";
import type { CalendarDate } from "@internationalized/date";
import { getLocalTimeZone } from "@internationalized/date";
import { Avatar } from "@/components/base/avatar/avatar";
import { Button } from "@/components/base/buttons/button";
import {
  eventDetails,
  type CalendarEvent,
} from "@/components/application/calendar/calendar-data";
import { cx } from "@/utils/cx";
import { useDismissOnOutsidePress } from "@/utils/use-dismiss-on-outside-press";

/**
 * Figma source: Board UI → "calendar_view" → "Event details modal" (node
 * 3920:10954), opened by tapping any event chip in the month grid. Anchored
 * to the clicked day cell as a `Popover` (`isNonModal`, no backdrop — only
 * the panel's own shadow, same overlay pattern as `CalendarInboxMenu`) so
 * it floats to the right of the cell instead of centering over the whole
 * page. Dismisses via outside click or Escape.
 *
 * All-day events (no `time`) render just the title/date row — Figma's
 * example is a timed event and there's no all-day variant of this design
 * to match, so meeting/time/timezone/participants/reminder are skipped
 * rather than invented.
 */

/** Inline Google Meet mark — the original template shipped a PNG
 *  (public/brand/google_meet.png) that isn't bundled here. */
function GoogleMeetMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-5 shrink-0" aria-hidden>
      <path fill="#00832d" d="M13.5 12l2.6 2.97 3.5 2.24.6-5.19-.6-5.08-3.57 1.97z" />
      <path fill="#0066da" d="M2 16.5V21a1.5 1.5 0 0 0 1.5 1.5H8l.94-3.43L8 16.5l-3.11-.94z" />
      <path fill="#e94235" d="M8 1.5L2 7.5l3.07.94L8 7.5l.92-2.96z" />
      <path fill="#2684fc" d="M2 7.5h6v9H2z" />
      <path fill="#00ac47" d="M21.6 3.67l-3.5 2.87v10.67l3.52 2.88c.53.41 1.3.04 1.3-.63V4.3c0-.68-.79-1.05-1.32-.62z" />
      <path fill="#00ac47" d="M13.5 12v4.5H8v6h9.1a1.5 1.5 0 0 0 1.5-1.5v-3.79z" />
      <path fill="#ffba00" d="M17.1 1.5H8v6h5.5V12l5.1-4.22V3a1.5 1.5 0 0 0-1.5-1.5z" />
    </svg>
  );
}

function InfoChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="shrink-0 rounded-sm bg-background-tertiary-default px-1 py-1 text-caption-1-medium text-text-secondary">
      {children}
    </span>
  );
}

/** A row inside the modal — bg-secondary rounded pill, icon + label pair on
 *  the left, optional trailing content on the right. Every non-header row
 *  in Figma shares this exact chrome. */
function DetailRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-9 w-full shrink-0 items-center gap-2.5 rounded-2lg bg-background-secondary-default py-2 pr-1.5 pl-2">
      {children}
    </div>
  );
}

export function EventDetailsModal({
  isOpen,
  event,
  date,
  triggerRef,
  onClose,
}: {
  /** Drives the popover's open/exit-animation state. Kept separate from
   *  `event`/`date` — the caller keeps those around (not nulled) while
   *  this goes false, so the panel still has content to blur/scale out
   *  instead of going blank the instant it starts closing. */
  isOpen: boolean;
  event: CalendarEvent | null;
  date: CalendarDate | null;
  /** The day cell that was clicked — the popover anchors to the right of
   *  this element. */
  triggerRef: React.RefObject<HTMLElement | null>;
  onClose: () => void;
}) {
  const details = event ? eventDetails(event) : null;
  const popoverRef = useRef<HTMLElement>(null);

  useDismissOnOutsidePress(isOpen, onClose, [triggerRef, popoverRef]);

  const dateLabel = date
    ? new Intl.DateTimeFormat(undefined, { weekday: "short", month: "short", day: "numeric" }).format(
        date.toDate(getLocalTimeZone()),
      )
    : "";

  const tzOffset = -new Date().getTimezoneOffset() / 60;
  const tzLabel = `GMT${tzOffset >= 0 ? "+" : ""}${tzOffset}`;

  return (
    <Popover
      ref={popoverRef}
      triggerRef={triggerRef}
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      placement="right top"
      offset={6}
      isNonModal
      className={cx(
        "w-[302px] max-w-[calc(100vw-32px)] rounded-[20px] border border-border-button-default bg-background-primary-default p-2.5 outline-none",
        // Raw shadow — Figma's exact spread (0/1/2 + 0/7/8) doesn't match
        // any existing shadow token (shadow-dropdown is 0/1/1 + 0/4/4). No
        // backdrop behind this popover — the shadow alone separates it from
        // the page, per Figma.
        "shadow-[0px_1px_2px_0px_rgba(0,0,0,0.04),0px_7px_8px_0px_rgba(0,0,0,0.04)]",
        "transition duration-150 ease-out",
        "data-[entering]:scale-90 data-[entering]:opacity-0 data-[entering]:blur-[4px]",
        "data-[exiting]:scale-90 data-[exiting]:opacity-0 data-[exiting]:blur-[4px]",
      )}
    >
      <Dialog aria-label="Event details" className="flex w-full flex-col gap-2.5 outline-none">
        {event && details && (
          <>
            {/* Title + date */}
            <div className="flex w-full flex-col gap-px rounded-2lg bg-background-secondary-default px-2.5 py-2">
              <p className="text-headline-medium whitespace-nowrap text-text-primary">{event.title}</p>
              <p className="text-body-medium text-text-secondary">{dateLabel}</p>
            </div>

            {event.image && (
              <div className="relative h-[99px] w-full shrink-0 overflow-hidden rounded-[10px]">
                <img src={event.image} alt="" className="absolute inset-0 size-full object-cover" />
              </div>
            )}

            {event.time && (
              <>
                {/* Google Meet */}
                <DetailRow>
                  <div className="flex min-w-0 flex-1 items-center gap-1.5">
                    <GoogleMeetMark />
                    <span className="text-body-2-medium whitespace-nowrap text-text-primary">Google Meet</span>
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5">
                    <InfoChip>{details.meetingCode}</InfoChip>
                    <Button variant="primary" size="xs">
                      Join
                    </Button>
                  </div>
                </DetailRow>

                {/* Time range + duration */}
                <DetailRow>
                  <div className="flex min-w-0 flex-1 items-center gap-1.5">
                    <RiTimeLine className="size-[18px] shrink-0 text-foreground-icon-primary" aria-hidden />
                    <span className="flex items-center gap-1.5 text-body-2-medium whitespace-nowrap text-text-primary">
                      {event.time}
                      <RiArrowRightLine className="size-5 shrink-0 text-foreground-icon-primary" aria-hidden />
                      {details.endTime}
                    </span>
                  </div>
                  <InfoChip>{durationLabel(event.time, details.endTime ?? event.time)}</InfoChip>
                </DetailRow>

                {/* Timezone */}
                <DetailRow>
                  <div className="flex min-w-0 flex-1 items-center gap-1.5">
                    <RiGlobalLine className="size-[18px] shrink-0 text-foreground-icon-primary" aria-hidden />
                    <span className="flex items-center gap-1 text-body-2-medium whitespace-nowrap">
                      <span className="text-text-secondary">{tzLabel}</span>
                      <span className="text-text-primary">Amsterdam</span>
                    </span>
                  </div>
                  <Button
                    variant="secondary"
                    size="xs"
                    iconOnly
                    leadingIcon={RiCornerDownLeftLine}
                    aria-label="Edit timezone"
                  />
                </DetailRow>

                {/* Participants */}
                <div className="flex w-full flex-col gap-0.5 rounded-2lg bg-background-secondary-default py-2 pr-1.5 pl-2">
                  <div className="flex w-full items-center gap-2.5">
                    <div className="flex min-w-0 flex-1 items-center gap-1.5">
                      <RiGlobalLine className="size-[18px] shrink-0 text-foreground-icon-primary" aria-hidden />
                      <span className="text-body-2-medium whitespace-nowrap text-text-secondary">
                        Participants
                      </span>
                    </div>
                    <Button
                      variant="secondary"
                      size="xs"
                      iconOnly
                      leadingIcon={RiGroupLine}
                      aria-label="Edit participants"
                    />
                  </div>
                  <div className="flex w-full flex-col">
                    {details.participants.map((participant) => (
                      <div key={participant.email} className="flex w-full items-center gap-2 rounded-2lg py-1.5">
                        <Avatar size="xs" color={participant.color} initials={participant.initials} />
                        <span className="truncate text-body-2-medium text-text-primary">{participant.email}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reminders */}
                <DetailRow>
                  <div className="flex min-w-0 flex-1 items-center gap-1.5">
                    <RiNotification2Line className="size-[18px] shrink-0 text-foreground-icon-primary" aria-hidden />
                    <span className="flex items-center gap-1 text-body-2-medium whitespace-nowrap">
                      <span className="text-text-secondary">Reminders</span>
                      <span className="text-text-primary">{details.reminder}</span>
                    </span>
                  </div>
                  <Button
                    variant="secondary"
                    size="xs"
                    iconOnly
                    leadingIcon={RiCornerDownLeftLine}
                    aria-label="Edit reminders"
                  />
                </DetailRow>
              </>
            )}
          </>
        )}
      </Dialog>
    </Popover>
  );
}

function durationLabel(start: string, end: string) {
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  let minutes = eh * 60 + em - (sh * 60 + sm);
  if (minutes < 0) minutes += 24 * 60;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  return m > 0 ? `${h}h${m}m` : `${h}h`;
}
