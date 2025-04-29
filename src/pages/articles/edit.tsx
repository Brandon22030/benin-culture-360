import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
import { getArticleById, updateArticle, getCultures, supabase } from '@/services/supabase';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/types/database.types';
import type { Culture } from '@/types/database.types';
import { useAuth } from '@/hooks/use-auth';

type ArticleUpdate = Database['public']['Tables']['articles']['Update'];

export default function EditArticlePage() {
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState<ArticleUpdate>({
    title: '',
    content: '',
    culture_id: '',
  });
  const [cultures, setCultures] = useState<Culture[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const loadArticle = useCallback(async () => {
    if (!id) return;
    try {
      const article = await getArticleById(id);
      if (!article) throw new Error('Article non trouvé');

      // Vérifier si l'utilisateur est l'auteur
      if (article.author_id !== user?.id) {
        toast({
          title: 'Non autorisé',
          description: 'Vous n\'êtes pas l\'auteur de cet article',
          variant: 'destructive',
        });
        navigate('/articles');
        return;
      }

      // Vérifier si l'article est encore modifiable (24h)
      const articleDate = new Date(article.created_at);
      const now = new Date();
      const diffInHours = (now.getTime() - articleDate.getTime()) / (1000 * 60 * 60);
      
      if (diffInHours > 24) {
        toast({
          title: 'Non modifiable',
          description: 'L\'article ne peut plus être modifié après 24h',
          variant: 'destructive',
        });
        navigate('/articles');
        return;
      }

      setFormData({
        title: article.title,
        content: article.content,
        culture_id: article.culture_id,
      });
    } catch (error) {
      const e = error as { message?: string };
      toast({
        title: 'Erreur',
        description: e.message || 'Impossible de charger l\'article',
        variant: 'destructive',
      });
      navigate('/articles');
    }
  }, [id, navigate, toast, user]);

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
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadArticle();
    loadCultures();
  }, [loadArticle, loadCultures]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    
    setIsLoading(true);

    try {
      await updateArticle(id, formData);
      toast({
        title: 'Succès',
        description: 'L\'article a été mis à jour avec succès',
      });
      navigate(`/articles/${id}`);
    } catch (error) {
      const e = error as { message?: string };
      toast({
        title: 'Erreur',
        description: e.message || 'Impossible de mettre à jour l\'article',
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-benin-green"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Modifier l'article</h1>

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
              {isLoading ? 'Mise à jour...' : 'Mettre à jour l\'article'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(`/articles/${id}`)}
            >
              Annuler
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}