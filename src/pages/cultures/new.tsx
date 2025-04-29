import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { createCulture, supabase } from '@/services/supabase';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/types/database.types';
import { Upload } from 'lucide-react';

type CultureInsert = Database['public']['Tables']['cultures']['Insert'];

export default function NewCulturePage() {
  const { user } = useAuth();
  const [formData, setFormData] = useState<CultureInsert>({
    name: '',
    description: '',
    region: '',
    image_url: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      // Vérification de la taille du fichier (max 5MB)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!user) {
        toast({
          title: 'Erreur',
          description: 'Vous devez être connecté pour créer une culture',
          variant: 'destructive',
        });
        return;
      }

      await createCulture({
        ...formData,
        author_id: user.id  // Ajout de l'author_id
      });

      toast({
        title: 'Succès',
        description: 'La culture a été ajoutée avec succès',
      });
      navigate('/cultures');
    } catch (error) {
      const e = error as { message?: string };
      toast({
        title: 'Erreur',
        description: e.message || 'Impossible d\'ajouter la culture',
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

  return (
    <div className="container mx-auto py-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Ajouter une nouvelle culture</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nom de la culture *</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Ex: Fon, Yoruba, etc."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="region">Région *</Label>
            <Input
              id="region"
              name="region"
              value={formData.region}
              onChange={handleChange}
              required
              placeholder="Ex: Atlantique, Zou, etc."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Description détaillée de la culture..."
              className="h-32 resize-y"
            />
          </div>

          <div className="space-y-2">
            <Label>Image représentative</Label>
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
                    onClick={() => setFormData(prev => ({ ...prev, image_url: '' }))}
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
                      Parcourir
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
              {isLoading ? 'Enregistrement...' : 'Enregistrer la culture'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/cultures')}
            >
              Annuler
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
