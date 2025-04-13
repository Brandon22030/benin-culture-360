import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/services/supabase-client';
import { useToast } from '@/hooks/use-toast';

export default function AuthCallback() {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleCallback = async () => {
      // Récupère le hash de l'URL qui contient le token de confirmation
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get('access_token');
      const refreshToken = hashParams.get('refresh_token');

      if (accessToken && refreshToken) {
        try {
          // Met à jour la session avec les nouveaux tokens
          await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          // Récupère les informations de l'utilisateur
          const { data: { user }, error: userError } = await supabase.auth.getUser();
          if (userError) throw userError;

          if (user) {
            // Vérifie si un profil existe déjà
            const { data: existingProfile } = await supabase
              .from('profiles')
              .select()
              .eq('id', user.id)
              .single();

            if (!existingProfile) {
              // Crée le profil si il n'existe pas
              const { error: profileError } = await supabase
                .from('profiles')
                .insert({
                  id: user.id,
                  username: user.email?.split('@')[0] || 'user',
                  full_name: user.user_metadata.full_name || '',
                });

              if (profileError) {
                console.error('Error creating profile:', profileError);
                toast({
                  title: "Attention",
                  description: "Il y a eu un problème avec la création de votre profil. Contactez le support.",
                  variant: "destructive"
                });
              }
            }
          }
        } catch (error) {
          console.error('Error in auth callback:', error);
          toast({
            title: "Erreur",
            description: "Une erreur est survenue lors de la confirmation de votre compte.",
            variant: "destructive"
          });
        }
      }

      // Redirige vers la page d'accueil
      navigate('/');
    };

    handleCallback();
  }, [navigate, toast]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-benin-green mx-auto mb-4"></div>
        <p className="text-gray-600">Confirmation de votre compte...</p>
      </div>
    </div>
  );
}
