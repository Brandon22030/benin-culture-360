import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  supabase,
  updateProfile,
  getProfile,
  uploadImage,
} from "@/services/supabase";

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    full_name: "",
    avatar_url: "",
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const loadProfile = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.user) {
        navigate("/login");
        return;
      }

      try {
        const profile = await getProfile(session.user.id);
        if (profile) {
          setFormData({
            username: profile.username || "",
            full_name: profile.full_name || "",
            avatar_url: profile.avatar_url || "",
          });
        }
      } catch (error) {
        const e = error as { message?: string };
        toast({
          title: "Erreur",
          description: e.message || "Impossible de charger le profil",
          variant: "destructive",
        });
      }
    };

    loadProfile();
  }, [navigate, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.user) throw new Error("Non authentifié");

      await updateProfile(session.user.id, formData);

      toast({
        title: "Succès",
        description: "Votre profil a été mis à jour",
      });
    } catch (error) {
      const e = error as { message?: string };
      toast({
        title: "Erreur",
        description: e.message || "Impossible de mettre à jour le profil",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsLoading(true);
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const userId = session?.user?.id;

      console.log("Session User:", session?.user);

      if (!userId) {
        console.error("No user ID found");
        toast({
          title: "Erreur",
          description: "Utilisateur non connecté",
          variant: "destructive",
        });
        return;
      }

      // Validation du fichier
      if (file.size > 5 * 1024 * 1024) {
        // 5MB max
        throw new Error("La taille du fichier ne doit pas dépasser 5 Mo");
      }

      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!allowedTypes.includes(file.type)) {
        throw new Error("Seuls les formats JPEG, PNG et WebP sont autorisés");
      }

      console.log("Uploading avatar for user:", userId);
      const avatarUrl = await uploadImage(file, "avatars", userId, true);
      console.log("Avatar URL:", avatarUrl);

      // Mettre à jour le profil Supabase
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ avatar_url: avatarUrl })
        .eq("id", userId);

      if (profileError) {
        console.error("Profile update error:", profileError);
        throw profileError;
      }

      // Mettre à jour les données utilisateur
      const { error: userError } = await supabase.auth.updateUser({
        data: { avatar_url: avatarUrl },
      });

      if (userError) {
        console.error("User update error:", userError);
        throw userError;
      }

      // Mettre à jour l'état local
      setFormData((prev) => ({ ...prev, avatar_url: avatarUrl }));

      toast({
        title: "Succès",
        description: "Votre photo de profil a été mise à jour",
      });
    } catch (error) {
      const e = error as { message?: string };
      console.error("Complete Avatar Upload Error:", e);
      toast({
        title: "Erreur",
        description: e.message || "Impossible de mettre à jour la photo",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Mon Profil</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {formData.avatar_url && (
              <div className="flex justify-center">
                <img
                  src={formData.avatar_url}
                  alt="Avatar"
                  className="w-32 h-32 rounded-full object-cover"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="avatar">Photo de profil</Label>
              <Input
                id="avatar"
                name="avatar"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Nom d'utilisateur</Label>
              <Input
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Votre nom d'utilisateur"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="full_name">Nom complet</Label>
              <Input
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="Votre nom complet"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-benin-green hover:bg-benin-green/90"
            >
              {isLoading
                ? "Enregistrement..."
                : "Enregistrer les modifications"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
            >
              Retour
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
