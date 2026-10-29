const TOKEN_KEY = 'civicfix_token';
const REFRESH_TOKEN_KEY = 'civicfix_refresh_token';

// In-memory fallback if localStorage is unavailable (e.g., node test environment, incognito restrictions)
const memoryStore: Record<string, string> = {};

function isLocalStorageAvailable(): boolean {
  try {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  } catch {
    return false;
  }
}

export const storage = {
  getToken: (): string | null => {
    try {
      if (isLocalStorageAvailable()) {
        return localStorage.getItem(TOKEN_KEY);
      }
      return memoryStore[TOKEN_KEY] || null;
    } catch {
      return memoryStore[TOKEN_KEY] || null;
    }
  },

  getRefreshToken: (): string | null => {
    try {
      if (isLocalStorageAvailable()) {
        return localStorage.getItem(REFRESH_TOKEN_KEY);
      }
      return memoryStore[REFRESH_TOKEN_KEY] || null;
    } catch {
      return memoryStore[REFRESH_TOKEN_KEY] || null;
    }
  },

  setTokens: (accessToken: string, refreshToken?: string): void => {
    try {
      if (isLocalStorageAvailable()) {
        localStorage.setItem(TOKEN_KEY, accessToken);
        if (refreshToken) {
          localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
        }
      }
      memoryStore[TOKEN_KEY] = accessToken;
      if (refreshToken) {
        memoryStore[REFRESH_TOKEN_KEY] = refreshToken;
      }
    } catch {
      memoryStore[TOKEN_KEY] = accessToken;
      if (refreshToken) {
        memoryStore[REFRESH_TOKEN_KEY] = refreshToken;
      }
    }
  },

  clearTokens: (): void => {
    try {
      if (isLocalStorageAvailable()) {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
      }
      delete memoryStore[TOKEN_KEY];
      delete memoryStore[REFRESH_TOKEN_KEY];
    } catch {
      delete memoryStore[TOKEN_KEY];
      delete memoryStore[REFRESH_TOKEN_KEY];
    }
  },
};
