import { fetchBrands } from "@/lib/fetchBrands";
import { DbResult } from "@/types/db";
import { Brand } from "@/types/type";
import BrandCard from "./components/BrandCard";

export default async function Home() {
  let result: DbResult;

  try {
    // 서버 컴포넌트에서는 직접 함수 호출 (API 라우트와 동일한 로직)
    result = await fetchBrands();
    console.log(result);
  } catch (error) {
    result = {
      success: false,
      error: "데이터 조회 중 오류가 발생했습니다.",
      details: error instanceof Error ? error.message : "Unknown error",
    };
  }

  return (
    <div className="flex min-h-screen">
      <div className="w-full flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          {!result.success && (
            <div className="mt-4">
              <p className="text-red-600 font-semibold">에러:</p>
              <p className="text-sm text-red-700">{result.error}</p>
              {result.details && (
                <p className="text-xs text-red-600 mt-1">{result.details}</p>
              )}
            </div>
          )}

          {/* 브랜드 리스트(카드) */}
          {result.success && result.data && (
            <div>
              {(result.data as Brand[]).map((brand) => (
                <BrandCard key={brand.id} brand={brand as Brand} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
