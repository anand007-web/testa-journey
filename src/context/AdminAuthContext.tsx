
import React, { createContext, useState, useContext, useEffect } from 'react';

interface AdminUser {
  username: string;
  isAuthenticated: boolean;
}

interface AdminAuthContextType {
  admin: AdminUser | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const defaultAuthContext: AdminAuthContextType = {
  admin: null,
  login: () => false,
  logout: () => {},
  isAuthenticated: false,
};

const AdminAuthContext = createContext<AdminAuthContextType>(defaultAuthContext);

export const useAdminAuth = () => useContext(AdminAuthContext);

// This is a simplified authentication mechanism for demo purposes
// In a production app, you would want to use a proper auth system
export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  
  useEffect(() => {
    // Check if admin is logged in from localStorage
    const storedAdmin = localStorage.getItem('admin_auth');
    if (storedAdmin) {
      try {
        setAdmin(JSON.parse(storedAdmin));
      } catch (error) {
        console.error('Error parsing admin auth data:', error);
        localStorage.removeItem('admin_auth');
      }
    }
  }, []);
  
  const login = (username: string, password: string): boolean => {
    // Hard-coded admin credentials for demo
    // In a real app, you would validate against a backend
    if (username === 'admin' && password === 'admin123') {
      const adminUser = { username, isAuthenticated: true };
      setAdmin(adminUser);
      localStorage.setItem('admin_auth', JSON.stringify(adminUser));
      return true;
    }
    return false;
  };
  
  const logout = () => {
    setAdmin(null);
    localStorage.removeItem('admin_auth');
  };
  
  return (
    <AdminAuthContext.Provider 
      value={{ 
        admin, 
        login, 
        logout, 
        isAuthenticated: !!admin?.isAuthenticated 
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};
