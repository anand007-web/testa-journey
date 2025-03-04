
import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { toast } from 'sonner';

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
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  register: (data: UserRegistrationData) => Promise<boolean>;
  login: (data: UserLoginData) => Promise<boolean>;
  logout: () => Promise<void>;
  getUserProfile: () => User | null;
}

const defaultAuthContext: UserAuthContextType = {
  user: null,
  session: null,
  isAuthenticated: false,
  isLoading: true,
  register: async () => false,
  login: async () => false,
  logout: async () => {},
  getUserProfile: () => null,
};

const UserAuthContext = createContext<UserAuthContextType>(defaultAuthContext);

// Export both hooks for compatibility
export const useUserAuth = () => useContext(UserAuthContext);
export const useAuth = () => useContext(UserAuthContext); // Alias for backward compatibility

export const UserAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Check active session and sets the user
    const getSession = async () => {
      setIsLoading(true);
      
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error getting session:', error.message);
      }
      
      if (session) {
        setSession(session);
        setUser(session.user);
      }
      
      setIsLoading(false);
    };
    
    getSession();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  // Modified registration function without email verification
  const register = async (data: UserRegistrationData): Promise<boolean> => {
    try {
      // Using signUp with autoConfirm option via the meta data
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            username: data.username,
          },
          // The emailRedirectTo is not needed since we're not verifying email
        },
      });
      
      if (error) {
        console.error('Error registering user:', error.message);
        toast.error(error.message);
        return false;
      }
      
      // If we have a user, registration was successful
      if (authData.user) {
        toast.success('Registration successful! You can now log in with your credentials.');
        
        // Auto-login the user after registration
        const { error: loginError } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });
        
        if (loginError) {
          console.error('Error auto-logging in after registration:', loginError.message);
          // Even if auto-login fails, registration was successful
          return true;
        }
        
        toast.success('You are now logged in!');
        return true;
      }
      
      return false;
    } catch (error: any) {
      console.error('Error registering user:', error.message);
      toast.error('Registration failed. Please try again.');
      return false;
    }
  };
  
  const login = async (data: UserLoginData): Promise<boolean> => {
    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });
      
      if (error) {
        console.error('Error logging in:', error.message);
        toast.error(error.message);
        return false;
      }
      
      if (authData.user) {
        toast.success('Login successful!');
        return true;
      }
      
      return false;
    } catch (error: any) {
      console.error('Error logging in:', error.message);
      toast.error('Login failed. Please try again.');
      return false;
    }
  };
  
  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Error logging out:', error.message);
        toast.error(error.message);
      } else {
        toast.success('Logged out successfully');
      }
    } catch (error: any) {
      console.error('Error logging out:', error.message);
      toast.error('Logout failed. Please try again.');
    }
  };
  
  const getUserProfile = () => user;
  
  return (
    <UserAuthContext.Provider
      value={{
        user,
        session,
        isAuthenticated: !!user,
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
