import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createArticle, getCultures, supabase } from '@/services/supabase';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/types/database.types';
import type { Culture } from '@/types/database.types';

type ArticleInsert = Database['public']['Tables']['articles']['Insert'];

export default function NewArticlePage() {
  const [formData, setFormData] = useState<ArticleInsert>({
    title: '',
    content: '',
    culture_id: '',
    author_id: '',
  });
  const [cultures, setCultures] = useState<Culture[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const loadCultures = useCallback(async () => {
    try {
      const data = await getCultures();
      setCultures(data);
    } catch (error) {
      const e = error as { message?: string };
      toast({
        title: 'Erreur',
        description: e.message || 'Impossible de charger les cultures',
        variant: 'destructive',
      });
    }
  }, [toast]);

  useEffect(() => {
    loadCultures();
  }, [loadCultures]);

  useEffect(() => {
    // Get the current user's ID and ensure profile exists
    const getCurrentUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const userId = session.user.id;
        setFormData(prev => ({ ...prev, author_id: userId }));

        // Vérifier si le profil existe, sinon le créer
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', userId)
          .single();

        if (!profile) {
          await supabase.from('profiles').insert({
            id: userId,
            username: session.user.email?.split('@')[0] || 'user',
            full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Utilisateur'
          });
        }
      } else {
        navigate('/login');
      }
    };
    getCurrentUser();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await createArticle(formData);
      toast({
        title: 'Succès',
        description: 'L\'article a été publié avec succès',
      });
      navigate('/articles');
    } catch (error) {
      const e = error as { message?: string };
      toast({
        title: 'Erreur',
        description: e.message || 'Impossible de publier l\'article',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCultureChange = (value: string) => {
    setFormData((prev) => ({ ...prev, culture_id: value }));
  };

  return (
    <div className="container mx-auto py-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Écrire un nouvel article</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Titre de l'article *</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Un titre captivant..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="culture">Culture concernée *</Label>
            <Select
              required
              value={formData.culture_id}
              onValueChange={handleCultureChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez une culture" />
              </SelectTrigger>
              <SelectContent>
                {cultures.map((culture) => (
                  <SelectItem key={culture.id} value={culture.id}>
                    {culture.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Contenu de l'article *</Label>
            <Textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              placeholder="Rédigez votre article ici..."
              className="h-64 resize-y"
            />
          </div>

          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-benin-green hover:bg-benin-green/90"
            >
              {isLoading ? 'Publication...' : 'Publier l\'article'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/articles')}
            >
              Annuler
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
