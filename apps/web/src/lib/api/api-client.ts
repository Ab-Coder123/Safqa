import type { IApiErrorResponse } from '@safqa/types';
import { ApiError } from './api-error';
import { tokenStorage } from './token-storage';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

type ApiClientOptions = Omit<RequestInit, 'body'> & {
  body?: unknown;
  auth?: boolean;
  /**
   * Internal flag — prevents infinite retry loop when the refresh call itself fails.
   * Never set this from outside api-client.
   */
  _isRetry?: boolean;
};

async function parseJsonResponse<T>(response: Response): Promise<T> {
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const payload: IApiErrorResponse = {
      statusCode: response.status,
      message: data?.message || 'Request failed',
      error: data?.error || response.statusText,
      timestamp: data?.timestamp || new Date().toISOString(),
    };

    throw new ApiError(payload);
  }

  return data as T;
}

export async function apiClient<T>(
  path: string,
  { body, headers, auth = false, _isRetry = false, ...options }: ApiClientOptions = {},
): Promise<T> {
  const requestHeaders = new Headers(headers);
  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;

  if (body !== undefined && !isFormData && !requestHeaders.has('Content-Type')) {
    requestHeaders.set('Content-Type', 'application/json');
  }

  if (auth) {
    const token = tokenStorage.getAccessToken();
    if (token) {
      requestHeaders.set('Authorization', `Bearer ${token}`);
    }
  }

  const requestBody = isFormData
    ? (body as FormData)
    : body === undefined
      ? undefined
      : JSON.stringify(body);

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: requestHeaders,
    body: requestBody,
  });

  // ── 401 Auto-Refresh Interceptor ──────────────────────────────────────────
  // When a protected request returns 401 and we haven't already retried:
  //  1. Try to get a new access token using the stored refresh token.
  //  2. If successful, store the new tokens and replay the original request.
  //  3. If the refresh itself fails, clear all tokens (forces re-login).
  if (response.status === 401 && auth && !_isRetry) {
    const refreshToken = tokenStorage.getRefreshToken();

    if (refreshToken) {
      try {
        // Call /auth/refresh directly (no auth flag — uses body, not header)
        const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        });

        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          // Store the fresh tokens
          tokenStorage.setTokens(refreshData.tokens);

          // Replay the original request with the new access token
          return apiClient<T>(path, {
            body,
            headers,
            auth,
            _isRetry: true, // prevent further retry loops
            ...options,
          });
        }
      } catch {
        // Refresh request itself failed (network error etc.) — fall through to clear
      }

      // Refresh token is invalid or expired — clear session
      tokenStorage.clear();
    }
  }
  // ── End Auto-Refresh Interceptor ──────────────────────────────────────────

  return parseJsonResponse<T>(response);
}
