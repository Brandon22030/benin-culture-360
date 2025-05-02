import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { EyeIcon, EyeOffIcon, Mail, Lock, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/services/supabase";

interface RegisterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const RegisterDialog = ({ open, onOpenChange }: RegisterDialogProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!agreeTerms) {
      toast({
        title: "Acceptation des conditions requise",
        description:
          "Veuillez accepter les conditions d'utilisation pour continuer.",
        variant: "destructive",
        className: "bg-red-50 text-red-900 border-red-200",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { data: signUpData, error: signUpError } =
        await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
            },
          },
        });

      if (signUpError) {
        throw signUpError;
      }

      if (signUpData.user) {
        const { data: existingProfile } = await supabase
          .from("profiles")
          .select()
          .eq("id", signUpData.user.id)
          .single();

        if (existingProfile) {
          const { error: profileError } = await supabase
            .from("profiles")
            .update({
              username: email.split("@")[0],
              full_name: name,
              email: email,
            })
            .eq("id", signUpData.user.id)
            .select();

          if (profileError) {
            throw profileError;
          }
        } else {
          const { error: profileError } = await supabase
            .from("profiles")
            .insert({
              id: signUpData.user.id,
              username: email.split("@")[0],
              full_name: name,
              email: email,
            })
            .select();

          if (profileError) {
            throw profileError;
          }
        }
      }

      toast({
        title: "Inscription réussie",
        description:
          "Veuillez vérifier votre boîte email pour confirmer votre compte.",
        className: "bg-green-50 text-green-900 border-green-200",
      });

      onOpenChange(false);
    } catch (error) {
      const e = error as { message?: string };
      toast({
        title: "Erreur d'inscription",
        description:
          e.message || "Impossible de créer le compte. Veuillez réessayer.",
        variant: "destructive",
        className: "bg-red-50 text-red-900 border-red-200",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Créer un compte</DialogTitle>
          <DialogDescription>
            Rejoignez la communauté BéninCulture360 et contribuez à la
            valorisation de la culture béninoise.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleRegister} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom complet</Label>
            <div className="relative">
              <User
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                size={18}
              />
              <Input
                id="name"
                type="text"
                placeholder="Jean Dupont"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="register-email">Email</Label>
            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                size={18}
              />
              <Input
                id="register-email"
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="register-password">Mot de passe</Label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                size={18}
              />
              <Input
                id="register-password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10"
                required
                minLength={6}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOffIcon size={18} />
                ) : (
                  <EyeIcon size={18} />
                )}
              </button>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="terms"
              checked={agreeTerms}
              onCheckedChange={(checked) => setAgreeTerms(checked === true)}
            />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              J'accepte les conditions d'utilisation et la politique de
              confidentialité
            </label>
          </div>
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-benin-green hover:bg-benin-green/90"
          >
            {isLoading ? "Création du compte..." : "S'inscrire"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RegisterDialog;
