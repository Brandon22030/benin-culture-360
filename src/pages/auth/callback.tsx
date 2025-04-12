import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/services/supabase-client';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    // Récupère le hash de l'URL qui contient le token de confirmation
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get('access_token');
    const refreshToken = hashParams.get('refresh_token');

    if (accessToken && refreshToken) {
      // Met à jour la session avec les nouveaux tokens
      supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });
    }

    // Redirige vers la page d'accueil
    navigate('/');
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-benin-green mx-auto mb-4"></div>
        <p className="text-gray-600">Confirmation de votre compte...</p>
      </div>
    </div>
  );
}
