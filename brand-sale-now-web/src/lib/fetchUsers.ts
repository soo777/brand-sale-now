import { DbResult } from "@/types/db";
import { getPool } from "./db";

export async function fetchUsers(): Promise<DbResult> {
  try {
    const pool = getPool();
    const [rows] = await pool.query("SELECT * from users");

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
