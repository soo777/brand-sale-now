"use client";

import { Sale } from "@/types/type";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { SaleDialog } from "./SaleDialog";
import { useState } from "react";

/**
 * 세일 달력
 */
export default function SaleCalendar({ sales }: { sales: Sale[] }) {
  const [open, setOpen] = useState(false);
  const [selectedBrandId, setSelectedBrandId] = useState<number | undefined>();

  const events = sales.map((sale: Sale) => ({
    brandId: sale.brandId,
    title: sale.brandName,
    start: sale.saleStartDate,
    // end: sale.saleEndDate,
    description: sale.saleDescription,
  }));

  const handleAlertDialogOpen = (open: boolean) => {
    setOpen(open);
  };

  return (
    <>
      <FullCalendar
        key={sales.length}
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        eventClick={(info) => {
          const brandId = (info.event.extendedProps as { brandId?: number })
            .brandId;
          if (brandId) {
            setSelectedBrandId(brandId);
            setOpen(true);
          }
        }}
        events={events}
      />

      <SaleDialog
        open={open}
        onOpenChange={handleAlertDialogOpen}
        brandId={selectedBrandId}
      />
    </>
  );
}
