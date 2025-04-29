import { useState, useEffect } from 'react';
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Edit2, Save, X, Upload, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/services/supabase-client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    avatar_url: ''
  });

  // Ajout d'un effet pour charger les données du profil
  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.user_metadata.full_name || '',
        avatar_url: user.user_metadata.avatar_url || ''
      });
    }
  }, [user]); // Dépendance à user pour recharger quand les données changent

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Veuillez vous connecter pour accéder à votre profil
          </h1>
        </div>
      </div>
    );
  }

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData({
      full_name: user?.user_metadata.full_name || '',
      avatar_url: user?.user_metadata.avatar_url || ''
    });
    setIsEditing(false);
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      // Vérification de la taille du fichier (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error('L\'image ne doit pas dépasser 2MB');
        return;
      }

      // Vérification du type de fichier
      if (!file.type.startsWith('image/')) {
        toast.error('Veuillez sélectionner une image');
        return;
      }

      setIsLoading(true);

      // Création d'un FormData pour l'upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'benin_culture_360');
      formData.append('cloud_name', import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);

      try {
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: 'POST',
            body: formData
          }
        );

        const data = await response.json();

        if (!response.ok) {
          console.error('Erreur Cloudinary:', data);
          throw new Error(data.error?.message || 'Erreur lors de l\'upload');
        }

        // Mise à jour des métadonnées de l'utilisateur
        const { error: userError } = await supabase.auth.updateUser({
          data: { 
            avatar_url: data.secure_url,
            avatar_public_id: data.public_id
          }
        });

        if (userError) throw userError;

        // Mise à jour de la table profiles
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ 
            avatar_url: data.secure_url 
          })
          .eq('id', user.id);

        if (profileError) throw profileError;

        // Rafraîchir les données de l'utilisateur
        await refreshUser();
        
        setFormData(prev => ({ ...prev, avatar_url: data.secure_url }));
        toast.success('Avatar mis à jour avec succès');
      } catch (uploadError) {
        console.error('Détails de l\'erreur:', uploadError);
        throw new Error(uploadError.message || 'Erreur lors de l\'upload vers Cloudinary');
      }
    } catch (error) {
      toast.error(error.message || 'Erreur lors de l\'upload de l\'avatar');
      console.error('Erreur complète:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      
      if (formData.full_name !== user.user_metadata.full_name) {
        // Mise à jour des métadonnées de l'utilisateur
        const { data: userData, error: userError } = await supabase.auth.updateUser({
          data: {
            full_name: formData.full_name,
            avatar_url: formData.avatar_url
          }
        });

        if (userError) throw userError;

        // Mise à jour de la table profiles
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            full_name: formData.full_name,
            avatar_url: formData.avatar_url
          })
          .eq('id', user.id);

        if (profileError) throw profileError;

        // Rafraîchir les données de l'utilisateur
        await refreshUser();
        
        toast.success('Profil mis à jour avec succès');
      }
      
      setIsEditing(false);
    } catch (error) {
      toast.error('Erreur lors de la mise à jour du profil');
      console.error('Erreur:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button
          variant="ghost"
          className="flex items-center gap-2 text-gray-600 hover:text-white"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="h-4 w-4" />
          Retour à l'accueil
        </Button>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">Mon Profil</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Informations Personnelles</CardTitle>
            {isEditing ? (
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={handleCancel}
                  disabled={isLoading}
                >
                  <X className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={handleSave}
                  disabled={isLoading}
                >
                  <Save className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handleEdit}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            )}
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 mb-6">
              <div className="relative">
                <Avatar className="h-20 w-20">
                  <AvatarImage 
                    src={formData.avatar_url} 
                    className="object-cover"
                    style={{ aspectRatio: '1/1' }}
                  />
                  <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                {isEditing && (
                  <div className="absolute bottom-0 right-0">
                    <label htmlFor="avatar-upload" className="cursor-pointer">
                      <div className="rounded-full bg-benin-green p-1 text-white hover:bg-benin-green/90">
                        <Upload size={16} />
                      </div>
                      <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarUpload}
                        disabled={isLoading}
                      />
                    </label>
                  </div>
                )}
              </div>
              <div>
                <h2 className="text-xl font-semibold">
                  {isEditing ? (
                    <Input
                      value={formData.full_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                      placeholder="Votre nom complet"
                      className="mt-1"
                    />
                  ) : (
                    formData.full_name || 'Non renseigné'
                  )}
                </h2>
                <p className="text-gray-500">{user.email}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Nom complet</label>
                {isEditing ? (
                  <Input
                    value={formData.full_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                    placeholder="Votre nom complet"
                    className="mt-1"
                  />
                ) : (
                  <p className="text-gray-900">{formData.full_name || 'Non renseigné'}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="text-gray-900">{user.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Date d'inscription</label>
                <p className="text-gray-900">
                  {new Date(user.created_at).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Carte des statistiques */}
        <Card>
          <CardHeader>
            <CardTitle>Statistiques</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Articles publiés</label>
                <p className="text-2xl font-semibold text-benin-green">0</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Contributions</label>
                <p className="text-2xl font-semibold text-benin-green">0</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Quiz complétés</label>
                <p className="text-2xl font-semibold text-benin-green">0</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
