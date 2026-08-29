import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import React from 'react';
import { useLogin } from '../use-login';
import { createTestWrapper } from '@/test/test-utils';
import { authApi } from '../../api/auth.api';
import { tokenStorage } from '@/lib/api';

describe('useLogin Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls authApi.login and stores tokens on successful login', async () => {
    const mockTokens = {
      accessToken: 'mock-access-token-xyz',
      refreshToken: 'mock-refresh-token-xyz',
    };

    const mockResponse = {
      user: {
        id: 'u-1',
        email: 'test@safqa.com',
        full_name: 'Test User',
      },
      tokens: mockTokens,
    };

    const loginSpy = vi.spyOn(authApi, 'login').mockResolvedValue(mockResponse as any);
    const tokenSetSpy = vi.spyOn(tokenStorage, 'setTokens').mockImplementation(() => {});

    const { result } = renderHook(() => useLogin(), {
      wrapper: createTestWrapper(),
    });

    const loginInput = {
      email: 'test@safqa.com',
      password: 'StrongPassword123!',
    };

    await result.current.mutateAsync(loginInput);

    expect(loginSpy).toHaveBeenCalledWith(loginInput);
    expect(tokenSetSpy).toHaveBeenCalledWith(mockTokens);
  });
});
