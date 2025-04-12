import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Edit, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getArticleById, supabase } from '@/services/supabase';
import type { Article } from '@/types/database.types';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

type ArticleWithRelations = Article & {
  cultures: { name: string } | null;
  profiles: { username: string | null; full_name: string | null } | null;
};

export default function ArticleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<ArticleWithRelations | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthor, setIsAuthor] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const loadArticle = useCallback(async (articleId: string) => {
    try {
      const data = await getArticleById(articleId);
      setArticle(data);

      // Check if current user is the author
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user && data.author_id === session.user.id) {
        setIsAuthor(true);
      }
    } catch (error) {
      const e = error as { message?: string };
      toast({
        title: 'Erreur',
        description: e.message || 'Impossible de charger l\'article',
        variant: 'destructive',
      });
      navigate('/articles');
    } finally {
      setIsLoading(false);
    }
  }, [navigate, toast]);

  useEffect(() => {
    if (id) {
      loadArticle(id);
    }
  }, [id, loadArticle]);

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd MMMM yyyy', { locale: fr });
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

  return (
    <div className="container mx-auto py-6">
      <Button
        variant="ghost"
        onClick={() => navigate('/articles')}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour aux articles
      </Button>

      <article className="max-w-4xl mx-auto">
        <header className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-4xl font-bold">{article.title}</h1>
            {isAuthor && (
              <Button
                onClick={() => navigate(`/articles/${article.id}/edit`)}
                className="bg-benin-green hover:bg-benin-green/90"
              >
                <Edit className="mr-2 h-4 w-4" />
                Modifier
              </Button>
            )}
          </div>

          <div className="flex items-center justify-between text-gray-600">
            <div className="space-y-1">
              <p>
                Par {article.profiles?.full_name || article.profiles?.username || 'Anonyme'}
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
  );
}
