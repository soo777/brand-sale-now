import { Sale } from "@/types/type";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

export default function SaleCalendar({ sales }: { sales: Sale[] }) {
  return (
    <FullCalendar
      plugins={[dayGridPlugin]}
      initialView="dayGridMonth"
      eventClick={(info) => {
        console.log(info);
      }}
      events={[
        {
          title: "event1",
          start: "2025-11-01",
          description: "event1 description",
        },
        {
          title: "event2",
          start: "2025-11-05",
          end: "2025-11-07",
          description: "event2 description",
        },
      ]}
    />
  );
}
