import { fetchBrands } from "@/lib/fetchBrands";
import { DbResult } from "@/types/db";
import { Brand } from "@/types/type";
import { HomeComponent } from "./components/HomeComponent";

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

  const brands =
    result.success && Array.isArray(result.data)
      ? (result.data as Brand[])
      : [];

  const error = result.success
    ? undefined
    : {
        message: result.error ?? "데이터 조회에 실패했습니다.",
        details: result.details,
      };

  return <HomeComponent brands={brands} error={error} />;
}
