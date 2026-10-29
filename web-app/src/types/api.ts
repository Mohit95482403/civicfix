export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
    requestId?: string;
  };
  requestId?: string;
  timestamp?: string;
}

export class ApiError extends Error {
  code: string;
  statusCode: number;
  details?: unknown;
  requestId?: string;

  constructor(message: string, code = 'API_ERROR', statusCode = 500, details?: unknown, requestId?: string) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    this.requestId = requestId;
  }
}
