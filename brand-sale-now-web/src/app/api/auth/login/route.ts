import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { cookies } from "next/headers";
import { signCookie, generateSessionToken } from "@/lib/auth";

/**
 * 로그인
 */
export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: "사용자명과 비밀번호를 입력해주세요." },
        { status: 400 }
      );
    }

    const pool = getPool();
    // users 테이블에서 관리자 계정 확인 (예시)
    const [rows] = await pool.query(
      "SELECT * FROM users WHERE username = ? AND password = ? AND role = ?",
      [username, password, "admin"] // 실제로는 비밀번호 해싱 필요
    );

    const users = Array.isArray(rows) ? rows : [];

    if (users.length === 0) {
      return NextResponse.json(
        { success: false, error: "잘못된 아이디 또는 비밀번호입니다." },
        { status: 401 }
      );
    }

    // 랜덤한 세션 토큰 생성 및 서명 추가
    const sessionToken = generateSessionToken();
    const signedToken = signCookie(sessionToken);

    // 세션 쿠키 설정 (서명된 토큰 저장)
    const cookieStore = await cookies();
    cookieStore.set("admin-session", signedToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7일
      path: "/",
    });

    return NextResponse.json({
      success: true,
      message: "로그인 성공",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "로그인 중 오류가 발생했습니다.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
