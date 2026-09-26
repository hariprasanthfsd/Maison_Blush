import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { authApi, cartApi } from '../services/api';
import { useToast } from './ToastContext';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  register: (data: any) => Promise<boolean>;
  logout: () => void;
  updateUser: (name: string, phone: string) => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('mb_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { showToast } = useToast();

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const profile = await authApi.getProfile();
          setUser({
            id: profile.id,
            name: profile.name,
            email: profile.email,
            phone: profile.phone,
            role: profile.role,
          });
        } catch (err) {
          console.error('Session expired or invalid token:', err);
          logout();
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, [token]);

  const login = async (email: string, pass: string): Promise<boolean> => {
    try {
      const res = await authApi.login({ email, password: pass });
      localStorage.setItem('mb_token', res.token);
      setToken(res.token);
      setUser({
        id: res.userId,
        name: res.name,
        email: res.email,
        phone: res.phone,
        role: res.role,
      });
      showToast(`Welcome back, ${res.name}! 💕`, 'success');

      // Sync cart with backend after login
      try {
        await cartApi.syncGuestCart();
      } catch (e) { }

      return true;
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Login failed. Please check your credentials.';
      showToast(msg, 'error');
      return false;
    }
  };

  const register = async (data: any): Promise<boolean> => {
    try {
      const res = await authApi.register(data);
      localStorage.setItem('mb_token', res.token);
      setToken(res.token);
      setUser({
        id: res.userId,
        name: res.name,
        email: res.email,
        phone: res.phone,
        role: res.role,
      });
      showToast(`Welcome to Maison Blush, ${res.name}! ✨`, 'success');

      try {
        await cartApi.syncGuestCart();
      } catch (e) { }

      return true;
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Registration failed.';
      showToast(msg, 'error');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('mb_token');
    setToken(null);
    setUser(null);
    showToast('Logged out successfully.', 'info');
  };

  const updateUser = (name: string, phone: string) => {
    if (user) {
      setUser({ ...user, name, phone });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        updateUser,
        isAdmin: user?.role === 'Admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
