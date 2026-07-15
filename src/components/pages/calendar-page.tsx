import { useMemo, useState } from "react";
import type { CalendarDate } from "@internationalized/date";
import { getLocalTimeZone, startOfMonth } from "@internationalized/date";

import { PageBody } from "@/components/blocks/page-body";
import { CalendarHeader } from "@/components/application/calendar/calendar-header";
import { CALENDAR_SHOWCASE_MONTH } from "@/components/application/calendar/calendar-data";
import { CalendarMonthGrid } from "@/components/application/calendar/calendar-month-grid";

/**
 * CalendarPage — the BoardUI Pro "Calendar" template (Figma node
 * 3905:9119), rehosted on the house shell grammar (the Pro template's own
 * sidebar chrome is dropped — mount as a route inside `RoutedAppShell`).
 *
 * `CalendarHeader` is kept (it is functional chrome, not brand chrome):
 * month title, notification bell, inbox feed menu, the in-place month
 * switcher (prev/next + expanding month panel), and the "New event"
 * primary action. Below it, the month grid card — event chips open the
 * anchored `EventDetailsModal` popover; picking a date in the switcher
 * pulses that day in the grid.
 *
 * Fork this for scheduling, bookings, or content-calendar screens; feed
 * real events through `calendar-data.ts`'s shapes.
 */
export function CalendarPage({
  onNewEvent,
}: {
  onNewEvent?: () => void;
} = {}) {
  const [month, setMonth] = useState(CALENDAR_SHOWCASE_MONTH);
  // Transient — pulses on the picked day in the main grid, then fades out
  // on its own (see CalendarMonthGrid's onHighlightEnd).
  const [highlightedDate, setHighlightedDate] = useState<CalendarDate | null>(null);

  const monthLabel = useMemo(
    () =>
      new Intl.DateTimeFormat(undefined, { month: "long", year: "numeric" }).format(
        month.toDate(getLocalTimeZone()),
      ),
    [month],
  );

  return (
    <PageBody>
      <CalendarHeader
        month={month}
        monthLabel={monthLabel}
        showBreadcrumb={false}
        onPrevMonth={() => setMonth((m) => m.subtract({ months: 1 }))}
        onNextMonth={() => setMonth((m) => m.add({ months: 1 }))}
        onSelectDate={(date) => {
          setMonth(startOfMonth(date));
          setHighlightedDate(date);
        }}
        onNewEvent={onNewEvent}
      />
      <div className="w-full rounded-3xl bg-background-secondary-default p-3">
        <CalendarMonthGrid
          month={month}
          highlightedDate={highlightedDate}
          onHighlightEnd={() => setHighlightedDate(null)}
        />
      </div>
    </PageBody>
  );
}
