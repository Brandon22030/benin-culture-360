import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getArticleById, supabase } from "@/services/supabase";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { ArrowLeft } from "lucide-react";
import type { Article } from "@/types/database.types";

type ArticleUpdate = Pick<Article, "title" | "content">;

export default function EditArticlePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<ArticleUpdate>({
    title: "",
    content: "",
  });

  useEffect(() => {
    const loadArticle = async () => {
      if (!id || !user) return;

      try {
        const article = await getArticleById(id);

        // Vérifier si l'utilisateur est l'auteur
        if (article.author_id !== user.id) {
          toast({
            title: "Non autorisé",
            description: "Vous n'êtes pas l'auteur de cet article",
            variant: "destructive",
          });
          navigate(`/articles/${id}`);
          return;
        }

        // Vérifier si l'article est encore modifiable (moins de 24h)
        const articleDate = new Date(article.created_at);
        const now = new Date();
        const diffInHours =
          (now.getTime() - articleDate.getTime()) / (1000 * 60 * 60);

        if (diffInHours > 24) {
          toast({
            title: "Non modifiable",
            description: "L'article ne peut plus être modifié après 24h",
            variant: "destructive",
          });
          navigate(`/articles/${id}`);
          return;
        }

        setFormData({
          title: article.title,
          content: article.content,
        });
      } catch (error) {
        const e = error as { message?: string };
        toast({
          title: "Erreur",
          description: e.message || "Impossible de charger l'article",
          variant: "destructive",
        });
        navigate("/articles");
      } finally {
        setIsLoading(false);
      }
    };

    loadArticle();
  }, [id, user, navigate, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from("articles")
        .update(formData)
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "L'article a été modifié avec succès",
      });
      navigate(`/articles/${id}`);
    } catch (error) {
      const e = error as { message?: string };
      toast({
        title: "Erreur",
        description: e.message || "Impossible de modifier l'article",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
      <Button
        variant="ghost"
        onClick={() => navigate(`/articles/${id}`)}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour à l'article
      </Button>

      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Modifier l'article</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Titre *</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Titre de l'article"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Contenu *</Label>
            <Textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              placeholder="Contenu de l'article..."
              className="h-64 resize-y"
            />
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
