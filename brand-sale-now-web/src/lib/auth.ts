import crypto from "crypto";

// 환경변수에서 시크릿 키 가져오기 (없으면 기본값 사용, 프로덕션에서는 반드시 설정 필요)
const SECRET_KEY =
  process.env.AUTH_SECRET_KEY || "your-secret-key-change-in-production";

/**
 * 쿠키 값에 서명을 추가하여 생성 (Node.js Runtime용)
 */
export function signCookie(value: string): string {
  const signature = crypto
    .createHmac("sha256", SECRET_KEY)
    .update(value)
    .digest("hex");
  return `${value}.${signature}`;
}

/**
 * 쿠키 값의 서명을 검증 (Node.js Runtime용)
 */
export function verifyCookie(signedValue: string): string | null {
  const parts = signedValue.split(".");
  if (parts.length !== 2) {
    return null;
  }

  const [value, signature] = parts;
  const expectedSignature = crypto
    .createHmac("sha256", SECRET_KEY)
    .update(value)
    .digest("hex");

  // 타임링 어택 방지를 위해 crypto.timingSafeEqual 사용
  if (signature.length !== expectedSignature.length) {
    return null;
  }

  const isValid = crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );

  return isValid ? value : null;
}

/**
 * 랜덤 세션 토큰 생성 (Node.js Runtime용)
 */
export function generateSessionToken(): string {
  return crypto.randomBytes(32).toString("hex");
}
