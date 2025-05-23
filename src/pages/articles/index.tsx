import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getArticles } from "@/services/supabase";
import type { Article } from "@/types/database.types";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useAuth } from "@/hooks/use-auth";
import Layout from "@/components/Layout";

type ArticleWithRelations = Article & {
  cultures: { name: string } | null;
  profiles: {
    username: string | null;
    full_name: string | null;
  } | null;
};

export default function ArticlesPage() {
  const [articles, setArticles] = useState<ArticleWithRelations[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const handleNewArticle = () => {
    if (!user) {
      toast({
        title: "Non autorisé",
        description: "Vous devez être connecté pour écrire un article",
        variant: "destructive",
      });
      return;
    }
    navigate("/articles/new");
  };

  const loadArticles = useCallback(async () => {
    try {
      const data = await getArticles();
      setArticles(data);
    } catch (error) {
      const e = error as { message?: string };
      toast({
        title: "Erreur",
        description: e.message || "Impossible de charger les articles",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadArticles();
  }, [loadArticles]);

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd MMMM yyyy", { locale: fr });
  };

  return (
    <Layout>
      <div className="container mx-auto py-6 px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Button
              variant="outline"
              onClick={() => navigate("/")}
              className="gap-2"
            >
              <ArrowLeft size={16} />
              Retour
            </Button>
            <h1 className="text-2xl sm:text-3xl font-bold">
              Articles sur les Cultures du Bénin
            </h1>
          </div>
          <Button
            onClick={handleNewArticle}
            className="bg-benin-green hover:bg-benin-green/90 w-full sm:w-auto"
          >
            <Plus className="mr-2 h-4 w-4" />
            Écrire un article
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-benin-green"></div>
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">
              Aucun article n'a été publié pour le moment.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {articles.map((article) => (
              <Card
                key={article.id}
                className="cursor-pointer hover:shadow-lg transition-shadow overflow-hidden flex flex-col"
                onClick={() => navigate(`/articles/${article.id}`)}
              >
                {article.image_url && (
                  <div className="relative w-full h-40 sm:h-48">
                    <img
                      src={article.image_url}
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardHeader className="flex-grow">
                  <div className="flex flex-col space-y-1">
                    <CardTitle className="text-xl sm:text-2xl line-clamp-2">
                      {article.title}
                    </CardTitle>
                    <p className="text-sm text-gray-500">
                      {article.cultures?.name && (
                        <span className="font-medium text-benin-green">
                          Culture {article.cultures.name}
                        </span>
                      )}
                    </p>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm sm:text-base text-gray-600 line-clamp-3 mb-4">
                    {article.content}
                  </p>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 text-sm text-gray-500">
                    <span>
                      Par{" "}
                      {article.profiles?.full_name ||
                        article.profiles?.username ||
                        "Auteur inconnu"}
                    </span>
                    <span>{formatDate(article.created_at)}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
