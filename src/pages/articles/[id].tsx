import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Edit, ArrowLeft, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getArticleById, supabase } from "@/services/supabase";
import type { Article } from "@/types/database.types";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useAuth } from "@/hooks/use-auth";
import Layout from "@/components/Layout";

type ArticleWithRelations = Article & {
  cultures: { name: string } | null;
  profiles: { username: string | null; full_name: string | null } | null;
};

export default function ArticleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<ArticleWithRelations | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const isArticleEditable = (createdAt: string) => {
    const articleDate = new Date(createdAt);
    const now = new Date();
    const diffInHours =
      (now.getTime() - articleDate.getTime()) / (1000 * 60 * 60);
    return diffInHours <= 24;
  };

  const loadArticle = useCallback(
    async (articleId: string) => {
      try {
        const data = await getArticleById(articleId);
        // Assurez-vous que getArticleById inclut la jointure avec la table profiles
        setArticle(data);
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
    },
    [navigate, toast],
  );

  useEffect(() => {
    if (id) {
      loadArticle(id);
    }
  }, [id, loadArticle]);

  const handleEdit = () => {
    if (!article || !user) return;

    // Normalisation des IDs pour la comparaison
    const authorId = String(article.author_id).trim();
    const userId = String(user.id).trim();

    if (authorId !== userId) {
      toast({
        title: "Non autorisé",
        description: "Vous n'êtes pas l'auteur de cet article",
        variant: "destructive",
      });
      return;
    }

    if (!isArticleEditable(article.created_at)) {
      toast({
        title: "Non modifiable",
        description: "L'article ne peut plus être modifié après 24h",
        variant: "destructive",
      });
      return;
    }

    navigate(`/articles/${id}/edit`);
  };

  const handleDelete = async () => {
    if (!article || !user) return;

    const isAuthor = user.id === article.author_id;

    if (!isAuthor) {
      toast({
        title: "Non autorisé",
        description: "Vous n'êtes pas l'auteur de cet article",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.from("articles").delete().eq("id", id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Article supprimé avec succès",
      });

      navigate("/articles");
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'article",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd MMMM yyyy", { locale: fr });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-benin-green"></div>
      </div>
    );
  }

  if (!article) {
    return null;
  }

  const canEdit =
    user &&
    user.id === article.author_id &&
    isArticleEditable(article.created_at);

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/articles")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour aux articles
        </Button>

        <article className="max-w-4xl mx-auto">
          <header className="mb-8">
            {article.image_url && (
              <div className="relative w-full h-[400px] mb-6 rounded-lg overflow-hidden">
                <img
                  src={article.image_url}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-4xl font-bold">{article.title}</h1>
              {user &&
                String(article.author_id).trim() === String(user.id).trim() && (
                  <div className="flex gap-2">
                    {isArticleEditable(article.created_at) && (
                      <Button
                        onClick={handleEdit}
                        className="bg-benin-green hover:bg-benin-green/90"
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Modifier
                      </Button>
                    )}
                    <Button onClick={handleDelete} variant="destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Supprimer
                    </Button>
                  </div>
                )}
            </div>

            <div className="flex items-center justify-between text-gray-600">
              <div className="space-y-1">
                <p>
                  Par{" "}
                  {article.profiles?.full_name ||
                    article.profiles?.username ||
                    "Auteur inconnu"}
                </p>
                {article.cultures?.name && (
                  <p className="text-benin-green">
                    Culture : {article.cultures.name}
                  </p>
                )}
              </div>
              <time dateTime={article.created_at}>
                {formatDate(article.created_at)}
              </time>
            </div>
          </header>

          <div className="prose max-w-none">
            <p className="whitespace-pre-line">{article.content}</p>
          </div>
        </article>
      </div>
    </Layout>
  );
}
