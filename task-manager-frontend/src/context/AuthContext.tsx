// src/context/AuthContext.tsx
'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import api, { tokenStorage } from '@/lib/api';
import toast from 'react-hot-toast';

interface User {
  id: string;
  email: string;
  username: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Restore user from localStorage on mount
  useEffect(() => {
    const storedUser = tokenStorage.getUser();
    const accessToken = tokenStorage.getAccess();
    if (storedUser && accessToken) {
      setUser(storedUser);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { data } = await api.post('/auth/login', { email, password });
    tokenStorage.setTokens(data.accessToken, data.refreshToken);
    tokenStorage.setUser(data.user);
    setUser(data.user);
    router.push('/dashboard');
  }, [router]);

  const register = useCallback(async (email: string, username: string, password: string) => {
    const { data } = await api.post('/auth/register', { email, username, password });
    tokenStorage.setTokens(data.accessToken, data.refreshToken);
    tokenStorage.setUser(data.user);
    setUser(data.user);
    router.push('/dashboard');
  }, [router]);

  const logout = useCallback(async () => {
    try {
      const refreshToken = tokenStorage.getRefresh();
      await api.post('/auth/logout', { refreshToken });
    } catch {
      // Ignore errors on logout
    } finally {
      tokenStorage.clear();
      setUser(null);
      router.push('/login');
      toast.success('Logged out successfully');
    }
  }, [router]);

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      isAuthenticated: !!user,
      login,
      register,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
