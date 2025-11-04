export type DbResult = {
  success: boolean;
  data?: Record<string, unknown>[];
  message?: string;
  error?: string;
  details?: string;
  timestamp?: string;
};
