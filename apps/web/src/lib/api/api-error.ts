import type { IApiErrorResponse } from '@safqa/types';

export class ApiError extends Error {
  statusCode: number;
  error: string;
  timestamp?: string;

  constructor(payload: IApiErrorResponse) {
    super(payload.message);
    this.name = 'ApiError';
    this.statusCode = payload.statusCode;
    this.error = payload.error;
    this.timestamp = payload.timestamp;
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}
