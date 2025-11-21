import { LogoutButton } from "./components/LogoutButton";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { verifyCookie } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";

  // 로그인 페이지는 검증 건너뛰기
  if (pathname.startsWith("/admin/login")) {
    return <>{children}</>;
  }

  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("admin-session");

  // 쿠키가 없으면 로그인 페이지로 리다이렉트
  if (!sessionCookie?.value) {
    redirect("/admin/login");
  }

  // 쿠키 서명 검증
  const verified = verifyCookie(sessionCookie.value);
  if (!verified) {
    // 서명이 유효하지 않으면 로그인 페이지로 리다이렉트
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-bold">관리자 페이지</h1>
            <LogoutButton />
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
