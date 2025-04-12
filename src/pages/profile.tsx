import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/services/supabase-client';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2 } from 'lucide-react';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    async function getProfile() {
      try {
        setLoading(true);
        setFullName(user?.user_metadata?.full_name || '');
        setAvatarUrl(user?.user_metadata?.avatar_url || '');
      } catch (error) {
        console.error('Error loading profile:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger votre profil",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    getProfile();
  }, [user, navigate, toast]);

  async function updateProfile() {
    try {
      setLoading(true);

      const { data, error } = await supabase.auth.updateUser({
        data: {
          full_name: fullName,
        }
      });

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Votre profil a été mis à jour",
        className: "bg-green-50 text-green-900 border-green-200",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour votre profil",
        variant: "destructive",
        className: "bg-red-50 text-red-900 border-red-200",
      });
    } finally {
      setLoading(false);
    }
  }

  async function uploadAvatar(event: React.ChangeEvent<HTMLInputElement>) {

    try {
      setUploading(true);

      const file = event.target.files?.[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const filePath = `${user?.id}/avatar.${fileExt}`;


      // Upload the file to Supabase storage

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get the public URL

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update the user metadata with the new avatar URL


      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          avatar_url: publicUrl
        }
      });

      if (updateError) throw updateError;

      setAvatarUrl(publicUrl);
      toast({
        title: "Succès",
        description: "Votre avatar a été mis à jour",
        className: "bg-green-50 text-green-900 border-green-200",
      });
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour votre avatar",
        variant: "destructive",
        className: "bg-red-50 text-red-900 border-red-200",
      });
    } finally {
      setUploading(false);
    }
  }

  // Get initials from user's full name or email
  const getInitials = () => {
    if (fullName) {
      return fullName
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
    }
    return user?.email?.substring(0, 2).toUpperCase() || 'BC';
  };

  if (!user) return null;

  return (
    <div className="container max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-8">Mon Profil</h1>
      
      <div className="space-y-8">
        {/* Avatar Section */}
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="h-24 w-24 border-2 border-benin-green/30">
            {avatarUrl ? (
              <AvatarImage 
                src={avatarUrl} 
                alt="Avatar" 
                className="object-cover"
              />
            ) : (
              <AvatarFallback className="bg-benin-green/10 text-benin-green text-2xl">
                {getInitials()}
              </AvatarFallback>
            )}
          </Avatar>
          
          <div className="flex flex-col items-center space-y-2">
            <Label htmlFor="avatar" className="cursor-pointer">
              <div className="bg-benin-green text-white px-4 py-2 rounded-md hover:bg-benin-green/90 transition-colors">
                {uploading ? (
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Chargement...</span>
                  </div>
                ) : (
                  "Changer l'avatar"
                )}
              </div>
            </Label>
            <Input
              id="avatar"
              type="file"
              accept="image/*"
              onChange={uploadAvatar}
              disabled={uploading}
              className="hidden"
            />
          </div>
        </div>

        {/* Profile Form */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={user.email || ''}
              disabled
              className="bg-gray-50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fullName">Nom complet</Label>
            <Input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={loading}
            />
          </div>

          <Button
            onClick={updateProfile}
            disabled={loading}
            className="w-full bg-benin-green hover:bg-benin-green/90"
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Enregistrement...</span>
              </div>
            ) : (
              "Enregistrer les modifications"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
