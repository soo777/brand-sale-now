// src/app/components/HomeContent.tsx
"use client";

import { useState } from "react";
import BrandCard from "./BrandCard";
import { Brand } from "@/types/type";
import SaleCalendar from "./SaleCalendar";

type HomeComponentProps = {
  brands: Brand[];
  error?: {
    message: string;
    details?: string;
  };
};

export function HomeComponent({ brands, error }: HomeComponentProps) {
  const [view, setView] = useState<"brands" | "calendar">("brands");

  return (
    <div className="flex min-h-screen bg-[#f5f5f5]">
      <div className="w-full flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          {error && (
            <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-4">
              <p className="text-sm font-semibold text-red-700">
                {error.message}
              </p>
              {error.details && (
                <p className="mt-1 text-xs text-red-600">{error.details}</p>
              )}
            </div>
          )}

          <div className="flex justify-center items-center gap-4 mb-4">
            <button
              type="button"
              onClick={() => setView("brands")}
              className={`rounded-md px-4 py-2 text-sm font-semibold transition-colors ${
                view === "brands"
                  ? "bg-black text-white"
                  : "bg-white text-black hover:bg-gray-100"
              }`}
            >
              Brands
            </button>
            <button
              type="button"
              onClick={() => setView("calendar")}
              className={`rounded-md px-4 py-2 text-sm font-semibold transition-colors ${
                view === "calendar"
                  ? "bg-black text-white"
                  : "bg-white text-black hover:bg-gray-100"
              }`}
            >
              Calendar
            </button>
          </div>

          {view === "brands" ? (
            brands.length > 0 ? (
              <div className="mx-auto flex max-w-[1080px] flex-wrap justify-center gap-4">
                {brands.map((brand) => (
                  <BrandCard key={`${brand.id ?? brand.name}`} brand={brand} />
                ))}
              </div>
            ) : (
              <p className="text-center text-sm text-gray-500">
                표시할 브랜드가 없습니다.
              </p>
            )
          ) : (
            <div className="rounded-md border border-dashed border-gray-300 bg-white p-12 text-center text-sm text-gray-500">
              <SaleCalendar sales={[]} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
