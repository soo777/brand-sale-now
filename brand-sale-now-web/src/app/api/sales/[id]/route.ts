import { getPool } from "@/lib/db";
import { NextResponse } from "next/server";

/**
 * 세일 상세 정보 조회
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  const resolvedParams = await Promise.resolve(params);
  const brandId = resolvedParams.id;
  console.log("brandId", brandId);
  const pool = getPool();

  try {
    const query = `
     SELECT 
            s.id AS saleId,
            s.brand_id AS brandId,
            b.name AS brandName,
            s.sale_type AS saleType,
            s.sale_description AS saleDescription,
            s.sale_start_date AS saleStartDate,
            s.sale_end_date AS saleEndDate,
            s.is_active AS isActive
        FROM sales AS s
        LEFT JOIN brands AS b ON s.brand_id = b.id
        WHERE s.brand_id = ?
    `;

    const [rows] = await pool.execute(query, [Number(brandId)]);

    return NextResponse.json({
      ok: true,
      data: rows,
    });
  } catch (err) {
    console.error("GET /api/sales/[id] error", err);
    return NextResponse.json(
      { ok: false, error: "SERVER_ERROR" },
      { status: 500 }
    );
  }
}
