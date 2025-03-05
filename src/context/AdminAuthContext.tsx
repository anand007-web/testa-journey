
import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Admin {
  id: string;
  username: string;
  role: string;
}

interface AdminAuthContextType {
  admin: Admin | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const defaultContext: AdminAuthContextType = {
  admin: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => false,
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
  
  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      console.log("Attempting admin login with:", username);
      
      // Direct fetch to ensure we're making the right request
      const response = await fetch(`${supabase.functions.url}/admin-auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabase.auth.session()?.access_token || ''}`,
          'apikey': supabase.supabaseKey || '',
        },
        body: JSON.stringify({ username, password }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Admin auth response error:', response.status, errorText);
        toast.error(`Authentication failed (${response.status})`);
        return false;
      }
      
      const data = await response.json();
      
      if (data?.success && data?.admin) {
        const adminData = data.admin;
        setAdmin(adminData);
        localStorage.setItem('admin_auth', JSON.stringify(adminData));
        return true;
      } else {
        toast.error(data?.error || 'Invalid credentials');
        return false;
      }
    } catch (error: any) {
      console.error('Admin login error:', error);
      toast.error(`Authentication failed: ${error?.message || 'Unknown error'}`);
      return false;
    }
  };
  
  const logout = () => {
    setAdmin(null);
    localStorage.removeItem('admin_auth');
    toast.success('Logged out successfully');
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
