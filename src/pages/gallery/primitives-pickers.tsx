import * as React from "react";

import { Calendar } from "@/components/ui/calendar";
import {
  DatePicker,
  DatePickerButton,
  DatePickerCalendar,
  DatePickerContent,
  DatePickerTrigger,
} from "@/components/ui/date-picker";

import { DemoCard, DemoGrid, GalleryPage } from "./section";

export default function GalleryPickers() {
  const [date, setDate] = React.useState<Date | undefined>(new Date(2026, 6, 8));
  const [pickerDate, setPickerDate] = React.useState<Date | undefined>();
  const [open, setOpen] = React.useState(false);

  return (
    <GalleryPage
      title="Date & time"
      description="Calendar and date picker on react-day-picker."
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
          <DatePicker open={open} onOpenChange={setOpen}>
            <DatePickerTrigger asChild>
              <DatePickerButton date={pickerDate} className="w-56" />
            </DatePickerTrigger>
            <DatePickerContent>
              <DatePickerCalendar
                mode="single"
                selected={pickerDate}
                onSelect={(d: Date | undefined) => {
                  setPickerDate(d);
                  setOpen(false);
                }}
              />
            </DatePickerContent>
          </DatePicker>
        </DemoCard>
      </DemoGrid>
    </GalleryPage>
  );
}
