import { getPool } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const pool = getPool();

  try {
    const [rows] = await pool.query(`
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
    `);

    return NextResponse.json({
      ok: true,
      data: rows,
    });
  } catch (err) {
    console.error("GET /api/sales error", err);
    return NextResponse.json(
      { ok: false, error: "SERVER_ERROR" },
      { status: 500 }
    );
  }
}
