import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/services/supabase-client";

const MusicDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchContributionDetails();
    }
  }, [id]);

  const fetchContributionDetails = async () => {
    try {
      const { data, error } = await supabase
        .from("music_pending")
        .select(`*,
          profiles:contributor_id (
            username,
            full_name,
            email
          )`)
        .eq("id", id)
        .single();

      if (error) {
        throw error;
      }

      if (!data) {
        throw new Error("Contribution non trouvée");
      }

      setItem(data);
    } catch (error) {
      // Gérer l'erreur de manière appropriée sans console.log
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
};

  if (isLoading) return <div>Chargement...</div>;
  if (!item)
    return (
      <div className="container py-8">
        <Button variant="outline" onClick={() => navigate(-1)} className="mb-6">
          Retour
        </Button>
        <div className="text-center text-red-500">
          Contribution musicale non trouvée ou inaccessible
        </div>
      </div>
    );

  return (
    <div className="container py-8">
      <Button variant="outline" onClick={() => navigate(-1)} className="mb-6">
        Retour
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{item.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            <div className="w-full relative rounded-lg overflow-hidden">
              {item.image_url && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">
                    Image de couverture
                  </h3>
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              )}

              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Fichier audio</h3>
                {item.audio_url ? (
                  <div className="bg-muted p-4 rounded-lg">
                    <audio
                      controls
                      className="w-full"
                      controlsList="nodownload"
                    >
                      <source src={item.audio_url} />
                      Votre navigateur ne supporte pas la lecture audio.
                    </audio>
                    <p className="text-sm text-gray-500 mt-2">
                      Format :{" "}
                      {item.audio_url?.split(".").pop()?.toUpperCase() ||
                        "Non spécifié"}
                    </p>
                  </div>
                ) : (
                  <p className="text-red-500">
                    Aucun fichier audio n'est disponible pour cette
                    contribution.
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-6">
              <div className="bg-muted p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">
                  Informations générales
                </h3>
                <div className="space-y-3">
                  <p>
                    <strong>Titre :</strong> {item.title || "-"}
                  </p>
                  <p>
                    <strong>Artiste :</strong> {item.artist || "-"}
                  </p>
                  <p>
                    <strong>Album :</strong> {item.album || "-"}
                  </p>
                  <p>
                    <strong>Année :</strong> {item.year || "-"}
                  </p>
                  <p>
                    <strong>Description :</strong> {item.description || "-"}
                  </p>
                  <p>
                    <strong>Crédit :</strong> {item.credit || "-"}
                  </p>
                  <p>
                    <strong>Source :</strong> {item.source || "-"}
                  </p>
                </div>
              </div>

              <div className="bg-muted p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">Métadonnées</h3>
                <div className="space-y-3">
                  <p>
                    <strong>Catégorie :</strong> {item.category || "-"}
                  </p>
                  <p>
                    <strong>Région :</strong> {item.region || "-"}
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

export default MusicDetails;
