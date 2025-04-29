import { useCallback, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/services/supabase';
import { useToast } from './use-toast';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    // Listen for changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setIsLoading(false);

      if (event === 'SIGNED_IN') {
        toast({
          title: "Connecté",
          description: "Vous êtes maintenant connecté à BéninCulture360",
          className: "bg-green-50 text-green-900 border-green-200",
        });
      }
      
      if (event === 'SIGNED_OUT') {
        toast({
          title: "Déconnecté",
          description: "Vous avez été déconnecté avec succès",
          className: "bg-blue-50 text-blue-900 border-blue-200",
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [toast]);

  const refreshUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    } catch (error) {
      console.error('Error refreshing user:', error);
      toast({
        title: "Error refreshing user",
        description: "Failed to refresh user data",
        variant: "destructive",
        className: "bg-red-50 text-red-900 border-red-200",
      });
    }
  };

  const signOut = useCallback(async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Erreur de déconnexion",
        description: "Une erreur est survenue lors de la déconnexion",
        variant: "destructive",
        className: "bg-red-50 text-red-900 border-red-200",
      });
    }
  }, [toast]);

  return { user, isLoading, signOut, refreshUser };
}
