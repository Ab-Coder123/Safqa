const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

function canUseStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export const tokenStorage = {
  getAccessToken() {
    if (!canUseStorage()) {
      return null;
    }

    return window.localStorage.getItem(ACCESS_TOKEN_KEY);
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
