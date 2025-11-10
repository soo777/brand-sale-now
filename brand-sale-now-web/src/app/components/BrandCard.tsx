"use client";
import { Brand } from "@/types/type";
import { Home } from "lucide-react";
import Image from "next/image";
import { SaleDialog } from "./SaleDialog";
import { useState } from "react";

/**
 * 브랜드 카드 컴포넌트
 * @param brand - 브랜드 정보
 */
export default function BrandCard({ brand }: { brand: Brand }) {
  const [open, setOpen] = useState(false);

  const handleAlertDialogOpen = (open: boolean) => {
    setOpen(open);
  };

  return (
    <>
      <div
        className="w-[308px] bg-white rounded-lg shadow-md p-4"
        onClick={() => handleAlertDialogOpen(true)}
      >
        <div>
          <Image
            src={brand.logoUrl}
            alt={brand.name}
            width={100}
            height={100}
          />
        </div>
        <h3 className="text-lg font-bold flex gap-2">
          {brand.name}
          {Boolean(brand.sales?.[0]?.isActive) && (
            <div className="text-sm self-center text-red-500">세일중🔥🔥</div>
          )}
        </h3>

        <p className="text-sm text-gray-600">{brand.description}</p>
        <div className="flex gap-2 mt-2">
          <a
            href={brand.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src="/svg/instagram.svg"
              alt="Instagram"
              width={24}
              height={24}
            />
          </a>
          <a
            href={brand.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(event) => event.stopPropagation()}
          >
            <Home />
          </a>
        </div>
      </div>

      <SaleDialog
        open={open}
        onOpenChange={handleAlertDialogOpen}
        brand={brand}
      />
    </>
  );
}
