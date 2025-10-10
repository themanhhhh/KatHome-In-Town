'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthAPI, TokenManager, User, RegisterData, LoginData, AuthResponse } from '../lib/auth';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  
  // Auth actions
  register: (data: RegisterData) => Promise<AuthResponse>;
  login: (data: LoginData) => Promise<AuthResponse>;
  verifyEmail: (gmail: string, code: string) => Promise<AuthResponse>;
  resendVerification: (gmail: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  
  // Password reset
  forgotPassword: (gmail: string) => Promise<{ success: boolean; message: string }>;
  resetPassword: (token: string, matKhauMoi: string) => Promise<{ success: boolean; message: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedToken = TokenManager.getToken();
    const savedUser = TokenManager.getUser();

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(savedUser);
      
      // Refresh user data from server
      refreshUserData(savedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  const refreshUserData = async (authToken: string) => {
    try {
      const result = await AuthAPI.getCurrentUser(authToken);
      setUser(result.user);
      TokenManager.saveUser(result.user);
    } catch (error) {
      console.error('Failed to refresh user:', error);
      // Token might be expired, clear auth
      TokenManager.clearAll();
      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData): Promise<AuthResponse> => {
    const result = await AuthAPI.register(data);
    // Note: After registration, user needs to verify email
    // So we don't save token yet
    return result;
  };

  const login = async (data: LoginData): Promise<AuthResponse> => {
    const result = await AuthAPI.login(data);

    if (result.token && result.user) {
      setToken(result.token);
      setUser(result.user);
      TokenManager.saveToken(result.token);
      TokenManager.saveUser(result.user);
    }

    return result;
  };

  const verifyEmail = async (gmail: string, code: string): Promise<AuthResponse> => {
    const result = await AuthAPI.verifyEmail(gmail, code);

    if (result.token && result.user) {
      setToken(result.token);
      setUser(result.user);
      TokenManager.saveToken(result.token);
      TokenManager.saveUser(result.user);
    }

    return result;
  };

  const resendVerification = async (gmail: string) => {
    return await AuthAPI.resendVerification(gmail);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    TokenManager.clearAll();
  };

  const refreshUser = async () => {
    if (token) {
      await refreshUserData(token);
    }
  };

  const forgotPassword = async (gmail: string) => {
    return await AuthAPI.forgotPassword(gmail);
  };

  const resetPassword = async (resetToken: string, matKhauMoi: string) => {
    return await AuthAPI.resetPassword(resetToken, matKhauMoi);
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated: !!token && !!user,
    isAdmin: !!user && user.vaiTro === 'admin',
    register,
    login,
    verifyEmail,
    resendVerification,
    logout,
    refreshUser,
    forgotPassword,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

