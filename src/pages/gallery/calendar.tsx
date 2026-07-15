import { toast } from "sonner";

import { CalendarPage } from "@/components/pages/calendar-page";

export default function GalleryCalendar() {
  return <CalendarPage onNewEvent={() => toast("New event")} />;
}
