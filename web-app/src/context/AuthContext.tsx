import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { AuthUser, UserRole, OrgMembership } from '../types/auth';
import { authService } from '../services/auth.service';
import { storage } from '../utils/storage';

interface AuthContextType {
  user: AuthUser | null;
  role: UserRole | null;
  memberships: OrgMembership[];
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<AuthUser>;
  register: (data: { fullName: string; email: string; password: string; phone?: string }) => Promise<{ emailVerificationRequired: boolean }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [memberships, setMemberships] = useState<OrgMembership[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const initAuth = useCallback(async () => {
    const token = storage.getToken();
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const data = await authService.getMe();
      setUser(data.user);
      setMemberships(data.memberships);
    } catch (err: unknown) {
      console.warn('Session restoration failed:', err);
      storage.clearTokens();
      setUser(null);
      setMemberships([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  const login = async (email: string, password: string): Promise<AuthUser> => {
    setError(null);
    setIsLoading(true);
    try {
      await authService.login(email, password);
      const meData = await authService.getMe();
      setUser(meData.user);
      setMemberships(meData.memberships);
      return meData.user;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid email or password.';
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: {
    fullName: string;
    email: string;
    password: string;
    phone?: string;
  }) => {
    setError(null);
    setIsLoading(true);
    try {
      const res = await authService.registerCitizen(data);
      if (!res.emailVerificationRequired) {
        const meData = await authService.getMe();
        setUser(meData.user);
        setMemberships(meData.memberships);
      }
      return { emailVerificationRequired: res.emailVerificationRequired };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration failed.';
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
    } finally {
      setUser(null);
      setMemberships([]);
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    try {
      const meData = await authService.getMe();
      setUser(meData.user);
      setMemberships(meData.memberships);
    } catch {
      // Ignore background refresh errors
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        memberships,
        isAuthenticated: !!user,
        isLoading,
        error,
        login,
        register,
        logout,
        refreshUser,
        clearError,
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
