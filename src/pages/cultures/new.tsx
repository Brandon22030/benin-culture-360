import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { createCulture } from '@/services/supabase';
import { uploadImage } from '@/services/storage';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/types/database.types';
import { Image, Upload } from 'lucide-react';

type CultureInsert = Database['public']['Tables']['cultures']['Insert'];

export default function NewCulturePage() {
  const [formData, setFormData] = useState<CultureInsert>({
    name: '',
    description: '',
    region: '',
    image_url: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let imageUrl = formData.image_url;

      if (selectedFile) {
        imageUrl = await uploadImage(selectedFile);
      }

      await createCulture({
        ...formData,
        image_url: imageUrl,
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
            <Label htmlFor="region">Région</Label>
            <Input
              id="region"
              name="region"
              value={formData.region || ''}
              onChange={handleChange}
              placeholder="Ex: Abomey, Porto-Novo, etc."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
              placeholder="Description détaillée de la culture..."
              className="h-32"
            />
          </div>

          <div className="space-y-2">
            <Label>Image</Label>
            <div className="flex flex-col gap-4">
              {/* Zone de preview */}
              {(previewUrl || formData.image_url) && (
                <div className="relative w-full h-48 rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={previewUrl || formData.image_url}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Input file */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setSelectedFile(file);
                        setPreviewUrl(URL.createObjectURL(file));
                        // Réinitialiser l'URL si un fichier est sélectionné
                        setFormData(prev => ({ ...prev, image_url: '' }));
                      }
                    }}
                    className="hidden"
                    id="image-upload"
                  />
                  <Label
                    htmlFor="image-upload"
                    className="flex items-center gap-2 px-4 py-2 border rounded-md cursor-pointer hover:bg-gray-50"
                  >
                    <Upload size={20} />
                    {selectedFile ? selectedFile.name : 'Choisir une image'}
                  </Label>
                </div>

                <div className="flex-1">
                  <Input
                    id="image_url"
                    name="image_url"
                    type="url"
                    value={formData.image_url || ''}
                    onChange={(e) => {
                      handleChange(e);
                      // Réinitialiser le fichier si une URL est saisie
                      if (e.target.value) {
                        setSelectedFile(null);
                        setPreviewUrl('');
                      }
                    }}
                    placeholder="Ou entrez une URL d'image"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-benin-green hover:bg-benin-green/90"
            >
              {isLoading ? 'Enregistrement...' : 'Enregistrer'}
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
