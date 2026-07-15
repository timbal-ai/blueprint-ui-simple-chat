import * as React from "react";
import { CalendarDate } from "@internationalized/date";

import { DatePicker } from "@/components/base/date-picker/date-picker";
import { DateRangePicker } from "@/components/base/date-picker/date-range-picker";
import type { DateRangeValue } from "@/components/base/date-picker/date-range-picker";

import { Calendar } from "@/components/ui/calendar";

import { DemoCard, DemoGrid, GalleryPage } from "./section";

export default function GalleryPickers() {
  const [date, setDate] = React.useState<Date | undefined>(new Date(2026, 6, 8));
  const [pickerDate, setPickerDate] = React.useState<CalendarDate | null>(
    new CalendarDate(2026, 7, 8),
  );
  const [range, setRange] = React.useState<DateRangeValue | null>({
    start: new CalendarDate(2026, 7, 1),
    end: new CalendarDate(2026, 7, 14),
  });

  return (
    <GalleryPage
      title="Date & time"
      description="BoardUI single-date and range pickers, plus the retained inline calendar."
    >
      <DemoGrid>
        <DemoCard title="Calendar" contentClassName="justify-center">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-lg border border-border"
          />
        </DemoCard>

        <DemoCard title="Date picker">
          <DatePicker
            aria-label="Invoice date"
            value={pickerDate}
            onChange={setPickerDate}
          />
        </DemoCard>

        <DemoCard title="Date range picker">
          <DateRangePicker
            aria-label="Billing period"
            value={range}
            onChange={setRange}
          />
        </DemoCard>
      </DemoGrid>
    </GalleryPage>
  );
}
