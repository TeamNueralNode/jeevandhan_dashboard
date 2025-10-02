"use client";

import { createContext, useContext, useEffect, useState } from 'react';

interface User {
  id: string;
  roleId: string;
  roleName: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (roleId: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session in localStorage
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const storedUser = localStorage.getItem('nbcfdc_user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      }
      setLoading(false);
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('nbcfdc_user');
      setLoading(false);
    }
  };

  const login = async (roleId: string, password: string) => {
    try {
      setLoading(true);
      // Store user data after successful login
      const userData = { 
        id: roleId, 
        roleId, 
        roleName: roleId === 'admin' ? 'Administrator' : 'User',
        name: roleId === 'admin' ? 'Admin User' : 'User'
      };
      setUser(userData);
      localStorage.setItem('nbcfdc_user', JSON.stringify(userData));
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      // Clear user data and localStorage
      setUser(null);
      localStorage.removeItem('nbcfdc_user');
      
      // Redirect to login page
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}