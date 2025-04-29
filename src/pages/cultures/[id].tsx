import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getCultureById } from '@/services/supabase';
import type { Culture } from '@/types/database.types';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/Layout';

export default function CultureDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [culture, setCulture] = useState<Culture | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  const loadCulture = useCallback(async (cultureId: string) => {
    try {
      const data = await getCultureById(cultureId);
      setCulture(data);
    } catch (error) {
      const e = error as { message?: string };
      toast({
        title: 'Erreur',
        description: e.message || 'Impossible de charger la culture',
        variant: 'destructive',
      });
      navigate('/cultures');
    } finally {
      setIsLoading(false);
    }
  }, [navigate, toast]);

  useEffect(() => {
    if (id) {
      loadCulture(id);
    }
  }, [id, loadCulture]);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-benin-green"></div>
        </div>
      </Layout>
    );
  }

  if (!culture) {
    return null;
  }

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/cultures')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour aux cultures
        </Button>

        <article className="max-w-4xl mx-auto">
          <header className="mb-8">
            {culture.image_url && (
              <div className="relative w-full h-[400px] mb-6 rounded-lg overflow-hidden">
                <img
                  src={culture.image_url}
                  alt={culture.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <h1 className="text-4xl font-bold mb-4">{culture.name}</h1>
          </header>

          <div className="prose max-w-none">
            <p className="whitespace-pre-line">{culture.description}</p>
          </div>
        </article>
      </div>
    </Layout>
  );
}
