import type { Response, Request } from 'express';

export interface StandardSuccessResponse<T = unknown> {
  success: true;
  data: T;
  requestId: string;
  timestamp: string;
}

export interface StandardErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
  requestId: string;
  timestamp: string;
}

export class ApiResponse {
  /**
   * Helper to resolve the active request ID.
   */
  private static getRequestId(res: Response): string {
    const req = res.req as Request | undefined;
    return req?.id || (res.getHeader('x-request-id') as string) || 'unknown';
  }

  /**
   * Sends a standardized HTTP 200 OK success response.
   */
  public static success<T>(res: Response, data: T, statusCode = 200): Response {
    const payload: StandardSuccessResponse<T> = {
      success: true,
      data,
      requestId: this.getRequestId(res),
      timestamp: new Date().toISOString(),
    };
    return res.status(statusCode).json(payload);
  }

  /**
   * Sends a standardized HTTP 201 Created success response.
   */
  public static created<T>(res: Response, data: T): Response {
    return this.success(res, data, 201);
  }

  /**
   * Sends a standardized HTTP 204 No Content response.
   */
  public static noContent(res: Response): Response {
    return res.status(204).send();
  }

  /**
   * Sends a standardized error response.
   */
  public static error(
    res: Response,
    code: string,
    message: string,
    statusCode = 500,
    details?: unknown
  ): Response {
    const payload: StandardErrorResponse = {
      success: false,
      error: {
        code,
        message,
        ...(details !== undefined ? { details } : {}),
      },
      requestId: this.getRequestId(res),
      timestamp: new Date().toISOString(),
    };
    return res.status(statusCode).json(payload);
  }
}
