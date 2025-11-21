/**
 * 모든 세일 정보 조회
 */
export async function fetchSales() {
  const response = await fetch("/api/sales");
  if (!response.ok) {
    throw new Error("세일 정보를 불러오는데 실패했습니다.");
  }
  return response.json();
}

/**
 * 특정 브랜드의 세일 상세 정보 조회
 */
export async function fetchSaleByBrandId(brandId: number) {
  const response = await fetch(`/api/sales/${brandId}`);
  if (!response.ok) {
    throw new Error("세일 상세 정보를 불러오는데 실패했습니다.");
  }
  return response.json();
}
