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
import dayjs from "dayjs";
import { useQuery } from "@tanstack/react-query";
import { fetchSaleByBrandId } from "@/lib/api/sales";

type SaleDialogProps = {
  open: boolean;
  onOpenChange: (nextOpen: boolean) => void;
  brandId?: number;
};

/**
 * 세일 팝업 컴포넌트
 */
export function SaleDialog({ open, onOpenChange, brandId }: SaleDialogProps) {
  const {
    data: saleData,
    isLoading: loading,
    error: saleError,
  } = useQuery({
    queryKey: ["sale", brandId],
    queryFn: () => fetchSaleByBrandId(brandId!),
    enabled: open && !!brandId, // 다이얼로그가 열려있고 brandId가 있을 때만 실행
    staleTime: 60 * 1000, // 1분간 캐시 유지
  });

  const saleInfo = saleData?.data || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{saleInfo[0]?.brandName}</DialogTitle>
          <DialogDescription asChild>
            <div>
              {loading ? (
                <p>세일 정보를 불러오는 중...</p>
              ) : saleError ? (
                <p className="text-red-500">
                  세일 정보를 불러오는데 실패했습니다.
                </p>
              ) : saleInfo.length > 0 ? (
                <>
                  <p>{saleInfo[0]?.saleDescription}</p>
                  <p className="mt-5">
                    기간:{" "}
                    {dayjs(saleInfo[0]?.saleStartDate).format("YYYY-MM-DD")} ~{" "}
                    {dayjs(saleInfo[0]?.saleEndDate).format("YYYY-MM-DD")}
                  </p>
                </>
              ) : (
                <p>세일 정보가 없습니다.</p>
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
