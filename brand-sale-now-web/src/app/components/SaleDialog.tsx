"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Sale } from "@/types/type";
import dayjs from "dayjs";
import { useEffect, useState, useRef } from "react";

type SaleDialogProps = {
  open: boolean;
  onOpenChange: (nextOpen: boolean) => void;
  brandId?: number;
};

/**
 * 세일 팝업 컴포넌트
 */
export function SaleDialog({ open, onOpenChange, brandId }: SaleDialogProps) {
  const [saleInfo, setSaleInfo] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(false);
  const prevOpenRef = useRef(false);

  useEffect(() => {
    // open이 false에서 true로 변경될 때만 API 호출 (다이얼로그가 열릴 때마다)
    if (open && !prevOpenRef.current && brandId) {
      setLoading(true);
      const fetchSaleInfo = async () => {
        try {
          const response = await fetch(`/api/sales/${brandId}`);
          const data = await response.json();
          if (data.ok && data.data) {
            setSaleInfo(data.data);
          }
        } catch (error) {
          console.error("Error fetching sale info:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchSaleInfo();
    }
    prevOpenRef.current = open;
  }, [open, brandId]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{saleInfo[0]?.brandName}</DialogTitle>
          <DialogDescription asChild>
            <div>
              {loading ? (
                <p>세일 정보를 불러오는 중...</p>
              ) : (
                <>
                  <p>{saleInfo[0]?.saleDescription}</p>
                  <p className="mt-5">
                    기간:{" "}
                    {dayjs(saleInfo[0]?.saleStartDate).format("YYYY-MM-DD")} ~{" "}
                    {dayjs(saleInfo[0]?.saleEndDate).format("YYYY-MM-DD")}
                  </p>
                </>
              )}
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose className="bg-black text-white px-4 py-2 rounded-md">
            확인
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
