import React, { createContext, useContext, useEffect, useState } from 'react';
import { authApi, authStorage, type AuthUser, type OrgMembership } from '../api/auth';

interface AuthContextType {
  user: AuthUser | null;
  memberships: OrgMembership[];
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [memberships, setMemberships] = useState<OrgMembership[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function initAuth() {
      const token = authStorage.getToken();
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const data = await authApi.getMe();
        setUser(data.user);
        setMemberships(data.memberships);
      } catch (err: unknown) {
        console.warn('Admin session verification failed:', err);
        authStorage.clearTokens();
        setUser(null);
        setMemberships([]);
      } finally {
        setIsLoading(false);
      }
    }

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setError(null);
    setIsLoading(true);
    try {
      await authApi.login(email, password);
      const meData = await authApi.getMe();

      // Enforce administrator privileges
      const allowedRoles = ['organization_admin', 'platform_admin'];
      if (!allowedRoles.includes(meData.user.role)) {
        await authApi.logout();
        throw new Error(
          `Access Denied: Your account role (${meData.user.role}) does not have administrative privileges for this portal.`
        );
      }

      setUser(meData.user);
      setMemberships(meData.memberships);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Authentication failed';
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authApi.logout();
    } finally {
      setUser(null);
      setMemberships([]);
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        memberships,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
