import { DbResult } from "@/types/db";
import { getPool } from "./db";

export async function fetchBrands(): Promise<DbResult> {
  try {
    const pool = getPool();
    // const [rows] = await pool.query("SELECT * from brands order by name asc");
    const [rows] = await pool.query(`
      SELECT
        b.name AS name,
        b.official_url AS officialUrl,
        b.logo_url AS logoUrl,
        b.instagram_url as instagramUrl,
        b.description,
        COALESCE(
          JSON_ARRAYAGG(
            JSON_OBJECT(
              'saleId', s.id,
              'saleType', s.sale_type,
              'saleDescription', s.sale_description,
              'saleStartDate', s.sale_start_date,
              'saleEndDate', s.sale_end_date,
              'isActive', s.is_active
            )
          ), JSON_ARRAY()
        ) AS sales
      FROM brands AS b
      LEFT JOIN sales AS s
        ON b.id = s.brand_id
      GROUP BY b.id, b.name, b.country, b.official_url, b.logo_url
      ORDER BY b.name ASC;
      `);

    return {
      success: true,
      data: Array.isArray(rows) ? (rows as Record<string, unknown>[]) : [],
      message: "DB 연결 및 쿼리 성공",
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    return {
      success: false,
      error: "데이터 조회 중 오류가 발생했습니다.",
      details: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
