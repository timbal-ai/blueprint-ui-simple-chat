"use client";

import { useRef, useState } from "react";
import type { CalendarDate } from "@internationalized/date";
import { isSameDay, isSameMonth } from "@internationalized/date";
import { motion } from "motion/react";
import {
  WEEKDAY_LABELS,
  eventsForDate,
  monthGrid,
  type CalendarEvent,
  type CalendarEventColor,
} from "@/components/application/calendar/calendar-data";
import { EventDetailsModal } from "@/components/application/calendar/event-details-modal";
import { cx } from "@/utils/cx";

/**
 * Figma source: Board UI → "calendar_view" → Calendar component (node
 * 3905:9229). Weekday header row (7 grey rounded-xl pills) + a Sun-start
 * month grid of day cells, each up to 115.33px tall in Figma (148.57px
 * wide) — reproduced here as a fluid `grid-cols-7` so it fills any card
 * width instead of Figma's fixed 1112px canvas.
 *
 * Overflow rule (reverse-engineered from the one Figma cell that shows it,
 * Aug 20 — 5 events, only the last 2 rendered plus a "+3 more" label): more
 * than 3 events in a cell shows the last 2, bottom-anchored, with a "+N
 * more" label filling the remaining top space instead of a 3rd chip.
 */

const MAX_VISIBLE_EVENTS = 3;
// Aug 20 has 7 events; showing the last 4 keeps the hidden count at exactly
// 3 ("+3 more"), matching the one Figma cell that shows this overflow state.
const OVERFLOW_VISIBLE_EVENTS = 4;

const CHIP_STYLES: Record<CalendarEventColor, { bg: string; title: string; time: string }> = {
  blue: { bg: "bg-blue-100", title: "text-blue-700", time: "text-blue-700" },
  pink: { bg: "bg-pink-100", title: "text-pink-700", time: "text-pink-700" },
  purple: { bg: "bg-purple-100", title: "text-purple-700", time: "text-purple-700" },
  lime: { bg: "bg-lime-100", title: "text-lime-800", time: "text-lime-700" },
  emerald: { bg: "bg-emerald-100", title: "text-emerald-800", time: "text-emerald-700" },
};

function EventChip({ event, onSelect }: { event: CalendarEvent; onSelect: () => void }) {
  const c = CHIP_STYLES[event.color];
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cx(
        "flex min-w-0 cursor-pointer items-center justify-between gap-1 rounded-md px-1.5 py-0.5 outline-none",
        "transition-[filter] duration-150 ease hover:brightness-95 focus-visible:ring-2 focus-visible:ring-border-focus-ring",
        c.bg,
      )}
    >
      <span className={cx("truncate text-body-2-medium", c.title)}>{event.title}</span>
      {event.time && (
        <span className={cx("shrink-0 text-caption-1-medium opacity-70", c.time)}>{event.time}</span>
      )}
    </button>
  );
}

function DayCell({
  date,
  isCurrentMonth,
  isHighlighted,
  onHighlightEnd,
  onSelectEvent,
}: {
  date: CalendarDate;
  isCurrentMonth: boolean;
  isHighlighted: boolean;
  onHighlightEnd: () => void;
  onSelectEvent: (event: CalendarEvent, cardRef: React.RefObject<HTMLDivElement | null>) => void;
}) {
  const events = eventsForDate(date);
  const overflow = events.length > MAX_VISIBLE_EVENTS;
  const visible = overflow ? events.slice(-OVERFLOW_VISIBLE_EVENTS) : events;
  const hiddenCount = events.length - visible.length;
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative h-full">
      {/* Sibling of the card, not a child, so it's never clipped by the
          card's own overflow-hidden (needed for its rounded corners + event
          chips). */}
      {isHighlighted && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-20 rounded-xl ring-2 ring-inset ring-blue-500"
          initial={{ opacity: 0, scale: 1 }}
          animate={{ opacity: [0, 1, 0.35, 1, 0.35, 1, 0], scale: [1, 1.015, 1, 1.015, 1, 1, 1] }}
          transition={{ duration: 3, times: [0, 0.08, 0.28, 0.4, 0.6, 0.72, 1], ease: "easeInOut" }}
          onAnimationComplete={onHighlightEnd}
        />
      )}
      <div
        ref={cardRef}
        className={cx(
          "relative flex h-full min-h-[82px] flex-col overflow-hidden rounded-xl sm:min-h-[94px] lg:min-h-[105px] xl:min-h-[128px] 2xl:min-h-[164px]",
          isCurrentMonth ? "bg-background-primary-default shadow-card" : "bg-background-tertiary-default",
        )}
      >
        <span
          className={cx(
            "pt-2 pl-2.5 text-body-2-medium",
            isCurrentMonth ? "text-text-primary" : "text-text-secondary",
          )}
        >
          {date.day}
        </span>
        {events.length > 0 && (
          <div className="mt-auto flex flex-col gap-[5px] px-2 pb-2">
            {hiddenCount > 0 && (
              <span className="text-body-2-medium text-text-secondary">+{hiddenCount} more</span>
            )}
            {visible.map((event) => (
              <EventChip key={event.id} event={event} onSelect={() => onSelectEvent(event, cardRef)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function CalendarMonthGrid({
  month,
  highlightedDate = null,
  onHighlightEnd,
}: {
  month: CalendarDate;
  /** Pulses this day's ring for ~3s then fades it out (not a persistent
   *  selection state — see `DayCell`). */
  highlightedDate?: CalendarDate | null;
  onHighlightEnd?: () => void;
}) {
  const days = monthGrid(month);
  // `selected` is kept (not nulled) on close so the popover's content and
  // anchor stay put while it plays its exit animation — only `isOpen`
  // toggles react-aria's `data-exiting` transition; clearing `selected`
  // immediately would blank the content and skip straight to unmounted.
  const [selected, setSelected] = useState<{
    event: CalendarEvent;
    date: CalendarDate;
    triggerRef: React.RefObject<HTMLDivElement | null>;
  } | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const fallbackTriggerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="grid grid-cols-7 gap-2">
        {WEEKDAY_LABELS.map((label) => (
          <div
            key={label}
            className="flex items-center justify-center rounded-xl bg-background-tertiary-default px-2.5 py-[5px] text-center text-body-2-regular text-text-secondary"
          >
            {label}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 grid-rows-[repeat(auto-fill,minmax(0,1fr))] gap-2">
        {days.map((date) => (
          <DayCell
            key={date.toString()}
            date={date}
            isCurrentMonth={isSameMonth(date, month)}
            isHighlighted={highlightedDate !== null && isSameDay(date, highlightedDate)}
            onHighlightEnd={() => onHighlightEnd?.()}
            onSelectEvent={(event, triggerRef) => {
              setSelected({ event, date, triggerRef });
              setIsOpen(true);
            }}
          />
        ))}
      </div>
      <EventDetailsModal
        isOpen={isOpen}
        event={selected?.event ?? null}
        date={selected?.date ?? null}
        triggerRef={selected?.triggerRef ?? fallbackTriggerRef}
        onClose={() => setIsOpen(false)}
      />
    </div>
  );
}
