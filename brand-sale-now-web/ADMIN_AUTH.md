# 관리자 인증 시스템 정리

## 📋 전체 구조

Next.js만으로 구현한 관리자 인증 시스템입니다. 쿠키 기반 세션 관리와 HMAC 서명을 사용하여 보안을 강화했습니다.

---

## 🔐 1. 쿠키 관리

### 쿠키 설정 (`/api/auth/login`)

```typescript
cookieStore.set("admin-session", signedToken, {
  httpOnly: true, // JavaScript 접근 불가 (XSS 방지)
  secure: process.env.NODE_ENV === "production", // HTTPS에서만 전송
  sameSite: "lax", // CSRF 방지
  maxAge: 60 * 60 * 24 * 7, // 7일 유효
  path: "/", // 전체 경로에서 접근 가능
});
```

**특징:**

- `httpOnly: true` → 브라우저의 JavaScript로 접근 불가 (XSS 공격 방지)
- `secure: true` (프로덕션) → HTTPS에서만 전송
- `sameSite: "lax"` → CSRF 공격 방지
- 쿠키 값은 서명된 토큰 (`value.signature` 형식)

### 쿠키 삭제 (`/api/auth/logout`)

```typescript
cookieStore.set("admin-session", "", {
  maxAge: 0, // 즉시 만료
  // ... 나머지 옵션 동일
});
```

---

## 🔒 2. Crypto를 사용한 쿠키 서명 (`src/lib/auth.ts`)

### 목적

쿠키 값이 임의로 수정되는 것을 방지합니다. 브라우저 개발자 도구에서 쿠키를 수정해도 서명 검증에 실패하여 인증이 되지 않습니다.

### 작동 방식

#### 1. 서명 생성 (`signCookie`)

```typescript
const signature = crypto
  .createHmac("sha256", SECRET_KEY) // HMAC-SHA256 알고리즘
  .update(value) // 토큰 값
  .digest("hex"); // 16진수 문자열로 변환

return `${value}.${signature}`; // "토큰.서명" 형식
```

**예시:**

- 토큰: `abc123...`
- 서명: `def456...`
- 최종 쿠키 값: `abc123....def456...`

#### 2. 서명 검증 (`verifyCookie`)

```typescript
// 1. 쿠키 값을 분리
const [value, signature] = signedValue.split(".");

// 2. 동일한 방식으로 서명 재생성
const expectedSignature = crypto
  .createHmac("sha256", SECRET_KEY)
  .update(value)
  .digest("hex");

// 3. 타이밍 어택 방지를 위해 timingSafeEqual 사용
const isValid = crypto.timingSafeEqual(
  Buffer.from(signature),
  Buffer.from(expectedSignature)
);
```

**보안 특징:**

- `crypto.timingSafeEqual()` → 타이밍 어택 방지 (서명 비교 시간이 일정)
- `SECRET_KEY`는 환경변수로 관리 (`.env.local`에 `AUTH_SECRET_KEY` 설정)

#### 3. 세션 토큰 생성 (`generateSessionToken`)

```typescript
return crypto.randomBytes(32).toString("hex");
```

- 32바이트 랜덤 값 → 64자리 16진수 문자열
- 예측 불가능한 토큰 생성

---

## 🛡️ 3. 미들웨어 (`src/middleware.ts`)

### 역할

모든 `/admin` 경로 요청을 가로채서 인증 상태를 확인합니다.

### 실행 위치

- **Edge Runtime**에서 실행 (빠른 응답)
- 프로젝트 루트의 `src/middleware.ts` (또는 `middleware.ts`)

### 주요 로직

```typescript
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    const sessionCookie = request.cookies.get("admin-session");
    const isLoggedIn = !!sessionCookie?.value;
    const isLoginPage = pathname.startsWith("/admin/login");

    // 1. 로그인 페이지가 아닌데 세션이 없으면 → 로그인 페이지로 리다이렉트
    if (!isLoginPage && !isLoggedIn) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    // 2. 이미 로그인된 상태에서 로그인 페이지 접근 → 대시보드로 리다이렉트
    if (isLoginPage && isLoggedIn) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    // 3. 잘못된 형식의 쿠키 삭제 (서명 형식이 아닌 경우)
    if (isLoggedIn && !sessionCookie.value.includes(".")) {
      const response = NextResponse.next();
      response.cookies.delete("admin-session");
      return response;
    }

    // 4. 경로 정보를 헤더에 추가 (layout에서 사용)
    const response = NextResponse.next();
    response.headers.set("x-pathname", pathname);
    return response;
  }
}
```

### Matcher 설정

```typescript
export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
```

- `/admin`과 `/admin/*` 경로에만 미들웨어 실행

---

## 🔍 4. 서버 컴포넌트 검증 (`src/app/admin/layout.tsx`)

### 역할

미들웨어는 쿠키 존재 여부만 확인하고, 실제 서명 검증은 서버 컴포넌트에서 수행합니다.

### 이유

- 미들웨어는 **Edge Runtime**에서 실행 → Node.js `crypto` 모듈 사용 불가
- 서버 컴포넌트는 **Node.js Runtime**에서 실행 → `crypto` 모듈 사용 가능

### 주요 로직

```typescript
export default async function AdminLayout({ children }) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";

  // 로그인 페이지는 검증 건너뛰기 (무한 루프 방지)
  if (pathname.startsWith("/admin/login")) {
    return <>{children}</>;
  }

  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("admin-session");

  // 쿠키가 없으면 로그인 페이지로 리다이렉트
  if (!sessionCookie?.value) {
    redirect("/admin/login");
  }

  // 실제 서명 검증 수행
  const verified = verifyCookie(sessionCookie.value);
  if (!verified) {
    redirect("/admin/login");
  }

  // 검증 통과 → 관리자 레이아웃 렌더링
  return <AdminLayoutUI>{children}</AdminLayoutUI>;
}
```

---

## 🔄 전체 인증 플로우

### 로그인 플로우

1. 사용자가 `/admin/login`에서 로그인
2. `/api/auth/login` 호출
3. DB에서 사용자 인증 확인
4. 랜덤 세션 토큰 생성 (`generateSessionToken`)
5. 토큰에 서명 추가 (`signCookie`) → `"토큰.서명"` 형식
6. 서명된 토큰을 쿠키에 저장 (`admin-session`)
7. 클라이언트로 응답

### 페이지 접근 플로우

1. 사용자가 `/admin` 접근
2. **미들웨어 실행** (Edge Runtime)
   - 쿠키 존재 여부 확인
   - 없으면 → `/admin/login`으로 리다이렉트
   - 있으면 → 경로 정보를 헤더에 추가하고 통과
3. **서버 컴포넌트 실행** (Node.js Runtime)
   - 로그인 페이지면 → 검증 건너뛰기
   - 쿠키에서 서명 검증 (`verifyCookie`)
   - 유효하지 않으면 → `/admin/login`으로 리다이렉트
   - 유효하면 → 관리자 페이지 렌더링

### 로그아웃 플로우

1. 사용자가 로그아웃 버튼 클릭
2. `/api/auth/logout` 호출
3. 쿠키 삭제 (`maxAge: 0`)
4. `/`로 리다이렉트

---

## 🔑 환경변수 설정

`.env.local` 파일에 추가:

```bash
AUTH_SECRET_KEY=your-very-secret-random-key-here
```

**주의:** 프로덕션에서는 반드시 강력한 랜덤 키를 사용하세요!

---

## 📁 파일 구조

```
src/
├── middleware.ts              # 미들웨어 (경로 보호)
├── lib/
│   └── auth.ts                # 쿠키 서명/검증 함수
├── app/
│   ├── admin/
│   │   ├── layout.tsx         # 서버 컴포넌트 검증
│   │   ├── login/
│   │   │   ├── layout.tsx      # 로그인 페이지 전용 layout
│   │   │   └── page.tsx       # 로그인 UI
│   │   └── page.tsx           # 관리자 대시보드
│   └── api/
│       └── auth/
│           ├── login/
│           │   └── route.ts   # 로그인 API
│           └── logout/
│               └── route.ts    # 로그아웃 API
```

---

## 🛡️ 보안 특징 요약

1. **쿠키 서명**: 쿠키 값 수정 불가능
2. **httpOnly**: JavaScript 접근 불가 (XSS 방지)
3. **sameSite: lax**: CSRF 방지
4. **랜덤 토큰**: 예측 불가능한 세션 토큰
5. **타이밍 어택 방지**: `timingSafeEqual` 사용
6. **이중 검증**: 미들웨어 + 서버 컴포넌트

---

## ⚠️ 주의사항

1. **비밀번호 해싱**: 현재는 평문 비밀번호를 사용하고 있습니다. 프로덕션에서는 `bcrypt` 등을 사용하여 해싱해야 합니다.
2. **세션 관리**: 현재는 쿠키만 사용합니다. 더 강력한 보안이 필요하면 DB에 세션을 저장하고 검증하는 방식을 고려하세요.
3. **환경변수**: `AUTH_SECRET_KEY`는 반드시 프로덕션에서 설정하세요.
