import { Brand } from "@/types/type";
import { Home } from "lucide-react";
import Image from "next/image";

/**
 * 브랜드 카드 컴포넌트
 * @param brand - 브랜드 정보
 */
export default function BrandCard({ brand }: { brand: Brand }) {
  return (
    <div className="w-[308px] bg-white rounded-lg shadow-md p-4">
      <div>
        <Image src={brand.logo_url} alt={brand.name} width={100} height={100} />
      </div>
      <h3 className="text-lg font-bold">{brand.name}</h3>
      <p className="text-sm text-gray-600">{brand.description}</p>
      <div className="flex gap-2 mt-2">
        <a href={brand.instagram_url} target="_blank" rel="noopener noreferrer">
          <Image
            src="/svg/instagram.svg"
            alt="Instagram"
            width={24}
            height={24}
          />
        </a>
        <a href={brand.official_url} target="_blank" rel="noopener noreferrer">
          <Home />
        </a>
      </div>
    </div>
  );
}
