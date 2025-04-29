import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/services/supabase';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  signIn?: (email: string, password: string) => Promise<void>;
  signOut?: () => Promise<void>;
  signUp?: (email: string, password: string, userData: any) => Promise<void>;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
  }
  return context;
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const refreshUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  // // Add other auth functions here
  // const signIn = async (email: string, password: string) => {
  //   // ... existing code ...
  // };

  // const signOut = async () => {
  //   // ... existing code ...
  // };

  // const signUp = async (email: string, password: string, userData: any) => {
  //   // ... existing code ...
  // };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, signUp, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};