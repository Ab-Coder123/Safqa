import type { IApiErrorResponse } from '@safqa/types';
import { ApiError } from './api-error';
import { tokenStorage } from './token-storage';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

type ApiClientOptions = Omit<RequestInit, 'body'> & {
  body?: unknown;
  auth?: boolean;
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
  { body, headers, auth = false, ...options }: ApiClientOptions = {},
): Promise<T> {
  const requestHeaders = new Headers(headers);

  if (body !== undefined && !requestHeaders.has('Content-Type')) {
    requestHeaders.set('Content-Type', 'application/json');
  }

  if (auth) {
    const token = tokenStorage.getAccessToken();

    if (token) {
      requestHeaders.set('Authorization', `Bearer ${token}`);
    }
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: requestHeaders,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  return parseJsonResponse<T>(response);
}
