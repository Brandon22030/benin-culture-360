import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Upload } from 'lucide-react';
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
import Layout from '@/components/Layout';

type ArticleInsert = Database['public']['Tables']['articles']['Insert'];

type ArticleFormData = {
  title: string;
  content: string;
  culture_id: string | null;
  author_id: string;
  image_url: string | null;
};

export default function NewArticlePage() {
  const [formData, setFormData] = useState<ArticleFormData>({
    title: '',
    content: '',
    culture_id: null,
    author_id: '',
    image_url: null
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Vérification de la taille du fichier (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'Erreur',
        description: 'L\'image ne doit pas dépasser 5MB',
        variant: 'destructive',
      });
      return;
    }

    // Vérification du type de fichier
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Erreur',
        description: 'Veuillez sélectionner une image',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      // Upload vers Cloudinary
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'benin_culture_360');
      formData.append('cloud_name', import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Erreur lors de l\'upload');
      }

      setFormData(prev => ({ ...prev, image_url: data.secure_url }));
      toast({
        title: 'Succès',
        description: 'L\'image a été téléchargée avec succès',
      });
    } catch (error) {
      console.error('Erreur upload:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de télécharger l\'image',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

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
    <Layout>
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

            <div className="space-y-2">
              <Label>Image de l'article</Label>
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
                {formData.image_url ? (
                  <div className="space-y-4">
                    <img
                      src={formData.image_url}
                      alt="Aperçu"
                      className="mx-auto max-h-48 rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setFormData(prev => ({ ...prev, image_url: null }))}
                    >
                      Changer l'image
                    </Button>
                  </div>
                ) : (
                  <>
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-semibold">Télécharger une image</h3>
                    <p className="mt-1 text-xs text-gray-500">PNG, JPG jusqu'à 5MB</p>
                    <div className="mt-4">
                      <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <Label
                        htmlFor="image"
                        className="cursor-pointer inline-flex items-center rounded-md bg-benin-green px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-benin-green/90"
                      >
                        Parcourir les fichiers
                      </Label>
                    </div>
                  </>
                )}
              </div>
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
    </Layout>
  );
}
