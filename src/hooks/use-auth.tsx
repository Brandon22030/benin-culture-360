import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/services/supabase";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  signIn?: (email: string, password: string) => Promise<void>;
  signOut?: () => Promise<void>;
  signUp?: (email: string, password: string, userData: any) => Promise<void>;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error(
      "useAuth doit être utilisé à l'intérieur d'un AuthProvider",
    );
  }
  return context;
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const refreshUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setUser(user);
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      await refreshUser();
    } catch (error: any) {
      toast.error(error.message || "Erreur de connexion");
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
    } catch (error: any) {
      toast.error(error.message || "Erreur de déconnexion");
      throw error;
    }
  };

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
        },
      });
      if (error) throw error;

      // Attendre que l'utilisateur soit créé
      if (data.user) {
        const { error: profileError } = await supabase.from("profiles").insert({
          id: data.user.id,
          email: data.user.email,
          username: userData.username || email.split("@")[0],
          full_name: userData.full_name || "",
        });

        if (profileError) throw profileError;
      }
    } catch (error: any) {
      toast.error(error.message || "Erreur d'inscription");
      throw error;
    }
  };

  useEffect(() => {
    refreshUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, signIn, signOut, signUp, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
