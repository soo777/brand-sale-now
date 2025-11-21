/**
 * 공통 API 응답 타입
 * @template T - 응답 데이터의 타입 (없는 경우 void)
 */
export type ApiResponse<T = void> = {
  ok: boolean;
  data?: T;
  error?: string;
  message?: string;
};

/**
 * 성공 여부를 success 필드로 사용하는 API 응답 타입 (auth API용)
 * @template T - 응답 데이터의 타입 (없는 경우 void)
 */
export type ApiResponseWithSuccess<T = void> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};
