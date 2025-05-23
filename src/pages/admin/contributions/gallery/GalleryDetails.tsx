import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/services/supabase-client";

const GalleryDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const getImageUrls = (imageUrl: any) => {
    try {
      // Si c'est déjà une chaîne simple
      if (typeof imageUrl === "string") {
        return imageUrl.replace(/[\[\]"`\\]/g, "").trim();
      }

      // Si c'est une chaîne JSON
      const parsed = JSON.parse(imageUrl);
      if (Array.isArray(parsed)) {
        return parsed[0].replace(/[\[\]"`\\]/g, "").trim();
      }

      return parsed.replace(/[\[\]"`\\]/g, "").trim();
    } catch (error) {
      console.error("Erreur lors du parsing de l'URL:", error);
      return "/images/gallery/placeholder.jpg";
    }
  };

  useEffect(() => {
    if (id) {
      fetchContributionDetails();
    }
  }, [id]);

  const fetchContributionDetails = async () => {
    try {
      const { data, error } = await supabase
        .from("gallery_pending")
        .select(
          `
          *,
          profiles:contributor_id (
            username,
            full_name,
            email
          )
        `,
        )
        .eq("id", id)
        .single();

      if (error) throw error;
      setItem(data);
    } catch (error) {
      console.error("Erreur lors du chargement des détails:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div>Chargement...</div>;
  if (!item) return <div>Contribution non trouvée</div>;

  return (
    <div className="container py-4 sm:py-8 px-4 sm:px-6">
      <Button variant="outline" onClick={() => navigate(-1)} className="mb-4 sm:mb-6">
        Retour
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl">{item.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 sm:space-y-8">
            <div className="w-full relative rounded-lg overflow-hidden mb-4 sm:mb-6">
              <div className="relative aspect-[4/3] group cursor-pointer">
                <img
                  src={getImageUrls(item.image_url)}
                  alt={item.title}
                  className="w-full h-full object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.src = "/images/gallery/placeholder.jpg";
                  }}
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-lg">
                  <span className="text-white text-sm">Cliquer pour agrandir</span>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:gap-6">
              <div className="bg-muted p-4 sm:p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">
                  Informations générales
                </h3>
                <div className="space-y-3">
                  <p>
                    <strong>Titre :</strong> {item.title}
                  </p>
                  <p>
                    <strong>Description :</strong> {item.description}
                  </p>
                  <p>
                    <strong>Crédit :</strong> {item.credit}
                  </p>
                  <p>
                    <strong>Source :</strong> {item.source}
                  </p>
                </div>
              </div>

              <div className="bg-muted p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">Métadonnées</h3>
                <div className="space-y-3">
                  <p>
                    <strong>Catégorie :</strong> {item.category}
                  </p>
                  <p>
                    <strong>Région :</strong> {item.region}
                  </p>
                  <p>
                    <strong>Tags :</strong>{" "}
                    {item.tags?.join(", ") || "Aucun tag"}
                  </p>
                </div>
              </div>

              <div className="bg-muted p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">
                  Informations de soumission
                </h3>
                <div className="space-y-3">
                  <p>
                    <strong>Contribution faite le :</strong>{" "}
                    {new Date(item.created_at).toLocaleDateString("fr-FR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  <p>
                    <strong>Soumis par :</strong>{" "}
                    {item.profiles?.full_name ||
                      item.profiles?.username ||
                      "Utilisateur inconnu"}
                  </p>
                  <p>
                    <strong>Email du contributeur :</strong>{" "}
                    {item.profiles?.email ||
                      item.profiles?.username ||
                      "Utilisateur inconnu"}
                  </p>
                  <p>
                    <strong>Statut actuel :</strong> {item.status}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GalleryDetails;
