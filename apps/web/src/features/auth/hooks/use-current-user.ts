'use client';

import { useQuery } from '@tanstack/react-query';
import { tokenStorage } from '@/lib/api';
import { queryKeys } from '@/lib/query';
import { authApi } from '../api/auth.api';

// Access token lifetime is 15 minutes.
// We set staleTime to 14 minutes so TanStack Query doesn't refetch /auth/me
// on every focus or mount — only when the cached data is actually stale.
const ACCESS_TOKEN_LIFETIME_MS = 15 * 60 * 1000; // 15 min
const STALE_BUFFER_MS = 60 * 1000; // 1 min buffer
const STALE_TIME = ACCESS_TOKEN_LIFETIME_MS - STALE_BUFFER_MS; // 14 min

export function useCurrentUser() {
  return useQuery({
    queryKey: queryKeys.auth.me(),
    queryFn: authApi.me,
    enabled: !!tokenStorage.getAccessToken(),
    staleTime: STALE_TIME,
    // Don't retry on 401 — the auto-refresh interceptor in api-client handles that.
    // If /auth/me still fails after refresh, the session is gone — no point retrying.
    retry: 0,
  });
}
