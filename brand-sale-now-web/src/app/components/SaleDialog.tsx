import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Brand } from "@/types/type";

type SaleDialogProps = {
  open: boolean;
  onOpenChange: (nextOpen: boolean) => void;
  brand: Brand;
};

export function SaleDialog({ open, onOpenChange, brand }: SaleDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{brand.name}</DialogTitle>
          <DialogDescription asChild>
            <div>
              <p>
                {Boolean(brand.sales?.[0]?.isActive)
                  ? brand.sales?.[0]?.saleDescription
                  : "세일 정보가 없습니다."}
              </p>
              {Boolean(brand.sales?.[0]?.isActive) && (
                <p className="mt-5">
                  기간: {brand.sales?.[0]?.saleStartDate} ~{" "}
                  {brand.sales?.[0]?.saleEndDate}
                </p>
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
