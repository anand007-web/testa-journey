
import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'sonner';

interface User {
  id: string;
  username: string;
  email: string;
  isAuthenticated: boolean;
  createdAt: string;
}

interface UserRegistrationData {
  username: string;
  email: string;
  password: string;
}

interface UserLoginData {
  email: string;
  password: string;
}

interface UserAuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  register: (data: UserRegistrationData) => Promise<boolean>;
  login: (data: UserLoginData) => Promise<boolean>;
  logout: () => void;
  getUserProfile: () => User | null;
}

const defaultAuthContext: UserAuthContextType = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  register: async () => false,
  login: async () => false,
  logout: () => {},
  getUserProfile: () => null,
};

const UserAuthContext = createContext<UserAuthContextType>(defaultAuthContext);

export const useUserAuth = () => useContext(UserAuthContext);

export const UserAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Check if user is logged in from localStorage
    const checkUserAuth = () => {
      const storedUser = localStorage.getItem('user_auth');
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        } catch (error) {
          console.error('Error parsing user auth data:', error);
          localStorage.removeItem('user_auth');
        }
      }
      setIsLoading(false);
    };
    
    checkUserAuth();
  }, []);
  
  // Enhanced registration function
  const register = async (data: UserRegistrationData): Promise<boolean> => {
    // In a real app, you would call an API to register the user
    try {
      // Check if user already exists
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const existingUser = users.find((u: any) => u.email === data.email);
      
      if (existingUser) {
        toast.error('User with this email already exists');
        return false;
      }
      
      // Create new user
      const newUser: User = {
        id: crypto.randomUUID(),
        username: data.username,
        email: data.email,
        isAuthenticated: true,
        createdAt: new Date().toISOString(),
      };
      
      // Store user in localStorage (with password for login - in a real app you would hash this)
      const userWithPassword = { ...newUser, password: data.password };
      users.push(userWithPassword);
      localStorage.setItem('users', JSON.stringify(users));
      
      // Log user in
      setUser(newUser);
      localStorage.setItem('user_auth', JSON.stringify(newUser));
      
      return true;
    } catch (error) {
      console.error('Error registering user:', error);
      return false;
    }
  };
  
  const login = async (data: UserLoginData): Promise<boolean> => {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const foundUser = users.find(
        (u: any) => u.email === data.email && u.password === data.password
      );
      
      if (foundUser) {
        // Remove password before storing in state and localStorage
        const { password, ...userWithoutPassword } = foundUser;
        const loggedInUser = { ...userWithoutPassword, isAuthenticated: true };
        
        setUser(loggedInUser);
        localStorage.setItem('user_auth', JSON.stringify(loggedInUser));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error logging in:', error);
      return false;
    }
  };
  
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user_auth');
    toast.success('Logged out successfully');
  };
  
  const getUserProfile = () => user;
  
  return (
    <UserAuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user?.isAuthenticated,
        isLoading,
        register,
        login,
        logout,
        getUserProfile,
      }}
    >
      {children}
    </UserAuthContext.Provider>
  );
};
