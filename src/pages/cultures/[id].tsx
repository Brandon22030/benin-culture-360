import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Edit, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getCultureById } from '@/services/supabase';
import type { Culture } from '@/types/database.types';
import { useToast } from '@/hooks/use-toast';

export default function CultureDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [culture, setCulture] = useState<Culture | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      loadCulture(id);
    }
  }, [id, loadCulture]);

  const loadCulture = useCallback(async (cultureId: string) => {
    try {
      const data = await getCultureById(cultureId);
      setCulture(data);
    } catch (error) {
      const e = error as { message?: string };
      toast({
        title: 'Erreur',
        description: e.message || 'Impossible de charger les détails de la culture',
        variant: 'destructive',
      });
      navigate('/cultures');
    } finally {
      setIsLoading(false);
    }
  }, [navigate, toast]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-benin-green"></div>
      </div>
    );
  }

  if (!culture) {
    return null;
  }

  return (
    <div className="container mx-auto py-6">
      <Button
        variant="ghost"
        onClick={() => navigate('/cultures')}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour aux cultures
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {culture.image_url && (
          <div className="relative h-96 rounded-lg overflow-hidden">
            <img
              src={culture.image_url}
              alt={culture.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        )}

        <div className="space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold">{culture.name}</h1>
              {culture.region && (
                <p className="text-lg text-gray-600 mt-2">{culture.region}</p>
              )}
            </div>
            <Button
              onClick={() => navigate(`/cultures/${culture.id}/edit`)}
              className="bg-benin-green hover:bg-benin-green/90"
            >
              <Edit className="mr-2 h-4 w-4" />
              Modifier
            </Button>
          </div>

          {culture.description && (
            <div className="prose max-w-none">
              <p className="text-gray-600 whitespace-pre-line">
                {culture.description}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
