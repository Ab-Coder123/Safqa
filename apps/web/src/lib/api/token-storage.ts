const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

function canUseStorage(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export const tokenStorage = {
  getAccessToken(): string | null {
    if (!canUseStorage()) {
      return null;
    }
    return window.localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  getRefreshToken(): string | null {
    if (!canUseStorage()) {
      return null;
    }
    return window.localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  hasToken(): boolean {
    return !!this.getAccessToken();
  },

  setTokens(tokens: AuthTokens) {
    if (!canUseStorage()) {
      return;
    }
    window.localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
    window.localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
  },

  clear() {
    if (!canUseStorage()) {
      return;
    }
    window.localStorage.removeItem(ACCESS_TOKEN_KEY);
    window.localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
};
