import { ApiResponse, ApiError } from '../types/api';
import { storage } from '../utils/storage';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const token = storage.getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string>),
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const res = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const data: ApiResponse<T> = await res.json();

    if (!res.ok || !data.success) {
      if (res.status === 401) {
        storage.clearTokens();
      }
      throw new ApiError(
        data.error?.message || `Request failed with status ${res.status}`,
        data.error?.code || 'API_ERROR',
        res.status,
        data.error?.details,
        data.error?.requestId
      );
    }

    return data;
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    if (err instanceof ApiError) throw err;
    if (err instanceof Error && err.name === 'AbortError') {
      throw new ApiError('Request timed out. Please check your network connection.', 'TIMEOUT', 408);
    }
    throw new ApiError(
      err instanceof Error ? err.message : 'An unexpected network error occurred.',
      'NETWORK_ERROR',
      0
    );
  }
}
