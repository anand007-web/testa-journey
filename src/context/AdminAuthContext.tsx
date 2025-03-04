
import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Admin {
  id: string;
  username: string;
  role: string;
}

interface AdminAuthContextType {
  admin: Admin | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const defaultContext: AdminAuthContextType = {
  admin: null,
  isAuthenticated: false,
  isLoading: true,
  login: () => false,
  logout: () => {},
};

const AdminAuthContext = createContext<AdminAuthContextType>(defaultContext);

export const useAdminAuth = () => useContext(AdminAuthContext);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Check if admin is logged in from localStorage
    const storedAdmin = localStorage.getItem('admin_auth');
    if (storedAdmin) {
      try {
        const parsedAdmin = JSON.parse(storedAdmin);
        setAdmin(parsedAdmin);
      } catch (error) {
        console.error('Error parsing admin auth data:', error);
        localStorage.removeItem('admin_auth');
      }
    }
    setIsLoading(false);
  }, []);
  
  const login = (username: string, password: string): boolean => {
    // We'll call our Supabase Edge Function for admin authentication
    try {
      // For now we'll simulate the edge function call since it's being deployed
      // In a real implementation, we would call the edge function
      
      if (username === 'admin' && password === 'admin123') {
        const adminData = {
          id: 'admin-1',
          username: 'admin',
          role: 'admin',
        };
        
        setAdmin(adminData);
        localStorage.setItem('admin_auth', JSON.stringify(adminData));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Admin login error:', error);
      return false;
    }
  };
  
  const logout = () => {
    setAdmin(null);
    localStorage.removeItem('admin_auth');
  };
  
  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        isAuthenticated: !!admin,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};
