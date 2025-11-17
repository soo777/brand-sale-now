"use client";
import { Sale } from "@/types/type";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

export default function SaleCalendar({ sales }: { sales: Sale[] }) {
  const events = sales.map((sale: Sale) => ({
    brandId: sale.brandId,
    title: sale.brandName,
    start: sale.saleStartDate,
    // end: sale.saleEndDate,
    description: sale.saleDescription,
  }));

  return (
    <FullCalendar
      key={sales.length}
      plugins={[dayGridPlugin]}
      initialView="dayGridMonth"
      eventClick={(info) => {
        console.log(info);
      }}
      events={events}
    />
  );
}
