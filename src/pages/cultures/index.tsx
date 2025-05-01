import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCultures } from "@/services/supabase";
import type { Culture } from "@/types/database.types";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/Layout";

export default function CulturesPage() {
  const [cultures, setCultures] = useState<Culture[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  const loadCultures = useCallback(async () => {
    try {
      const data = await getCultures();
      setCultures(data);
    } catch (error) {
      const e = error as { message?: string };
      toast({
        title: "Erreur",
        description: e.message || "Impossible de charger les cultures",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadCultures();
  }, [loadCultures]);

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => navigate("/")}
              className="gap-2"
            >
              <ArrowLeft size={16} />
              Retour
            </Button>
            <h1 className="text-3xl font-bold">Cultures du Bénin</h1>
          </div>
          <Button
            onClick={() => navigate("/cultures/new")}
            className="bg-benin-green hover:bg-benin-green/90"
          >
            <Plus className="mr-2 h-4 w-4" />
            Ajouter une culture
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-benin-green"></div>
          </div>
        ) : cultures.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">
              Aucune culture n'a été ajoutée pour le moment.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cultures.map((culture) => (
              <Card
                key={culture.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate(`/cultures/${culture.id}`)}
              >
                {culture.image_url && (
                  <div className="relative h-48 w-full">
                    <img
                      src={culture.image_url}
                      alt={culture.name}
                      className="absolute inset-0 w-full h-full object-cover rounded-t-lg"
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{culture.name}</CardTitle>
                </CardHeader>
                {culture.description && (
                  <CardContent>
                    <p className="text-gray-600 line-clamp-3">
                      {culture.description}
                    </p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
