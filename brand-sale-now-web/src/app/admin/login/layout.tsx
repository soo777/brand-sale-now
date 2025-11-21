// 로그인 페이지는 상위 layout의 인증 체크를 건너뛰기 위한 별도 layout
export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
