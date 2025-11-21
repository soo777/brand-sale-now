import { NextResponse } from "next/server";
import { cookies } from "next/headers";

/**
 * 로그아웃
 */
export async function POST() {
  const cookieStore = await cookies();

  // 쿠키를 명시적으로 삭제하기 위해 빈 값과 만료 날짜 설정
  cookieStore.set("admin-session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0, // 즉시 만료
    path: "/",
  });

  return NextResponse.json({
    success: true,
    message: "로그아웃되었습니다.",
  });
}
